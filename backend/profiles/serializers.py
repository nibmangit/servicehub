from rest_framework import serializers
from .models import UserProfile, ProviderApplication, Skill
from .services import submit_provider_application
from cloudinary.utils import cloudinary_url

class ProviderApplicationSerializer(serializers.ModelSerializer):
    skills = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.filter(is_active=True),
        many=True
    )

    class Meta:
        model = ProviderApplication
        fields = ["id", "skills", "experience_years", "professional_summary", "status", "submitted_at", ]
        read_only_fields = ["id", "status", "submitted_at", ]
        
    def create(self, validated_data):
        skills = validated_data.pop('skills', [])
        user = self.context['request'].user
        
        application = submit_provider_application(
            user=user,
            skills=skills,
            **validated_data
        )
        
        if application is None:
            raise serializers.ValidationError("You have already submitted a pending application or you are already a provider.")
        
        return application
    
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