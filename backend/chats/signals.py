from django.db.models.signals import post_save
from django.dispatch import receiver

from requests.models import ServiceRequest
from .models import Conversation


@receiver(post_save, sender=ServiceRequest)
def create_conversation(sender, instance, created, **kwargs):

    if created:
        Conversation.objects.create(request=instance)