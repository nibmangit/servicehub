from rest_framework import serializers
from .models import ProviderProfile, UserProfile
from .services import become_provider
from cloudinary.utils import cloudinary_url

class ProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile 
        fields = ['id', 'experience', 'skills', 'is_available', 'rating', 'total_reviews', 'created_at' ] 
        read_only_fields = ['id', 'rating', 'total_reviews', 'created_at']

    def create(self, validated_data): 
        user = self.context['request'].user
         
        experience = validated_data.get('experience', '')
        skills = validated_data.get('skills', '')
         
        provider_profile = become_provider(
            user=user, 
            experience=experience, 
            skills=skills
        )
        
        # Guard against users who try to upgrade twice
        if provider_profile is None:
            raise serializers.ValidationError(
                {"detail": "Operational Error: You are already registered as a provider."}
            )
            
        return provider_profile
    
class UserProfileSerializer(serializers.ModelSerializer): 
    email = serializers.EmailField(source='user.email', read_only=True)  

    class Meta:
        model = UserProfile 
        fields = ['id', 'email', 'full_name', 'phone', 'city', 'bio', 'avatar', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.avatar:
            url, _ = cloudinary_url(
                instance.avatar.public_id,
                secure=True
            )
            data["avatar"] = url

        return data