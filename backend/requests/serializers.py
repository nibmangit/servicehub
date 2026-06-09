from rest_framework import serializers
from .models import ServiceRequest
from services.models import Service

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