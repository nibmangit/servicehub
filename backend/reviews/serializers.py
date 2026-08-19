from rest_framework import serializers
from .models import Review
from .services import ReviewService

class ReviewSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='request.customer.userprofile.full_name', read_only=True)
    client_avatar = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'request','client_name', 'client_avatar', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ["created_at", "updated_at"]
        
    def get_client_avatar(self, obj):
        try:
            profile = obj.request.customer.userprofile
            if profile.avatar:
                return profile.avatar.url
        except (AttributeError, ValueError):
            pass
        return None

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
    
    def create(self, validated_data):
        return ReviewService.create_review(
            request_obj=validated_data["request"],
            rating=validated_data["rating"],
            comment=validated_data.get("comment"),
        )