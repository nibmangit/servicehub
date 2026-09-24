from django.urls import path
from .views import (
    AdminUserListView, AdminUserDetailView, AdminUserFlagsUpdateView,
    AdminProviderApplicationListView, AdminProviderApplicationDetailView,
    AdminProviderApplicationApproveView, AdminProviderApplicationRejectView,
    AdminCategoryListCreateView, AdminCategoryDetailView,
    AdminSkillListCreateView, AdminSkillDetailView,
    AdminServiceListView, AdminServiceDetailView,
    AdminRequestListView, AdminRequestDetailView,
    AdminReviewListView, AdminReviewDetailView,
    AdminIdentityVerificationListView,
    AdminStatsView,
)

app_name = "adminpanel"

urlpatterns = [
    path("stats/", AdminStatsView.as_view(), name="stats"),

    path("users/", AdminUserListView.as_view(), name="user_list"),
    path("users/<int:pk>/", AdminUserDetailView.as_view(), name="user_detail"),
    path("users/<int:pk>/flags/", AdminUserFlagsUpdateView.as_view(), name="user_flags"),

    path("provider-applications/", AdminProviderApplicationListView.as_view(), name="application_list"),
    path("provider-applications/<int:pk>/", AdminProviderApplicationDetailView.as_view(), name="application_detail"),
    path("provider-applications/<int:pk>/approve/", AdminProviderApplicationApproveView.as_view(), name="application_approve"),
    path("provider-applications/<int:pk>/reject/", AdminProviderApplicationRejectView.as_view(), name="application_reject"),

    path("categories/", AdminCategoryListCreateView.as_view(), name="category_list_create"),
    path("categories/<int:pk>/", AdminCategoryDetailView.as_view(), name="category_detail"),

    path("skills/", AdminSkillListCreateView.as_view(), name="skill_list_create"),
    path("skills/<int:pk>/", AdminSkillDetailView.as_view(), name="skill_detail"),

    path("services/", AdminServiceListView.as_view(), name="service_list"),
    path("services/<int:pk>/", AdminServiceDetailView.as_view(), name="service_detail"),

    path("requests/", AdminRequestListView.as_view(), name="request_list"),
    path("requests/<int:pk>/", AdminRequestDetailView.as_view(), name="request_detail"),

    path("reviews/", AdminReviewListView.as_view(), name="review_list"),
    path("reviews/<int:pk>/", AdminReviewDetailView.as_view(), name="review_detail"),

    path("identity-verifications/", AdminIdentityVerificationListView.as_view(), name="identity_list"),
]