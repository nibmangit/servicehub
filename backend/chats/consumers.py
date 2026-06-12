from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

from .services import ChatService


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
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

        if not content:
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