from rest_framework import viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .permissions import IsLeadOrFaculty
from .models import Event, Task, Resource, Highlight, News
from .serializers import EventSerializer, TaskSerializer, ResourceSerializer, UserSerializer, HighlightSerializer, NewsSerializer
from django.contrib.auth.models import User

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsLeadOrFaculty]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If user is staff/lead (superuser for now), return all.
        if user.is_staff:
            return Task.objects.all()
        # Otherwise return tasks assigned to them or created by them (optional)
        return Task.objects.filter(assigned_to=user)

    def perform_create(self, serializer):
        serializer.save(assigned_to=self.request.user)

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

class HighlightViewSet(viewsets.ModelViewSet):
    queryset = Highlight.objects.all().order_by('-uploaded_at')
    serializer_class = HighlightSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsLeadOrFaculty]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

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
