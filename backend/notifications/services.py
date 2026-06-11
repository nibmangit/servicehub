from .models import Notification

class NotificationService:
    @staticmethod
    def notify(user, notification_type, title, message, request=None):
        return Notification.objects.create(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
            request=request
        )