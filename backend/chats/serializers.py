from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source="sender.email", read_only=True )

    class Meta:
        model = Message
        fields = [ "id", "conversation", "sender", "sender_email", "content", "is_read", "created_at", ]
        read_only_fields = [ "id", "conversation", "sender", "is_read", "created_at", ]
        
    def create(self, validated_data):
        return Message.objects.create(
            conversation=self.context["conversation"],
            sender=self.context["request"].user,
            **validated_data
        )
        
class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True )

    class Meta:
        model = Conversation
        fields = ["id", "request", "messages", "created_at", ] 
        read_only_fields = fields
        
class MessageCreateSerializer(serializers.Serializer):
    content = serializers.CharField()