from django.db.models import Count, Q, Avg
from django.core.cache import cache

from requests.models import ServiceRequest
from reviews.models import Review
from chats.models import Message, Conversation
from notifications.models import Notification
from services.models import Service


class DashboardService:

    @staticmethod
    def get_provider_dashboard(provider_user):

        cache_key = f"provider_dashboard_{provider_user.id}"
        cached = cache.get(cache_key)
        if cached:
            return cached

        provider_profile = provider_user.providerprofile

        requests = ServiceRequest.objects.filter(provider=provider_profile)
        services = Service.objects.filter(provider=provider_profile)
        reviews = Review.objects.filter(
            request__service__provider=provider_profile
        )

        request_stats = requests.aggregate(
            total=Count("id"),
            pending=Count("id", filter=Q(status="PENDING")),
            active=Count("id", filter=Q(status__in=["ACCEPTED", "IN_PROGRESS"])),
            completed=Count("id", filter=Q(status="COMPLETED")),
            cancelled=Count("id", filter=Q(status="CANCELLED")),
        )

        review_stats = reviews.aggregate(
            total_reviews=Count("id"),
            avg_rating=Avg("rating")
        )

        data = {
            "summary": {
                "total_services": services.count(),
                "total_requests": request_stats["total"],
                "pending_requests": request_stats["pending"],
                "active_requests": request_stats["active"],
                "completed_requests": request_stats["completed"],
                "cancelled_requests": request_stats["cancelled"],
            },

            "performance": {
                "rating": provider_profile.rating,
                "total_reviews": review_stats["total_reviews"],
                "avg_rating": review_stats["avg_rating"] or 0,
            },

            "recent_requests": list(
                requests.select_related("service", "customer")
                .order_by("-updated_at")[:5]
                .values(
                    "id",
                    "service__title",
                    "customer__email",
                    "status",
                    "updated_at",
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
        }

        cache.set(cache_key, data, timeout=60)  # 1 minute cache

        return data
 
    # CUSTOMER DASHBOARD 
    @staticmethod
    def get_customer_dashboard(user):

        cache_key = f"customer_dashboard_{user.id}"
        cached = cache.get(cache_key)
        if cached:
            return cached

        requests = ServiceRequest.objects.filter(customer=user)
        conversations = Conversation.objects.filter(request__customer=user)

        request_stats = requests.aggregate(
            total=Count("id"),
            active=Count("id", filter=Q(status__in=["PENDING", "ACCEPTED", "IN_PROGRESS"])),
            completed=Count("id", filter=Q(status="COMPLETED")),
            cancelled=Count("id", filter=Q(status="CANCELLED")),
        )

        unread_messages = Message.objects.filter(
            conversation__request__customer=user,
            is_read=False
        ).exclude(sender=user).count()

        data = {
            "summary": {
                "total_requests": request_stats["total"],
                "active_requests": request_stats["active"],
                "completed_requests": request_stats["completed"],
                "cancelled_requests": request_stats["cancelled"],
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
                conversations.select_related("request", "request__service")
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

            "unread_messages": unread_messages,
        }

        cache.set(cache_key, data, timeout=60)

        return data