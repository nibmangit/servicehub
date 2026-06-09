from django.db import models
from accounts.models import User
from profiles.models import ProviderProfile
from categories.models import Category


class Service(models.Model):
    PRICE_TYPES = (
        ("fixed", "Fixed"),
        ("hourly", "Hourly"),
        ("negotiable", "Negotiable"),
    )
    provider = models.ForeignKey(ProviderProfile,  on_delete=models.CASCADE, related_name="services"  )
    category = models.ForeignKey( Category, on_delete=models.SET_NULL, null=True, related_name="services" )
    title = models.CharField(max_length=200)
    description = models.TextField()

    price_type = models.CharField(max_length=20, choices=PRICE_TYPES, default="negotiable" )
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True )
    duration = models.CharField(max_length=100, blank=True, null=True)
    
    average_rating = models.FloatField(default=0 ) 
    review_count = models.PositiveIntegerField(default=0 )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class ServiceImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="images" )
    image = models.ImageField(upload_to="services/")
    created_at = models.DateTimeField(auto_now_add=True)