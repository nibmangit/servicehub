from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Review
from .serializers import ReviewSerializer

REVIEW_RELATED = (
    'request', 'request__customer', 'request__customer__userprofile',
    'request__service', 'request__service__provider',
    'request__service__provider__user',
    'request__service__provider__user__userprofile',
)


class ReviewListCreateView(ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.select_related(*REVIEW_RELATED).order_by('-created_at')

        service_id = self.request.query_params.get('service')
        if service_id:
            queryset = queryset.filter(request__service_id=service_id)

        # Public: reviews received by a specific provider (used on their profile page)
        provider_id = self.request.query_params.get('provider')
        if provider_id:
            queryset = queryset.filter(request__service__provider_id=provider_id)

        # Reviews I've written, as a customer
        if self.request.query_params.get('mine') == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(request__customer=self.request.user)

        # Reviews I've received, as a provider
        if self.request.query_params.get('received') == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(request__service__provider__user=self.request.user)

        return queryset


class ReviewDetailView(RetrieveAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Review.objects.select_related(*REVIEW_RELATED)