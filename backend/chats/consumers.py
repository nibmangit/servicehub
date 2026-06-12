from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

from .services import ChatService, ChatReadService, ConversationAccessService
from .models import Conversation
from .presence import PresenceService


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
        
        await self.accept()
        
        await self.set_user_online(user.id)
        await self.broadcast_presence(user.id, True)

        await self.mark_messages_as_read()
        await self.broadcast_read_state()
        
        # await self.channel_layer.group_send(
        #     self.room_group_name, {
        #         "type": "presence_event",
        #         "user_id": user.id,
        #         "is_online": True
        #     }
        # )
        
        # await self.mark_messages_as_read()
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         "type": "messages_read",
        #         "conversation_id": self.conversation_id,
        #     }
        # )

    async def disconnect(self, close_code):
        user = self.scope["user"]
        
        if user and not user.is_anonymous:
            await self.set_user_offline(user.id)
            await self.broadcast_presence(user.id, False)
        
        # await self.channel_layer.group_send(
        #     self.room_group_name, {
        #         "type": "presence_event",
        #         "user_id": user.id,
        #         "is_online": False
        #     }
        # )
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data) 
        user = self.scope["user"]

        if not user or user.is_anonymous:
            return
        
        event_type = data.get("type")
        
        #typing event
        if event_type == "typing":
            is_typing = data.get("is_typing", False)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_event",
                    "user_id": user.id,
                    "is_typing": is_typing,
                }
            )
            return

        content = data.get("content") or data.get("message")
        
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
        
    # ---------------- EVENTS ----------------
    #message broadcast
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "data": event["message"]
        }))
    
    #typing broadcast
    async def typing_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "typing",
            "user_id": event["user_id"],
            "is_typing": event["is_typing"]
        }))
        
    async def messages_read(self, event):
        await self.send(text_data=json.dumps({
            "type": "messages_read",
            "conversation_id": event["conversation_id"]
        }))
    
    async def presence_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "presence",
            "user_id": event["user_id"],
            "is_online": event["is_online"]
        }))
        
    # ---------------- BROADCAST HELPERS ----------------
    async def broadcast_presence(self, user_id, is_online):
        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "presence_event",
                "user_id": user_id,
                "is_online": is_online
            }
        )

    async def broadcast_read_state(self):
        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "messages_read",
                "conversation_id": self.conversation_id,
            }
        )

    # ---------------- DB OPERATIONS ----------------
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
    
    @database_sync_to_async
    def set_user_online(self, user_id):
        PresenceService.set_online(user_id)

    @database_sync_to_async
    def set_user_offline(self, user_id):
        PresenceService.set_offline(user_id)