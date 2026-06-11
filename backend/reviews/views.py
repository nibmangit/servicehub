from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Review
from .serializers import ReviewSerializer

class ReviewListCreateView(ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    # Public users can read reviews, but only authenticated clients can write them
    permission_classes = [IsAuthenticatedOrReadOnly] 