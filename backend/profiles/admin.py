from django.contrib import admin
from .models import *

admin.site.register(UserProfile)
admin.site.register(ProviderProfile)
admin.site.register(Skill)
admin.site.register(ProviderApplication)
