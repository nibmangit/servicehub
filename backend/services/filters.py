from django_filters import rest_framework as filters
from .models import Service

class ServiceFilter(filters.FilterSet):
    # Set up exact and range filters for pricing matrix
    min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')
    
    # Category lookup matching the sector primary key ID
    category = filters.NumberFilter(field_name="category__id")
    
    # Filter by specific pricing types ('hourly', 'fixed')
    price_type = filters.CharFilter(field_name="price_type", lookup_expr='iexact')
    provider = filters.NumberFilter(field_name="provider__id")

    class Meta:
        model = Service
        fields = ['category', 'price_type', 'min_price', 'max_price', 'provider'] 