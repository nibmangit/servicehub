from django.urls import path
from .views import *

app_name = 'profiles'

urlpatterns = [ 
    path('me/', MyProfileView.as_view(), name='my_profile'),
    path('become-provider/', BecomeProviderView.as_view(), name='become_provider'),
]