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