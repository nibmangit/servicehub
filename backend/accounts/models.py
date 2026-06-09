
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# 1. DEFINE THE NEW MANAGER THAT EXPECTS ONLY EMAIL
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        
        email = self.normalize_email(email)
         
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
         
        user = self.model(email=email, **extra_fields)
         
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

 
class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = None 

    is_customer = models.BooleanField(default=True)
    is_provider = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    objects = CustomUserManager() 

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
 