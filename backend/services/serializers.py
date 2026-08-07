from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import Service, ServiceImage
from categories.serializers import CategorySerializer

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
    category_detail = CategorySerializer(source='category', read_only=True) 
    provider_name = serializers.CharField(source='provider.user.userprofile.full_name', read_only=True)
    provider_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Service
        fields = ['id', 'provider', 'provider_avatar', 'provider_name', 'category', 'category_detail', 'title', 'description', 'location', 'price_type', 'price', 'duration', 'average_rating', 'review_count', 'is_active', 'images', 'created_at', 'updated_at' ] 
        read_only_fields = ['id', 'provider', 'average_rating', 'review_count', 'created_at', 'updated_at']
        
    def get_provider_avatar(self, obj):
        try:
            profile = obj.provider.user.userprofile
            if profile.avatar:
                return profile.avatar.url 
        except (AttributeError, ValueError):
            pass
        return None
        
class ServiceImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = ["id", "image", "is_primary", "created_at"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.image:
            data["image"] = instance.image.url

        return data