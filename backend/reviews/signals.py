from django.db.models.signals import post_save, post_delete
from django.db import models
from django.dispatch import receiver
from django.db.models import Avg
from .models import Review
from services.models import Service

def update_service_and_provider_metrics(service):
    if not service:
        return
        
    # 1. Recalculate metrics for the specific Service Listing
    review_queryset = Review.objects.filter(request__service=service)
    metrics = review_queryset.aggregate(avg_rating=Avg('rating'), total=models.Count('id'))
    
    service.average_rating = metrics['avg_rating'] or 0.0
    service.review_count = metrics['total'] or 0
    service.save()

    # 2. Recalculate global aggregate metrics for the Provider Profile
    provider = service.provider
    all_provider_services = Service.objects.filter(provider=provider)
    
    # Run an average calculation across all of this provider's services combined
    provider_metrics = all_provider_services.aggregate(avg_rating=Avg('average_rating'), total=models.Sum('review_count'))
    
    provider.rating = provider_metrics['avg_rating'] or 0.0
    provider.total_reviews = provider_metrics['total'] or 0
    provider.save()

@receiver(post_save, sender=Review)
def calculate_ratings_on_save(sender, instance, **kwargs):
    if instance.request and instance.request.service:
        update_service_and_provider_metrics(instance.request.service)

@receiver(post_delete, sender=Review)
def calculate_ratings_on_delete(sender, instance, **kwargs):
    if instance.request and instance.request.service:
        update_service_and_provider_metrics(instance.request.service)
    
