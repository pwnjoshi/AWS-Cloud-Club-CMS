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

        # Write permissions are only allowed to authenticated users who are Lead or Faculty.
        if not request.user.is_authenticated:
            return False
            
        try:
            return request.user.profile.role in ['LEAD', 'FACULTY']
        except:
            return False
