from rest_framework import serializers
from .models import ServiceRequest
from services.models import Service 
from django.utils import timezone

class ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = ['id', 'customer', 'provider', 'service', 'description', 'preferred_date', 'address', 'status', 'agreed_price', 'completed_at', 'created_at', 'updated_at' ]
        read_only_fields = ['id', 'customer', 'provider', 'status', 'agreed_price', 'completed_at', 'created_at', 'updated_at']

    def validate(self, attrs):
        service = attrs.get('service')
        
        # Self-booking prevention guard
        user = self.context['request'].user
        if hasattr(user, 'providerprofile') and service.provider == user.providerprofile:
            raise serializers.ValidationError("Validation Error: You cannot open a service request on your own listing.")
            
        return attrs

    def create(self, validated_data):
        customer = self.context['request'].user
        service = validated_data['service']
        
        # Pull implicit context directly from the chosen service listing
        provider = service.provider
        agreed_price = service.price if service.price else 0.00

        return ServiceRequest.objects.create(
            customer=customer,
            provider=provider,
            agreed_price=agreed_price,
            **validated_data
        )
        

class RequestStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = ['status']

    def validate_status(self, value): 
        return value.upper()

    def update(self, instance, validated_data):
        new_status = validated_data.get('status')
        user = self.context['request'].user
 
        # ROLE 1: CUSTOMER OPERATION GUARD 
        if instance.customer == user:
            if new_status != "CANCELLED":
                raise serializers.ValidationError("Permission Denied: As a customer, you can only transition a request to CANCELLED.")
            
            if instance.status in ["COMPLETED", "REJECTED"]:
                raise serializers.ValidationError(f"Invalid Operation: Cannot cancel a request that is already {instance.status}.")
 
        # ROLE 2: PROVIDER OPERATION GUARD 
        elif hasattr(user, 'providerprofile') and instance.provider == user.providerprofile:
            if new_status == "CANCELLED":
                raise serializers.ValidationError("Permission Denied: Providers cannot use the cancel status. Use REJECTED instead.")
            
            # Automated structural lifecycle rule validation
            if instance.status == "PENDING" and new_status not in ["ACCEPTED", "REJECTED"]:
                raise serializers.ValidationError("Transition Error: From PENDING you can only transition to ACCEPTED or REJECTED.")
                
            if instance.status == "ACCEPTED" and new_status != "IN_PROGRESS":
                raise serializers.ValidationError("Transition Error: From ACCEPTED you can only transition to IN_PROGRESS.")
                
            if instance.status == "IN_PROGRESS" and new_status != "COMPLETED":
                raise serializers.ValidationError("Transition Error: From IN_PROGRESS you can only transition to COMPLETED.")

            # Automatically stamp completion time when entering final state
            if new_status == "COMPLETED":
                instance.completed_at = timezone.now()

        else:
            raise serializers.ValidationError("Auth Error: You do not have permission to modify this service request.")

        instance.status = new_status
        instance.save()
        return instance