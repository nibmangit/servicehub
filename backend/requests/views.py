from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import ServiceRequest
from .serializers import *
from notifications.services import NotificationService

class RequestListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Filter rows dynamically based on the requesting user's identity role
        if hasattr(user, 'providerprofile'):
            queryset = ServiceRequest.objects.filter(
                Q(customer=user) | Q(provider=user.providerprofile)
            ).order_by('-created_at')
        else:
            queryset = ServiceRequest.objects.filter(customer=user).order_by('-created_at')
            
        serializer = ServiceRequestSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ServiceRequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            service_request = serializer.save()

            NotificationService.notify(
                user=service_request.provider.user,
                notification_type="REQUEST_CREATED",
                title="New Service Request",
                message=f"{request.user.email} requested {service_request.service.title}",
                request=service_request
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     

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