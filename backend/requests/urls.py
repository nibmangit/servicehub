from django.urls import path
from .views import *

app_name = 'requests'

urlpatterns = [ 
    path('', RequestListCreateView.as_view(), name='request_list_create'),
    path('<int:pk>/', RequestDetailView.as_view(), name='request_detail_update'),
    path('<int:pk>/status/', RequestStatusUpdateView.as_view(), name='request_status_update'),
]