from django.db.models import Count, Q, Avg
from requests.models import ServiceRequest
from reviews.models import Review
from chats.models import Message, Conversation
from notifications.models import Notification
from services.models import Service


class DashboardService: 
    
    # PROVIDER DASHBOARD 
    @staticmethod
    def get_provider_dashboard(provider_user):

        provider_profile = provider_user.providerprofile

        services = Service.objects.filter(provider=provider_profile)

        requests = ServiceRequest.objects.filter(provider=provider_profile)

        reviews = Review.objects.filter(request__service__provider=provider_profile)

        return {
            "summary": {
                "total_services": services.count(),
                "total_requests": requests.count(),
                "pending_requests": requests.filter(status="PENDING").count(),
                "active_requests": requests.filter(status__in=["ACCEPTED", "IN_PROGRESS"]).count(),
                "completed_requests": requests.filter(status="COMPLETED").count(),
                "cancelled_requests": requests.filter(status="CANCELLED").count(),
            },

            "performance": {
                "rating": provider_profile.rating,
                "total_reviews": reviews.count(),
            },

            "recent_requests": list(
                requests.select_related("service", "customer")
                .order_by("-created_at")[:5]
                .values(
                    "id",
                    "service__title",
                    "customer__email",
                    "status",
                    "created_at",
                )
            ),

            "recent_reviews": list(
                reviews.select_related("request", "request__customer")
                .order_by("-created_at")[:5]
                .values(
                    "rating",
                    "comment",
                    "request__customer__email",
                    "created_at",
                )
            ),

            "unread_notifications": Notification.objects.filter(
                user=provider_user,
                is_read=False
            ).count(),
        }
 
    # CUSTOMER DASHBOARD 
    @staticmethod
    def get_customer_dashboard(user):

        requests = ServiceRequest.objects.filter(customer=user)

        conversations = Conversation.objects.filter(request__customer=user)

        messages = Message.objects.filter(conversation__request__customer=user)

        return {
            "summary": {
                "total_requests": requests.count(),
                "active_requests": requests.filter(status__in=["PENDING", "ACCEPTED", "IN_PROGRESS"]).count(),
                "completed_requests": requests.filter(status="COMPLETED").count(),
                "cancelled_requests": requests.filter(status="CANCELLED").count(),
            },

            "recent_requests": list(
                requests.select_related("service", "provider")
                .order_by("-updated_at")[:5]
                .values(
                    "id",
                    "service__title",
                    "provider__user__email",
                    "status",
                    "updated_at",
                )
            ),

            "recent_conversations": list(
                conversations.prefetch_related("messages")
                .order_by("-updated_at")[:5]
                .values(
                    "id",
                    "request__service__title",
                    "updated_at",
                )
            ),

            "unread_notifications": Notification.objects.filter(
                user=user,
                is_read=False
            ).count(),

            "unread_messages": messages.filter(
                is_read=False
            ).exclude(sender=user).count(),
        }