from rest_framework import permissions

class IsLeadOrFaculty(permissions.BasePermission):
    """
    Custom permission to only allow Leads and Faculty to create/edit events.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and 
            request.user.profile.role in ['LEAD', 'FACULTY']
        )


class IsSelfOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow admins (Lead/Faculty) to manage anyone
        if request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.role in ['LEAD', 'FACULTY']:
            return True
        # Allow users to manage themselves
        return obj == request.user
