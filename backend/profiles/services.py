from django.db import transaction
from .models import ProviderApplication, ProviderProfile
from accounts.models import User

@transaction.atomic
def submit_provider_application(user: User, skills, experience_years, professional_summary):
    """
    Submits a provider application for the given user.
    """
    # Check if the user already has a provider profile
    if user.is_provider:
        return None

    #verify if the user has already submitted an application and it is pending
    existing_application = ProviderApplication.objects.filter(user=user, status='pending').first()
    if existing_application:
        return None
    
    # Create a new provider application
    application = ProviderApplication.objects.create(
        user=user,
        experience_years=experience_years,
        professional_summary=professional_summary
    )
    
    # Add skills to the application
    application.skills.set(skills)
    
    return application