from django.db import models
from accounts.models import User
from cloudinary.models import CloudinaryField

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)

    bio = models.TextField(blank=True, null=True)
    avatar = CloudinaryField("image", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.user.email


class ProviderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    completed_jobs = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.user.email
    

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    
class ProviderApplication(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected' 
        
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    skills = models.ManyToManyField('Skill', blank=True, related_name='providers')
    experience_years = models.PositiveSmallIntegerField(blank=True, null=True)
    professional_summary = models.TextField(blank=True, null=True) 
    
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    rejection_reason = models.TextField(blank=True, null=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviewed_provider_applications" )
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.status}" 
