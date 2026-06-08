from django.contrib import admin
from .models import UserProfile, ProviderProfile

admin.site.register(UserProfile)
admin.site.register(ProviderProfile)