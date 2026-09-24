from django.core.exceptions import ValidationError
from django.core.cache import cache
from django.db.models import Count, Q, Avg, Sum

from accounts.models import User
from profiles.models import ProviderProfile, ProviderApplication
from services.models import Service
from requests.models import ServiceRequest
from reviews.models import Review


class AdminUserService:

    @staticmethod
    def update_user_flags(target_user, acting_user, is_active=None, is_staff=None):
        if target_user.pk == acting_user.pk:
            raise ValidationError("You cannot modify your own admin flags.")

        if target_user.is_superuser and not acting_user.is_superuser:
            raise ValidationError("Only a superuser can modify another superuser's account.")

        update_fields = []

        if is_active is not None:
            target_user.is_active = is_active
            update_fields.append("is_active")

        if is_staff is not None:
            if not acting_user.is_superuser:
                raise ValidationError("Only a superuser can grant or revoke staff access.")
            target_user.is_staff = is_staff
            update_fields.append("is_staff")

        if update_fields:
            target_user.save(update_fields=update_fields)

        return target_user


class AdminStatsService:

    @staticmethod
    def get_platform_stats():
        cache_key = "admin_platform_stats"
        cached = cache.get(cache_key)
        if cached:
            return cached

        user_stats = User.objects.aggregate(
            total=Count("id"),
            customers=Count("id", filter=Q(is_provider=False)),
            providers=Count("id", filter=Q(is_provider=True)),
            staff=Count("id", filter=Q(is_staff=True)),
            active=Count("id", filter=Q(is_active=True)),
        )

        application_stats = ProviderApplication.objects.aggregate(
            pending=Count("id", filter=Q(status="pending")),
            approved=Count("id", filter=Q(status="approved")),
            rejected=Count("id", filter=Q(status="rejected")),
        )

        service_stats = Service.objects.aggregate(
            total=Count("id"),
            active=Count("id", filter=Q(is_active=True)),
        )

        request_stats = ServiceRequest.objects.aggregate(
            total=Count("id"),
            pending=Count("id", filter=Q(status="PENDING")),
            active=Count("id", filter=Q(status__in=["ACCEPTED", "IN_PROGRESS"])),
            completed=Count("id", filter=Q(status="COMPLETED")),
            cancelled=Count("id", filter=Q(status__in=["CANCELLED", "REJECTED"])),
        )

        review_stats = Review.objects.aggregate(
            total=Count("id"),
            avg_rating=Avg("rating"),
        )

        jobs_completed = ProviderProfile.objects.aggregate(
            total=Sum("completed_jobs")
        )["total"] or 0

        data = {
            "users": user_stats,
            "provider_applications": application_stats,
            "services": service_stats,
            "requests": request_stats,
            "reviews": {
                "total": review_stats["total"],
                "avg_rating": round(review_stats["avg_rating"] or 0, 2),
            },
            "jobs_completed": jobs_completed,
        }

        cache.set(cache_key, data, timeout=60)
        return data