from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsServiceProviderOwner(BasePermission):
    """
    Object-level permission to only allow owners of a service listing to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read-only permissions (GET, HEAD, OPTIONS) are allowed for any request
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.is_provider
            and hasattr(request.user, "providerprofile")
            and obj.provider == request.user.providerprofile
        )
    
    
class IsImageOwner(BasePermission):
    """
    Object-level permission to allow only the service provider to delete an image.
    """
    def has_object_permission(self, request, view, obj):
        # obj is a ServiceImage instance. We check ownership via obj.service.provider
        return hasattr(request.user, 'providerprofile') and obj.service.provider == request.user.providerprofile
    

class IsProviderOrReadOnly(BasePermission):
    """
    Anyone can read.
    Only authenticated providers can create.
    """

    def has_permission(self, request, view): 
        if request.method in SAFE_METHODS:
            return True

        return (
            request.user.is_authenticated
            and request.user.is_provider
        )