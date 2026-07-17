from rest_framework import serializers
from .models import Service, ServiceImage

class ServiceImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ServiceImage
        fields = ['id', 'image', 'created_at']
        
    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None


class ServiceSerializer(serializers.ModelSerializer): 
    images = ServiceImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Service
        fields = ['id', 'provider', 'category', 'title', 'description', 'price_type', 'price', 'duration', 'average_rating', 'review_count', 'is_active', 'images', 'created_at', 'updated_at' ] 
        read_only_fields = ['id', 'provider', 'average_rating', 'review_count', 'created_at', 'updated_at']
        
class ServiceImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = ["id", "image", "is_primary", "created_at"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.image:
            data["image"] = instance.image.url

        return data