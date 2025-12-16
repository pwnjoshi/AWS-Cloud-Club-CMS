from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Task, Resource, Highlight, News

class UserSerializer(serializers.ModelSerializer):
    task_stats = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'groups', 'task_stats', 'role']

    def get_task_stats(self, obj):
        total = obj.tasks.count()
        completed = obj.tasks.filter(status='DONE').count()
        return {'total': total, 'completed': completed}
    
    def get_role(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.role
        return 'MEMBER'

class EventSerializer(serializers.ModelSerializer):
    organizer_name = serializers.ReadOnlyField(source='organizer.username')

    class Meta:
        model = Event
        fields = '__all__'

class HighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highlight
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'uploaded_at']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.username')

    class Meta:
        model = Task
        fields = '__all__'
        extra_kwargs = {
            'assigned_to': {'required': False}
        }

class ResourceSerializer(serializers.ModelSerializer):
    added_by_name = serializers.ReadOnlyField(source='added_by.username')

    class Meta:
        model = Resource
        fields = '__all__'

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
