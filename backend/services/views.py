from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .permissions import IsServiceProviderOwner
from .models import Service
from .serializers import ServiceSerializer

class ServiceListCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request): 
        services = Service.objects.filter(is_active=True)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request): 
        if not request.user.is_provider:
            return Response(
                {"detail": "Permission Denied: Only verified providers can create service listings."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = ServiceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ServiceDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    # Anyone can view details (SAFE_METHODS), but only the owner can modify/delete
    permission_classes = [IsServiceProviderOwner]