from django.db.models.signals import post_save, pre_save, post_delete
from cloudinary.uploader import destroy
from django.dispatch import receiver
from accounts.models import User
from .models import UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance) # Guard against duplicate creation attempts
        

@receiver(pre_save, sender=UserProfile)
def delete_old_avatar_on_update(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_profile = UserProfile.objects.get(pk=instance.pk)
    except UserProfile.DoesNotExist:
        return

    old_avatar = old_profile.avatar
    
    if old_avatar and instance.avatar != old_avatar:
        destroy(old_avatar.public_id)
        

@receiver(post_delete, sender=UserProfile)
def delete_avatar_on_profile_delete(sender, instance, **kwargs):
    if instance.avatar:
        destroy(instance.avatar.public_id)