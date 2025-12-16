from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .permissions import IsLeadOrFaculty, IsSelfOrAdmin
from .models import Event, Highlight, News, BlogPost
from .serializers import EventSerializer, UserSerializer, HighlightSerializer, NewsSerializer, UserCreateSerializer, UserUpdateSerializer, BlogPostSerializer
from django.contrib.auth.models import User

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsLeadOrFaculty]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)



class HighlightViewSet(viewsets.ModelViewSet):
    queryset = Highlight.objects.all().order_by('-uploaded_at')
    serializer_class = HighlightSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsLeadOrFaculty]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            # Only Admin can create users directly (via User Manager)
            # Or allow public signup? For now, implementing Invite-only/Admin-create based on previous context.
            # Assuming Admin-create.
            return [permissions.IsAuthenticated(), IsLeadOrFaculty()]
        if self.action in ['update', 'partial_update', 'destroy']:
            # Self or Admin can update/delete
            return [permissions.IsAuthenticated(), IsSelfOrAdmin()]
        # Read-only or List
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

    def get_queryset(self):
        user = self.request.user
        # Check if user has permission to see drafts (Lead/Faculty)
        is_lead = user.is_authenticated and hasattr(user, 'profile') and user.profile.role in ['LEAD', 'FACULTY']
        
        if is_lead or user.is_staff:
            return BlogPost.objects.all().order_by('-created_at')
        
        return BlogPost.objects.filter(is_published=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsLeadOrFaculty]

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .utils import fetch_meetup_details

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def import_meetup_event(request):
    url = request.data.get('url')
    if not url:
        return Response({'error': 'URL is required'}, status=400)
    
    data = fetch_meetup_details(url)
    if not data:
        return Response({'error': 'Failed to fetch details'}, status=400)
    
    return Response(data)
