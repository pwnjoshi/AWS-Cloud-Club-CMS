from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, TaskViewSet, ResourceViewSet, UserViewSet, import_meetup_event, HighlightViewSet, NewsViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'resources', ResourceViewSet)
router.register(r'highlights', HighlightViewSet)
router.register(r'users', UserViewSet)
router.register(r'news', NewsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('import-meetup-event/', import_meetup_event),
]
