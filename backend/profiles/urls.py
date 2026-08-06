from django.urls import path
from .views import *

app_name = 'profiles'

urlpatterns = [ 
    path('me/', MyProfileView.as_view(), name='my_profile'),
    path('apply-provider/', ProviderApplicationView.as_view(), name='apply_provider'),
    
    path('skills/', SkillListView.as_view(), name='skill_list'),
]