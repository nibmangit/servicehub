from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ("REQUEST_CREATED", "Request Created"),
        ("REQUEST_ACCEPTED", "Request Accepted"),
        ("REQUEST_REJECTED", "Request Rejected"),
        ("REQUEST_CANCELLED", "Request Cancelled"),
        ("REQUEST_STARTED", "Request Started"),
        ("REQUEST_COMPLETED", "Request Completed"),
        ("NEW_REVIEW", "New Review"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    request = models.ForeignKey(
        "requests.ServiceRequest",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications"
    )
    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.title}"