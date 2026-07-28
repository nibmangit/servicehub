from django.db import models
from cloudinary.models import CloudinaryField

from accounts.models import User

class FakeFaydaCitizen(models.Model):
        fin = models.CharField(max_length=20, unique=True)

        first_name = models.CharField(max_length=100)
        middle_name = models.CharField(max_length=100)
        last_name = models.CharField(max_length=100)

        date_of_birth = models.DateField()

        gender = models.CharField(max_length=20)

        phone = models.CharField(max_length=20)

        email = models.EmailField(blank=True, null=True)

        region = models.CharField(max_length=100)

        city = models.CharField(max_length=100)

        woreda = models.CharField(max_length=100)

        house_number = models.CharField(max_length=50, blank=True, null=True)

        profile_photo = CloudinaryField("image")

        is_active = models.BooleanField(default=True)

        def __str__(self):
            return f"{self.fin} - {self.first_name} {self.last_name}"   

class IdentityVerification(models.Model):

    class Provider(models.TextChoices):
        FAYDA = "fayda", "Fayda"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        VERIFIED = "verified", "Verified"
        FAILED = "failed", "Failed"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    provider = models.CharField(max_length=20, choices=Provider.choices, default=Provider.FAYDA )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING )
    fin = models.CharField(max_length=20)
    citizen = models.ForeignKey(FakeFaydaCitizen, on_delete=models.SET_NULL, null=True,  blank=True )
    reference = models.CharField(max_length=255, blank=True, null=True )
    
    verified_at = models.DateTimeField(blank=True, null=True )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.status}"