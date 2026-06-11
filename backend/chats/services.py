from rest_framework.exceptions import ValidationError
from .models import Message
from notifications.services import NotificationService

class ChatService:

    @staticmethod
    def send_message(conversation, sender, content):
        request_obj = conversation.request

        # Permission Check
        is_customer = request_obj.customer == sender

        is_provider = (hasattr(sender, "providerprofile")
            and request_obj.provider == sender.providerprofile)

        if not (is_customer or is_provider):
            raise ValidationError("You are not allowed to send messages in this conversation.")

        # Create Message
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content
        )

        # Determine Receiver
        receiver = (request_obj.provider.user if is_customer else request_obj.customer )

        # Create Notification
        NotificationService.notify(
            user=receiver,
            notification_type="NEW_MESSAGE",
            title="New Message",
            message=f"You received a new message regarding {request_obj.service.title}",
            request=request_obj
        )

        return message