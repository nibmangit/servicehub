from rest_framework import serializers
from .models import ServiceRequest
from reviews.models import Review
from .services import ServiceRequestService 
from django.utils import timezone


class ServiceRequestSerializer(serializers.ModelSerializer):
    start_otp = serializers.SerializerMethodField()
    complete_otp = serializers.SerializerMethodField()
    
    service_title = serializers.CharField(source='service.title', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    provider_email = serializers.CharField(source='provider.user.email', read_only=True)
    provider_name = serializers.CharField(source='provider.user.userprofile.full_name', read_only=True)
    review = serializers.SerializerMethodField()

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'customer', 'provider', 'service', 'service_title',
            'customer_email', 'provider_email', 'provider_name', 'description',
            'preferred_date', 'address', 'status', 'rejection_reason',
            'agreed_price', 'start_otp', 'complete_otp', 'review',
            'completed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'customer', 'provider', 'status', 'rejection_reason',
            'agreed_price', 'start_otp', 'complete_otp',
            'completed_at', 'created_at', 'updated_at'
        ]
        
    def get_review(self, obj):
        try:
            r = obj.review
            return {"rating": r.rating, "comment": r.comment, "created_at": r.created_at}
        except Review.DoesNotExist:
            return None

    def validate(self, attrs):
        service = attrs.get('service')
        preferred_date = attrs.get("preferred_date")
        user = self.context['request'].user

        if not service:
            raise serializers.ValidationError("Service is required.")

        if hasattr(user, 'providerprofile') and service.provider == user.providerprofile:
            raise serializers.ValidationError("You cannot book your own service.")

        if not service.is_active:
            raise serializers.ValidationError("Service is inactive.")

        if not service.provider.is_available:
            raise serializers.ValidationError("Provider unavailable.")

        if preferred_date and preferred_date <= timezone.now():
            raise serializers.ValidationError("Invalid date.")
        
        active_statuses = ['PENDING', 'ACCEPTED', 'IN_PROGRESS']
        existing_request = ServiceRequest.objects.filter(
            customer=user,
            service=service,
            status__in=active_statuses
        ).exists()

        if existing_request:
            raise serializers.ValidationError(
                "You already have an active or pending request for this service."
            )

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        service = validated_data['service']

        return ServiceRequest.objects.create(
            customer=user,
            provider=service.provider,
            agreed_price=service.price or 0,
            **validated_data
        )
        
    def get_start_otp(self, obj):
        request = self.context.get("request")

        if request and request.user == obj.customer:
            return obj.start_otp

        return None
    
    def get_complete_otp(self, obj):
        request = self.context.get("request")

        if request and request.user == obj.customer:
            return obj.complete_otp

        return None

class RequestStatusUpdateSerializer(serializers.ModelSerializer):

    otp_code = serializers.CharField(write_only=True, required=False)
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ServiceRequest
        fields = ['status', 'otp_code', 'rejection_reason']

    def update(self, instance, validated_data):

        return ServiceRequestService.change_status(
            request_obj=instance,
            new_status=validated_data.get("status").upper(),
            user=self.context["request"].user,
            otp_code=validated_data.get("otp_code"),
            rejection_reason=validated_data.get("rejection_reason"),
        )