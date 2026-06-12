from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Notification
from .dispatcher import NotificationDispatcher


@receiver(post_save, sender=Notification)
def send_notification_realtime(sender, instance, created, **kwargs):
    if created:
        NotificationDispatcher.push(instance)