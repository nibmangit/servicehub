from django.utils import timezone 
from rest_framework.exceptions import ValidationError
from .models import Message
from notifications.services import NotificationService
from .models import Conversation 
from django.shortcuts import get_object_or_404
from .models import Conversation
from .active import ActiveChatService


class ConversationAccessService:

    @staticmethod
    def user_has_access(conversation, user):
        request_obj = conversation.request
        is_customer = request_obj.customer == user

        is_provider = (hasattr(user, "providerprofile")
            and request_obj.provider == user.providerprofile)

        return is_customer or is_provider

    @staticmethod
    def get_conversation_for_user(conversation_id, user):
        conversation = get_object_or_404(
            Conversation.objects.select_related(
                "request",
                "request__customer",
                "request__provider",
            ),
            id=conversation_id)

        if not ConversationAccessService.user_has_access(conversation, user ):
            raise ValidationError("Not allowed")

        return conversation
    
class ChatService:

    @staticmethod
    def send_message(conversation_id, sender, content):
        conversation = (ConversationAccessService.get_conversation_for_user(conversation_id, sender ) )
        request_obj = conversation.request
 
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content
        )

        conversation.save(update_fields=["updated_at"])
        
        is_customer = request_obj.customer == sender 
        receiver = (
            request_obj.provider.user
            if is_customer
            else request_obj.customer
        )

        if ActiveChatService.get_active(receiver.id) != conversation.id:
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