from rest_framework import serializers
from accounts.models import User
from profiles.models import ProviderApplication
from profiles.serializers import SkillSerializer
from categories.serializers import CategorySerializer  # noqa — reused directly for admin CRUD
from profiles.serializers import SkillSerializer as _SkillSerializer  # noqa — reused directly
from identity.serializers import IdentityVerificationSerializer


class AdminUserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="userprofile.full_name", read_only=True, default=None)
    phone = serializers.CharField(source="userprofile.phone", read_only=True, default=None)
    city = serializers.CharField(source="userprofile.city", read_only=True, default=None)
    provider_status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "email", "full_name", "phone", "city",
            "is_customer", "is_provider", "is_staff", "is_superuser", "is_active",
            "provider_status", "date_joined",
        ]
        read_only_fields = fields

    def get_provider_status(self, obj):
        application = getattr(obj, "providerapplication", None)
        return application.status if application else None


class AdminUserFlagsSerializer(serializers.Serializer):
    is_active = serializers.BooleanField(required=False)
    is_staff = serializers.BooleanField(required=False)


class AdminProviderApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.userprofile.full_name", read_only=True)
    skills = serializers.SlugRelatedField(slug_field="name", many=True, read_only=True)
    reviewed_by_email = serializers.EmailField(source="reviewed_by.email", read_only=True)

    class Meta:
        model = ProviderApplication
        fields = [
            "id", "user", "user_email", "user_full_name",
            "skills", "experience_years", "professional_summary",
            "status", "rejection_reason",
            "reviewed_by", "reviewed_by_email", "reviewed_at",
            "submitted_at",
        ]
        read_only_fields = fields


class AdminApplicationRejectSerializer(serializers.Serializer):
    reason = serializers.CharField()
    
class AdminIdentityVerificationSerializer(IdentityVerificationSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta(IdentityVerificationSerializer.Meta):
        fields = IdentityVerificationSerializer.Meta.fields + ["user_email"]
        read_only_fields = fields