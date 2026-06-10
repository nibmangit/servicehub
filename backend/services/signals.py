from django.db.models.signals import post_delete
from django.dispatch import receiver
from cloudinary.uploader import destroy

from .models import ServiceImage


@receiver(post_delete, sender=ServiceImage)
def delete_service_image(sender, instance, **kwargs):
    if instance.image:
        destroy(instance.image.public_id)