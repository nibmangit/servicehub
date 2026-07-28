from django.utils import timezone
from django.db import transaction
from django.core.exceptions import ValidationError

from .models import FakeFaydaCitizen, IdentityVerification
from accounts.models import User


@transaction.atomic
def verify_fayda_identity(user: User, fin: str):
    """
    Verify user identity using Fake Fayda database.
    """

    # Check if user already verified
    existing_verification = IdentityVerification.objects.filter(
        user=user,
        status=IdentityVerification.Status.VERIFIED
    ).first()

    if existing_verification:
        raise ValidationError("User identity is already verified.")


    # Find citizen in fake Fayda database
    citizen = FakeFaydaCitizen.objects.filter(
        fin=fin,
        is_active=True
    ).first()


    # FIN not found
    if not citizen:
        verification = IdentityVerification.objects.create(
            user=user,
            fin=fin,
            status=IdentityVerification.Status.FAILED
        )

        raise ValidationError("Invalid FIN number.")


    # Create or update verification record
    verification, created = IdentityVerification.objects.update_or_create(
        user=user,
        defaults={
            "fin": fin,
            "citizen": citizen,
            "provider": IdentityVerification.Provider.FAYDA,
            "status": IdentityVerification.Status.VERIFIED,
            "verified_at": timezone.now(),
        }
    )


    return verification