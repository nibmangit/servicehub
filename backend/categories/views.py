from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from .models import Category
from .serializers import CategorySerializer

class CategoryListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    pagination_class = None  # Disable pagination

    def get_queryset(self):
        return Category.objects.filter(is_active=True)