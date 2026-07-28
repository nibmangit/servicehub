from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response 
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .pagination import MessagePagination
from .models import Conversation, Message
from .serializers import *
from .services import ChatReadService, ChatService, ConversationAccessService


class ConversationListView(ListAPIView):
    serializers_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        if hasattr(user, "providerprofile"):
            return(
                Conversation.objects.filter(
                Q(request__customer=user) |
                Q(request__provider=user.providerprofile)
                ).select_related("request", "request__customer", "request__service"
                ).prefetch_related("messages__sender")
            )
        return(
            Conversation.objects.filter(request__customer=user 
                                                        ).select_related("request", "request__service"
                                                        ).prefetch_related("messages__sender")
        )

class ConversationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            conversation = (ConversationAccessService.get_conversation_for_user(pk, request.user))
        except ValidationError:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        ChatReadService.mark_conversation_as_read(conversation, request.user)

        serializer = ConversationSerializer(conversation, context={"request": request} )

        return Response(serializer.data)
    
class MessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            conversation = (ConversationAccessService.get_conversation_for_user(conversation_id, request.user))
        except ValidationError:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        messages = conversation.messages.all()

        paginator = MessagePagination()
        page = paginator.paginate_queryset(messages, request)

        serializer = MessageSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    def post(self, request, conversation_id):
        try:
            conversation = (ConversationAccessService.get_conversation_for_user(conversation_id, request.user))
        except ValidationError:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = MessageCreateSerializer(
            data=request.data,
            context={
                "request": request,
                "conversation": conversation,
            }
        )

        if serializer.is_valid():
            message = ChatService.send_message(
                conversation_id=conversation.id,
                sender=request.user,
                content=serializer.validated_data["content"]
            )
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UnreadMessageCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if hasattr(user, "providerprofile"):
            conversations = Conversation.objects.filter(
                Q(request__customer=user) |
                Q(request__provider=user.providerprofile))
        else:
            conversations = Conversation.objects.filter(
                request__customer=user)

        unread_count = Message.objects.filter(
            conversation__in=conversations,
            is_read=False ).exclude(sender=user).count()

        return Response({"unread_count": unread_count})