from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count

from .models import Review
from services.models import Service


def update_service_and_provider_metrics(service):
    if not service:
        return
 
    # Service Metrics 
    service_reviews = Review.objects.filter( request__service=service )

    service_metrics = service_reviews.aggregate(
        avg_rating=Avg("rating"),
        total=Count("id")
    )

    service.average_rating = service_metrics["avg_rating"] or 0.0
    service.review_count = service_metrics["total"] or 0
    service.save(
        update_fields=[
            "average_rating",
            "review_count"
        ]
    )
 
    # Provider Metrics  
    provider = service.provider

    provider_reviews = Review.objects.filter(
        request__service__provider=provider
    )

    provider_metrics = provider_reviews.aggregate(
        avg_rating=Avg("rating"),
        total=Count("id")
    )

    provider.rating = provider_metrics["avg_rating"] or 0.0
    provider.total_reviews = provider_metrics["total"] or 0

    provider.save(
        update_fields=[
            "rating",
            "total_reviews"
        ]
    )


@receiver(post_save, sender=Review)
def calculate_ratings_on_save(sender, instance, **kwargs):
    if instance.request and instance.request.service:
        update_service_and_provider_metrics(instance.request.service )


@receiver(post_delete, sender=Review)
def calculate_ratings_on_delete(sender, instance, **kwargs):
    if instance.request and instance.request.service:
        update_service_and_provider_metrics(instance.request.service )