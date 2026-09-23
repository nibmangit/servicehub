from rest_framework import serializers
from .models import Conversation, Message
from .services import ChatService


class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source="sender.id", read_only=True)
    sender_email = serializers.EmailField(source="sender.email", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender_id", "sender_email", "content", "is_read", "read_at", "created_at"]
        read_only_fields = fields


class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    service_title = serializers.CharField(source="request.service.title", read_only=True)
    request_status = serializers.CharField(source="request.status", read_only=True)
    other_participant_id = serializers.SerializerMethodField()
    other_participant_email = serializers.SerializerMethodField()
    other_participant_name = serializers.SerializerMethodField()
    

    class Meta:
        model = Conversation
        fields = [
            "id", "request", "service_title", "request_status",
            "other_participant_id", "other_participant_email", "other_participant_name",
            "last_message", "unread_count", "created_at",
        ]
        read_only_fields = fields

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                "content": last_msg.content,
                "sender": last_msg.sender.email,
                "created_at": last_msg.created_at,
            }
        return None

    def get_unread_count(self, obj):
        user = self.context["request"].user
        return obj.messages.filter(is_read=False).exclude(sender=user).count()

    def get_other_participant_email(self, obj):
        user = self.context["request"].user
        request_obj = obj.request
        if request_obj.customer == user:
            return request_obj.provider.user.email
        return request_obj.customer.email

    def get_other_participant_name(self, obj):
        user = self.context["request"].user
        request_obj = obj.request
        if request_obj.customer == user:
            return request_obj.provider.user.userprofile.full_name
        return request_obj.customer.userprofile.full_name
    
    def get_other_participant_id(self, obj):
        user = self.context["request"].user
        request_obj = obj.request
        if request_obj.customer == user:
            return request_obj.provider.user.id
        return request_obj.customer.id


class MessageCreateSerializer(serializers.Serializer):
    content = serializers.CharField()