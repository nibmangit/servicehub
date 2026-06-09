from django.urls import path
from .views import ServiceListCreateView

app_name = 'services'

urlpatterns = [ 
    path('', ServiceListCreateView.as_view(), name='service_list_create'),
]