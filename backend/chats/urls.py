from django.urls import path
from .views import *

app_name = "chats"

urlpatterns = [
    path("", ConversationListView.as_view(), name="conversation_list"),
    path("<int:pk>/", ConversationDetailView.as_view(), name="conversation_detail" ),
    path("<int:conversation_id>/messages/", MessageListCreateView.as_view(), name="message_list_create" ),
]