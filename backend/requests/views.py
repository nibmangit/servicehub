from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView 
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import ServiceRequest
from .serializers import *

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
            
        serializer = ServiceRequestSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ServiceRequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            service_request = serializer.save()
            from notifications.services import create_notification

            create_notification(
                user=service_request.provider.user,
                notification_type="REQUEST_CREATED",
                title="New Service Request",
                message=f"{request.user.email} requested {service_request.service.title}",
                request=service_request
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     

class RequestDetailUpdateView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Safeguard: Ensure you can only fetch details of a request you are a party to
        if hasattr(user, 'providerprofile'):
            return ServiceRequest.objects.filter(Q(customer=user) | Q(provider=user.providerprofile))
        return ServiceRequest.objects.filter(customer=user)

    def get_serializer_class(self):
        # Dynamically switch serializers based on the incoming action type
        if self.request.method in ['PUT', 'PATCH']:
            return RequestStatusUpdateSerializer
        return ServiceRequestSerializer