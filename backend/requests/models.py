from django.db import models
from django.contrib.auth import get_user_model
from services.models import Service
from profiles.models import ProviderProfile
import random
 
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
    agreed_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    address = models.TextField(blank=True, null=True)
    
    start_otp = models.CharField(max_length=4, blank=True, null=True)
    complete_otp = models.CharField(max_length=4, blank=True, null=True)
 
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Automatically generate secure 4-digit strings when the request is first created
        if not self.pk: 
            self.start_otp = f"{random.randint(1000, 9999)}"
            self.complete_otp = f"{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Request #{self.id} - {self.customer.email} -> {self.status}"