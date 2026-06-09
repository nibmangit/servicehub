from rest_framework import serializers
from .models import Review
from requests.models import ServiceRequest

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'request', 'rating', 'comment', 'created_at', 'updated_at']

    def validate(self, attrs):
        request_obj = attrs.get('request')
        user = self.context['request'].user

        # Guard 1: Ensure the user trying to leave the review is the actual customer of the request
        if request_obj.customer != user:
            raise serializers.ValidationError("Permission Denied: You cannot review a service request you did not order.")

        # Guard 2: Enforce the transaction milestone rule
        if request_obj.status != "COMPLETED":
            raise serializers.ValidationError(f"Validation Error: You can only review a service after it is marked as COMPLETED. Current state: {request_obj.status}")

        return attrs