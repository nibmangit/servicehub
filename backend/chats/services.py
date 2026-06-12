from django.utils import timezone 
from rest_framework.exceptions import ValidationError
from .models import Message
from notifications.services import NotificationService
from .models import Conversation 

class ChatService:

    @staticmethod
    def send_message(conversation_id, sender, content):
        conversation = Conversation.objects.get(id=conversation_id)
        request_obj = conversation.request

        is_customer = request_obj.customer == sender
        is_provider = (
            hasattr(sender, "providerprofile")
            and request_obj.provider == sender.providerprofile
        )

        if not (is_customer or is_provider):
            raise ValidationError("Not allowed")

        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content
        )

        conversation.save(update_fields=["updated_at"])

        receiver = (
            request_obj.provider.user
            if is_customer
            else request_obj.customer
        )

        NotificationService.notify(
            user=receiver,
            notification_type="NEW_MESSAGE",
            title="New Message",
            message=f"You received a new message regarding {request_obj.service.title}",
            request=request_obj
        )

        return message
    

class ChatReadService:

    @staticmethod
    def mark_conversation_as_read(conversation, user):

        messages = Message.objects.filter(
            conversation=conversation,
        ).exclude(sender=user)

        messages.update(
            is_read=True,
            read_at=timezone.now()
        )