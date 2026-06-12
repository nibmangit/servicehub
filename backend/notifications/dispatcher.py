from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class NotificationDispatcher:

    @staticmethod
    def push(notification):
        channel_layer = get_channel_layer()

        group_name = f"notifications_{notification.user.id}"

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "notification_event",
                "data": {
                    "id": notification.id,
                    "notification_type": notification.notification_type,
                    "title": notification.title,
                    "message": notification.message,
                    "request_id": notification.request_id,
                    "created_at": str(notification.created_at),
                    "is_read": notification.is_read,
                }
            }
        )