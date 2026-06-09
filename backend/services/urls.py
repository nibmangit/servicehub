from django.urls import path
from .views import *

app_name = 'services'

urlpatterns = [ 
    path('', ServiceListCreateView.as_view(), name='service_list_create'),
    path('<int:pk>/', ServiceDetailView.as_view(), name='service_detail'),
    
    path('<int:pk>/images/', ServiceImageUploadView.as_view(), name='service_image_upload'), 
    path('images/<int:pk>/', ServiceImageDeleteView.as_view(), name='service_image_delete'),
]