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

    def create(self, validated_data):
        # Automatically grab the logged-in user's provider profile context
        user = self.context['request'].user
        provider_profile = user.providerprofile # OneToOne reverse relationship
        
        # Inject the provider instance into the database creation query
        service = Service.objects.create(provider=provider_profile, **validated_data)
        return service