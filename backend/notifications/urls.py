from django.urls import path
from .views import *

app_name = "notifications"

urlpatterns = [
    path("", NotificationListView.as_view(), name="list"),
    path("<int:pk>/read/", NotificationUpdateView.as_view(), name="mark_read"),
    path("<int:pk>/delete/", NotificationDeleteView.as_view(), name="delete"),
    
     path("unread-count/", UnreadNotificationCountView.as_view(), name="unread_count"),
      path("read-all/", MarkAllNotificationsAsReadView.as_view(), name="read_all"),
]