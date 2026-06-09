from django.urls import path
from .views import RequestListCreateView

app_name = 'requests'

urlpatterns = [ 
    path('', RequestListCreateView.as_view(), name='request_list_create'),
]