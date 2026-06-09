from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from requests.models import ServiceRequest

class Review(models.Model): 
    request = models.OneToOneField(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name="review"
    )
     
    rating = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ],
        help_text="Rating score from 1 to 5 stars"
    )
    
    comment = models.TextField(blank=True, null=True)
     
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review for Request #{self.request.id} - Rating: {self.rating}"