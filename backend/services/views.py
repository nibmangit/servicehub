from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView,RetrieveUpdateDestroyAPIView, DestroyAPIView, ListCreateAPIView, CreateAPIView
from .permissions import IsProviderOrReadOnly, IsServiceProviderOwner, IsImageOwner
from django.shortcuts import get_object_or_404
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Service, ServiceImage
from .serializers import *
from .filters import ServiceFilter

class ServiceListCreateView(ListAPIView):
    permission_classes = [IsProviderOrReadOnly]
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
     
    filterset_class = ServiceFilter 
    search_fields = ['title', 'description', 'category__name'] 
    ordering_fields = ['price', 'average_rating', 'created_at'] 
    ordering = ['-created_at']
    
    def get_queryset(self):
        return (
            Service.objects
            .filter(is_active=True)
            .select_related("provider", "category")
            .prefetch_related("images")
        )
        
class MyServicesListView(ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated, IsProviderOrReadOnly]
    
    def get_queryset(self):
        return (
            Service.objects
            .filter(provider=self.request.user.providerprofile)
            .select_related("provider", "category")
            .prefetch_related("images")
        )

    def perform_create(self, serializer): 
        serializer.save(provider=self.request.user.providerprofile)
    
class ServiceDetailView(RetrieveUpdateDestroyAPIView): 
    serializer_class = ServiceSerializer 
    permission_classes = [IsServiceProviderOwner] 
    
    def get_queryset(self):
        return (
            Service.objects
            .select_related("provider", "category")
            .prefetch_related("images")
        )
    
class ServiceImageUploadView(CreateAPIView):
    serializer_class = ServiceImageUploadSerializer
    permission_classes = [IsAuthenticated, IsServiceProviderOwner] 
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        service = get_object_or_404(Service, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, service)
        serializer.save(service=service) 
    
    

class ServiceImageDeleteView(DestroyAPIView):
    queryset = ServiceImage.objects.select_related("service__provider") 
    permission_classes = [IsAuthenticated, IsImageOwner]