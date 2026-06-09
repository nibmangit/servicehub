from rest_framework import permissions

class IsServiceProviderOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of a service listing to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read-only permissions (GET, HEAD, OPTIONS) are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the logged-in user's provider profile matches the service's provider field
        return hasattr(request.user, 'providerprofile') and obj.provider == request.user.providerprofile