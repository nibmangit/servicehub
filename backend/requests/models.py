from django.db import models
from django.contrib.auth import get_user_model
from services.models import Service
from profiles.models import ProviderProfile

# Best practice in Django: always fetch the custom user model dynamically
User = get_user_model()

class ServiceRequest(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("REJECTED", "Rejected"),
        ("CANCELLED", "Cancelled"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
    )
 
    customer = models.ForeignKey( User, on_delete=models.CASCADE, related_name="customer_requests" )
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="provider_requests" )
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, related_name="requests")
 
    description = models.TextField()
    preferred_date = models.DateTimeField()
     
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING" )
 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request #{self.id} - {self.customer.email} -> {self.status}"