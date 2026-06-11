from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .pagination import MessagePagination
from .models import Conversation, Message
from .serializers import *
from .services import ChatReadService, ChatService


class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if hasattr(user, "providerprofile"):
            conversations = Conversation.objects.filter(
                Q(request__customer=user) |
                Q(request__provider=user.providerprofile)
                ).select_related("request", "request__customer", "request__service"
                ).prefetch_related("messages" )
        else:
            conversations = Conversation.objects.filter(request__customer=user 
                                                        ).select_related("request", "request__service"
                                                        ).prefetch_related("messages")
            
        serializer = ConversationSerializer(conversations.order_by("-updated_at"), many=True, context={"request": request} )

        return Response(serializer.data)
    


class ConversationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk)
        request_obj = conversation.request
        is_customer = request_obj.customer == request.user
        
        is_provider = ( hasattr(request.user, "providerprofile")
            and request_obj.provider == request.user.providerprofile
        )

        if not (is_customer or is_provider):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN )
        
        ChatReadService.mark_conversation_as_read(conversation, request.user)

        serializer = ConversationSerializer(conversation, context={"request": request})

        return Response(serializer.data)
    
class MessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, pk=conversation_id)
        request_obj = conversation.request
        
        is_customer = request_obj.customer == request.user
        is_provider = (hasattr(request.user, "providerprofile")
            and request_obj.provider == request.user.providerprofile)

        if not (is_customer or is_provider):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN )

        messages = conversation.messages.all()

        paginator = MessagePagination()
        page = paginator.paginate_queryset(messages, request)

        serializer = MessageSerializer(page, many=True)

        return paginator.get_paginated_response(
            serializer.data
        )

    def post(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, pk=conversation_id )
        request_obj = conversation.request
        
        is_customer = request_obj.customer == request.user
        is_provider = (hasattr(request.user, "providerprofile")
            and request_obj.provider == request.user.providerprofile)

        if not (is_customer or is_provider):
            return Response( {"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN )

        serializer = MessageCreateSerializer(
            data=request.data,
            context={
                "request": request,
                "conversation": conversation
            }  )

        if serializer.is_valid():
            message = ChatService.send_message(
                conversation=conversation,
                sender=request.user,
                content=serializer.validated_data["content"]
            )
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST )
    
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