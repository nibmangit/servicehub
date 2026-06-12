from rest_framework import serializers
from .models import Conversation, Message
from .services import ChatService


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source="sender.email", read_only=True )

    class Meta:
        model = Message
        fields = [ "id", "sender", "sender_email", "content", "is_read", 'read_at', "created_at", ]
        read_only_fields = [ "id", "conversation", "sender", "is_read", "created_at", ]
        
class ConversationSerializer(serializers.ModelSerializer): 
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "request","last_message",
            "unread_count", "created_at", ] 
        read_only_fields = fields
        
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                "content": last_msg.content,
                "sender": last_msg.sender.email,
                "created_at": last_msg.created_at
            }
        return None
    
    def get_unread_count(self, obj):
        user = self.context["request"].user

        return obj.messages.filter(
            is_read=False
        ).exclude(sender=user).count()
        
class MessageCreateSerializer(serializers.Serializer):
    content = serializers.CharField()