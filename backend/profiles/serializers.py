from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import UserProfile, ProviderApplication, Skill
from .services import submit_provider_application
from cloudinary.utils import cloudinary_url

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'is_active']
        
class ProviderApplicationSerializer(serializers.ModelSerializer):
    skills = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.filter(is_active=True), many=True )
    skills_detail = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = ProviderApplication
        fields = ["id", "skills_detail", "skills", "experience_years", "professional_summary",  
                   "rejection_reason", "reviewed_at", "reviewed_by", "status", "submitted_at"]
        
        read_only_fields = ["id", "status","rejection_reason", "reviewed_at", "reviewed_by", "submitted_at",]

    def get_skills_detail(self, obj):
        return SkillSerializer(obj.skills.all(), many=True).data

    def create(self, validated_data):
        skills = validated_data.pop('skills', [])
        user = self.context['request'].user
        
        try:
            application = submit_provider_application(
                user=user,
                skills=skills,
                **validated_data
            )
        except ValidationError as e:
            raise serializers.ValidationError({"detail": e.messages})
        
        if application is None:
            raise serializers.ValidationError(
                {
                    "detail": (
                        "You already have a pending provider application "
                        "or you are already a provider."
                    )
                }
            )
        
        return application
    
class UserProfileSerializer(serializers.ModelSerializer): 
    email = serializers.EmailField(source='user.email', read_only=True)  
    is_customer = serializers.BooleanField(source='user.is_customer', read_only=True)
    is_provider = serializers.BooleanField(source='user.is_provider', read_only=True)
    provider_status = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile 
        fields = ['id', 'email', 'is_customer', 'is_provider', 'provider_status',
                  'full_name', 'phone', 'city', 'bio', 'avatar', 'created_at', 'updated_at']
        read_only_fields = ['id', 'is_customer', 'is_provider', 'provider_status', 'created_at', 'updated_at']
    
    def get_provider_status(self, obj):
        application = ProviderApplication.objects.filter(user=obj.user).first()
        return application.status if application else None
    
    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.avatar:
            url, _ = cloudinary_url(
                instance.avatar.public_id,
                secure=True
            )
            data["avatar"] = url

        return data