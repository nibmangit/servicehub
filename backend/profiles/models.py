from django.db import models
from accounts.models import User
from cloudinary.models import CloudinaryField

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)

    bio = models.TextField(blank=True, null=True)
    avatar = image = CloudinaryField("image")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ProviderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    experience = models.TextField(blank=True, null=True)
    skills = models.TextField(blank=True, null=True)

    is_available = models.BooleanField(default=True)

    rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)