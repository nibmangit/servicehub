from rest_framework import serializers

from .models import IdentityVerification
from .services import verify_fayda_identity


class FaydaVerificationSerializer(serializers.Serializer):
    fin = serializers.CharField(max_length=20)

    def create(self, validated_data):
        user = self.context["request"].user
        verification = verify_fayda_identity(
            user=user,
            fin=validated_data["fin"]
        )

        return verification


class IdentityVerificationSerializer(serializers.ModelSerializer):

    citizen_name = serializers.SerializerMethodField()
    citizen_phone = serializers.SerializerMethodField()
    citizen_city = serializers.SerializerMethodField()


    class Meta:
        model = IdentityVerification

        fields = ["id", "provider", "status", "fin", "citizen_name", "citizen_phone",
            "citizen_city", "verified_at", "created_at", ]

        read_only_fields = ["id", "provider", "status", "fin", "verified_at", "created_at", ]


    def get_citizen_name(self, obj):
        if obj.citizen:
            return (
                f"{obj.citizen.first_name} "
                f"{obj.citizen.middle_name} "
                f"{obj.citizen.last_name}"
            )

        return None


    def get_citizen_phone(self, obj):
        if obj.citizen:
            return obj.citizen.phone

        return None


    def get_citizen_city(self, obj):
        if obj.citizen:
            return obj.citizen.city

        return None