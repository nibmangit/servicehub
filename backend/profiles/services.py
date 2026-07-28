from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction
from .models import ProviderApplication, ProviderProfile
from accounts.models import User 
from identity.models import IdentityVerification

@transaction.atomic
def submit_provider_application(user: User, skills, experience_years, professional_summary):
    """
    Submits a provider application for the given user.
    """
    # Check if the user already has a provider profile
    if user.is_provider:
        return None

    #verify if the user has already submitted an application and it is pending
    existing_application = ProviderApplication.objects.filter(user=user, status=ProviderApplication.Status.PENDING).first()
    if existing_application:
        return None
    
    # Check if the user has a verified identity verification
    verification = IdentityVerification.objects.filter(
        user=user,
        status=IdentityVerification.Status.VERIFIED
    ).first()
    if not verification:
        raise ValidationError("Identity verification is required before applying as a provider." )
    
    # Create a new provider application
    application = ProviderApplication.objects.create(
        user=user,
        experience_years=experience_years,
        professional_summary=professional_summary, 
    )
    
    # Add skills to the application
    application.skills.set(skills)
    
    return application

@transaction.atomic
def approve_provider_application(application_id, admin_user: User):
    """
    Approves a provider application and creates the provider profile.
    """
    application = ProviderApplication.objects.select_for_update().get(id=application_id )

    # prevent double approval
    if application.status != ProviderApplication.Status.PENDING:
        raise ValidationError("Only pending applications can be approved." )

    user = application.user
    
    # create provider profile
    provider_profile = ProviderProfile.objects.create( user=user )

    # upgrade user account
    user.is_provider = True
    user.save(update_fields=["is_provider"])

    # update application
    application.status = ProviderApplication.Status.APPROVED  
    application.reviewed_by = admin_user
    application.reviewed_at = timezone.now()
    application.save(
        update_fields=[
            "status", 
            "reviewed_by",
            "reviewed_at"
        ]
    )


    return provider_profile

@transaction.atomic
def reject_provider_application(application_id, admin_user: User, reason):
    """
    Rejects a provider application.
    """

    application = ProviderApplication.objects.select_for_update().get(id=application_id )

    # prevent double rejection
    if application.status != ProviderApplication.Status.PENDING:
        raise ValidationError("Only pending applications can be rejected." )

    # update application
    application.status = ProviderApplication.Status.REJECTED 
    application.rejection_reason = reason
    application.reviewed_by = admin_user
    application.reviewed_at = timezone.now()
    application.save(
        update_fields=[
            "status", 
            "rejection_reason",
            "reviewed_by",
            "reviewed_at"
        ]
    )
    return application