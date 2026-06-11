from django.db import models
from django.contrib.auth import get_user_model 
from requests.models import ServiceRequest 

User = get_user_model()

class Conversation(models.Model):
    request = models.OneToOneField(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name="conversation"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation #{self.id}"
    

class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )

    content = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Message #{self.id}"