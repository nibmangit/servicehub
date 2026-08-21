from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import ServiceRequest
from .serializers import *
from notifications.services import NotificationService

class RequestListCreateView(ListCreateAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['service', 'status']
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "providerprofile"):
            return ServiceRequest.objects.filter(
            Q(customer=user) |
            Q(provider=user.providerprofile) ).select_related( "customer", "provider__user", "service", )

        return ServiceRequest.objects.filter(customer=user ).select_related( "customer", "provider__user", "service", )

    def perform_create(self, serializer):
        service_request = serializer.save()
        
        NotificationService.notify(
                user=service_request.provider.user,
                notification_type="REQUEST_CREATED",
                title="New Service Request",
                message=f"{self.request.user.email} requested {service_request.service.title}",
                request=service_request
        )
            

class RequestDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceRequestSerializer

    def get_queryset(self):
        user = self.request.user

        if hasattr(user, "providerprofile"):
            return ServiceRequest.objects.filter(
                Q(customer=user) |
                Q(provider=user.providerprofile)
            )

        return ServiceRequest.objects.filter(customer=user)
    
class RequestStatusUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RequestStatusUpdateSerializer

    def get_queryset(self):
        user = self.request.user

        if hasattr(user, "providerprofile"):
            return ServiceRequest.objects.filter(
                Q(customer=user) |
                Q(provider=user.providerprofile)
            )

        return ServiceRequest.objects.filter(customer=user)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # 1. Validate and update using RequestStatusUpdateSerializer
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_instance = serializer.save()

        # 2. Return the full object representation using ServiceRequestSerializer so the frontend keeps its ID
        response_serializer = ServiceRequestSerializer(updated_instance, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_200_OK)