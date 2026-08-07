from django.utils.text import slugify
from django.db import models 
from profiles.models import ProviderProfile
from categories.models import Category
from cloudinary.models import CloudinaryField


class Service(models.Model):
    PRICE_TYPES = (
        ("fixed", "Fixed"),
        ("hourly", "Hourly"),
        ("negotiable", "Negotiable"),
    )
    provider = models.ForeignKey(ProviderProfile,  on_delete=models.PROTECT, related_name="services"  )
    category = models.ForeignKey( Category, on_delete=models.SET_NULL, null=True, related_name="services" )
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=150, null=False)

    price_type = models.CharField(max_length=20, choices=PRICE_TYPES, default="negotiable" )
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True )
    duration = models.CharField(max_length=100, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)
    average_rating = models.FloatField(default=0 ) 
    review_count = models.PositiveIntegerField(default=0 )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        indexes = [
            models.Index(fields=["category"]),
            models.Index(fields=["provider"]),
            models.Index(fields=["price"]),
            models.Index(fields=["created_at"]),
        ]
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            while Service.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title

class ServiceImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="images" )
    image = CloudinaryField("image")
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image {self.id} - {self.service.title}"