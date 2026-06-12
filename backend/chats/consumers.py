from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

from .services import ChatService, ChatReadService, ConversationAccessService
from .models import Conversation


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        
        user = self.scope["user"]
        allowed = await self.is_allowed(self.conversation_id, user)
        if not user or user.is_anonymous or not allowed:
            await self.close()
            return
        
        self.room_group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.mark_messages_as_read()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "messages_read",
                "conversation_id": self.conversation_id,
            }
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get("message")

        user = self.scope["user"]

        if not user or user.is_anonymous:
            return

        message_data = await self.save_message(self.conversation_id, user, content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat.message",
                "message": message_data
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))
        
    async def messages_read(self, event):
        await self.send(text_data=json.dumps({
            "type": "messages_read",
            "conversation_id": event["conversation_id"]
        }))

    @database_sync_to_async
    def save_message(self, conversation_id, user, content):
        message = ChatService.send_message(
            conversation_id=conversation_id,
            sender=user,
            content=content
        )

        return {
            "id": message.id,
            "conversation_id": message.conversation_id,
            "sender_id": message.sender.id,
            "sender_email": message.sender.email,
            "content": message.content,
            "is_read": message.is_read,
            "created_at": message.created_at.isoformat(),
        }
        
    @database_sync_to_async
    def mark_messages_as_read(self):
        conversation = Conversation.objects.get(id=self.conversation_id)
        user = self.scope["user"]

        ChatReadService.mark_conversation_as_read(conversation, user)
        
    @database_sync_to_async
    def is_allowed(self, conversation_id, user):
        try:
            ConversationAccessService.get_conversation_for_user(
                conversation_id,
                user
            )
            return True

        except Exception:
            return False