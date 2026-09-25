from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView,
    RetrieveDestroyAPIView, UpdateAPIView,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .permissions import IsAdminStaff
from .services import AdminUserService, AdminStatsService
from .serializers import (
    AdminUserSerializer, AdminUserFlagsSerializer,
    AdminProviderApplicationSerializer, AdminApplicationRejectSerializer,
)

from accounts.models import User
from profiles.models import ProviderApplication, Skill
from profiles.services import approve_provider_application, reject_provider_application
from profiles.serializers import SkillSerializer
from categories.models import Category
from categories.serializers import CategorySerializer
from services.models import Service
from services.serializers import ServiceSerializer
from requests.models import ServiceRequest
from requests.serializers import ServiceRequestSerializer
from reviews.models import Review
from reviews.serializers import ReviewSerializer
from identity.models import IdentityVerification 
from .serializers import AdminIdentityVerificationSerializer


# ---------------- USERS ----------------

class AdminUserListView(ListAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminStaff]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["is_provider", "is_staff", "is_active"]
    search_fields = ["email"]
    ordering_fields = ["date_joined", "email"]
    ordering = ["-date_joined"]
    queryset = User.objects.select_related("userprofile", "providerapplication").all()


class AdminUserDetailView(RetrieveAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminStaff]
    queryset = User.objects.select_related("userprofile", "providerapplication").all()


class AdminUserFlagsUpdateView(APIView):
    permission_classes = [IsAdminStaff]

    def patch(self, request, pk):
        serializer = AdminUserFlagsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        target_user = User.objects.get(pk=pk) if User.objects.filter(pk=pk).exists() else None
        if not target_user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            AdminUserService.update_user_flags(
                target_user=target_user,
                acting_user=request.user,
                is_active=serializer.validated_data.get("is_active"),
                is_staff=serializer.validated_data.get("is_staff"),
            )
        except DjangoValidationError as e:
            raise ValidationError(e.message if hasattr(e, "message") else str(e))

        return Response(AdminUserSerializer(target_user).data, status=status.HTTP_200_OK)


# ---------------- PROVIDER APPLICATIONS ----------------

class AdminProviderApplicationListView(ListAPIView):
    serializer_class = AdminProviderApplicationSerializer
    permission_classes = [IsAdminStaff]

    def get_queryset(self):
        qs = ProviderApplication.objects.select_related(
            "user", "user__userprofile", "reviewed_by"
        ).prefetch_related("skills").order_by("-submitted_at")

        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs


class AdminProviderApplicationDetailView(RetrieveAPIView):
    serializer_class = AdminProviderApplicationSerializer
    permission_classes = [IsAdminStaff]
    queryset = ProviderApplication.objects.select_related(
        "user", "user__userprofile", "reviewed_by"
    ).prefetch_related("skills")


class AdminProviderApplicationApproveView(APIView):
    permission_classes = [IsAdminStaff]

    def post(self, request, pk):
        try:
            approve_provider_application(application_id=pk, admin_user=request.user)
        except ProviderApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        except DjangoValidationError as e:
            raise ValidationError(e.message if hasattr(e, "message") else str(e))

        application = ProviderApplication.objects.select_related(
            "user", "user__userprofile", "reviewed_by"
        ).prefetch_related("skills").get(pk=pk)
        return Response(AdminProviderApplicationSerializer(application).data, status=status.HTTP_200_OK)


class AdminProviderApplicationRejectView(APIView):
    permission_classes = [IsAdminStaff]

    def post(self, request, pk):
        serializer = AdminApplicationRejectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            reject_provider_application(
                application_id=pk,
                admin_user=request.user,
                reason=serializer.validated_data["reason"],
            )
        except ProviderApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        except DjangoValidationError as e:
            raise ValidationError(e.message if hasattr(e, "message") else str(e))

        application = ProviderApplication.objects.select_related(
            "user", "user__userprofile", "reviewed_by"
        ).prefetch_related("skills").get(pk=pk)
        return Response(AdminProviderApplicationSerializer(application).data, status=status.HTTP_200_OK)


# ---------------- CATEGORIES (full CRUD) ----------------

class AdminCategoryListCreateView(ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminStaff]
    pagination_class = None
    queryset = Category.objects.all().order_by("name")


class AdminCategoryDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminStaff]
    queryset = Category.objects.all()


# ---------------- SKILLS (full CRUD) ----------------

class AdminSkillListCreateView(ListCreateAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAdminStaff]
    pagination_class = None
    queryset = Skill.objects.all().order_by("name")


class AdminSkillDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAdminStaff]
    queryset = Skill.objects.all()


# ---------------- SERVICES (moderation — bypasses ownership) ----------------

class AdminServiceListView(ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminStaff]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["is_active", "category", "provider"]
    search_fields = ["title", "description", "provider__user__email"]
    ordering_fields = ["created_at", "price", "average_rating"]
    ordering = ["-created_at"]
    queryset = Service.objects.select_related("provider", "category").prefetch_related("images")


class AdminServiceDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminStaff]
    queryset = Service.objects.select_related("provider", "category").prefetch_related("images")


# ---------------- REQUESTS (read-only — preserves ServiceRequestService transition rules) ----------------

class AdminRequestListView(ListAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAdminStaff]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status"]
    search_fields = ["customer__email", "provider__user__email", "service__title"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]
    queryset = ServiceRequest.objects.select_related("customer", "provider__user", "service")


class AdminRequestDetailView(RetrieveAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAdminStaff]
    queryset = ServiceRequest.objects.select_related("customer", "provider__user", "service")


# ---------------- REVIEWS (moderation) ----------------

class AdminReviewListView(ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminStaff]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["request__customer__email", "request__service__title", "comment"]
    orderinAdminIdentityVerificationListViewg_fields = ["created_at", "rating"]
    ordering = ["-created_at"]
    queryset = Review.objects.select_related(
        "request", "request__customer", "request__customer__userprofile",
        "request__service", "request__service__provider",
        "request__service__provider__user", "request__service__provider__user__userprofile",
    )


class AdminReviewDetailView(RetrieveDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminStaff]
    queryset = Review.objects.select_related(
        "request", "request__customer", "request__customer__userprofile",
        "request__service", "request__service__provider",
        "request__service__provider__user", "request__service__provider__user__userprofile",
    )
    # NOTE: deleting a review here correctly re-triggers reviews/signals.py's
    # post_delete handler, which recalculates Service.average_rating/review_count
    # and ProviderProfile.rating/total_reviews automatically — no extra code needed.


# ---------------- IDENTITY VERIFICATIONS (read-only, compliance visibility) ----------------


class AdminIdentityVerificationListView(ListAPIView):
    serializer_class = AdminIdentityVerificationSerializer  # was IdentityVerificationSerializer
    permission_classes = [IsAdminStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status"]
    queryset = IdentityVerification.objects.select_related("user", "citizen").order_by("-created_at")


# ---------------- STATS ----------------

class AdminStatsView(APIView):
    permission_classes = [IsAdminStaff]

    def get(self, request):
        return Response(AdminStatsService.get_platform_stats())