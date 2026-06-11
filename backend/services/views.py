from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.generics import RetrieveUpdateDestroyAPIView, DestroyAPIView, ListCreateAPIView
from .permissions import IsServiceProviderOwner, IsImageOwner
from django.shortcuts import get_object_or_404
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Service, ServiceImage
from .serializers import *
from .filters import ServiceFilter

class ServiceListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
     
    filterset_class = ServiceFilter 
    search_fields = ['title', 'description', 'category__name'] 
    ordering_fields = ['price', 'average_rating', 'created_at'] 
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        if not request.user.is_provider:
            return Response(
                {
                    "detail": (
                        "Permission Denied: "
                        "Only verified providers can create service listings."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().create(request, *args, **kwargs)
    
    
class ServiceDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer 
    permission_classes = [IsServiceProviderOwner]
    
class ServiceImageUploadView(APIView): 
    permission_classes = [IsAuthenticated, IsServiceProviderOwner] 
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk): 
        service = get_object_or_404(Service, pk=pk)
        self.check_object_permissions(request, service)

        image_file = request.FILES.get("image")

        if not image_file:
            return Response(
                {"detail": "Image file is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        image = ServiceImage.objects.create(service=service, image=image_file )

        serializer = ServiceImageSerializer(image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class ServiceImageDeleteView(DestroyAPIView):
    queryset = ServiceImage.objects.all() 
    permission_classes = [IsAuthenticated, IsImageOwner]