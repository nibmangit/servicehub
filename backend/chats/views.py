from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Conversation
from .serializers import *


class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if hasattr(user, "providerprofile"):
            conversations = Conversation.objects.filter(
                Q(request__customer=user) |
                Q(request__provider=user.providerprofile))
        else:
            conversations = Conversation.objects.filter(request__customer=user )
            
        serializer = ConversationSerializer(conversations.order_by("-created_at"), many=True )

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

        serializer = ConversationSerializer(conversation)

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

        serializer = MessageSerializer(conversation.messages.all(), many=True )

        return Response(serializer.data)

    def post(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, pk=conversation_id )

        request_obj = conversation.request
        is_customer = request_obj.customer == request.user

        is_provider = (hasattr(request.user, "providerprofile")
            and request_obj.provider == request.user.providerprofile)

        if not (is_customer or is_provider):
            return Response( {"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN )

        serializer = MessageSerializer(
            data=request.data,
            context={
                "request": request,
                "conversation": conversation
            }  )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST )