from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from requests.models import ServiceRequest
from chats.models import Message
from reviews.models import Review
from notifications.models import Notification

from .cache import clear_dashboard_cache

@receiver(post_save, sender=ServiceRequest)
def invalidate_dashboard_on_request_change(sender, instance, **kwargs):
    clear_dashboard_cache(instance.customer.id)
    clear_dashboard_cache(instance.provider.user.id)

@receiver(post_save, sender=Message)
def invalidate_dashboard_on_message(sender, instance, **kwargs):
    request = instance.conversation.request

    clear_dashboard_cache(request.customer.id)
    clear_dashboard_cache(request.provider.user.id)

@receiver(post_save, sender=Review)
def invalidate_dashboard_on_review(sender, instance, **kwargs):
    request = instance.request

    clear_dashboard_cache(request.customer.id)
    clear_dashboard_cache(request.provider.user.id)

@receiver(post_save, sender=Notification)
def invalidate_dashboard_on_notification(sender, instance, **kwargs):
    clear_dashboard_cache(instance.user.id)

