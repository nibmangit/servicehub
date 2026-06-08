from .models import ProviderProfile
from accounts.models import User


def become_provider(user: User, experience="", skills=""):
    if user.is_provider:
        return None

    user.is_provider = True
    user.save()

    provider = ProviderProfile.objects.create(
        user=user,
        experience=experience,
        skills=skills
    )

    return provider