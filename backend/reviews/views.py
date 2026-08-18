from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Review
from .serializers import ReviewSerializer

class ReviewListCreateView(ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def get_queryset(self):
        queryset = Review.objects.all().order_by('-created_at')
        
        # Filter by service ID if provided in query parameters (e.g. ?service=1)
        service_id = self.request.query_params.get('service')
        if service_id:
            queryset = queryset.filter(request__service_id=service_id)
            
        return queryset