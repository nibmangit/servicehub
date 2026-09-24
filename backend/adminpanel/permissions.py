from rest_framework.permissions import BasePermission


class IsAdminStaff(BasePermission):
    """Only staff/admin accounts may access admin endpoints."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)