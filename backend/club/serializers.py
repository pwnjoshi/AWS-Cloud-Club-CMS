from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Highlight, News, BlogPost

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'groups', 'role']

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

class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    author_role = serializers.ReadOnlyField(source='author.profile.role')

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'author', 'author_name', 'author_role', 'image', 'created_at', 'updated_at', 'is_published']
        read_only_fields = ['author', 'created_at', 'updated_at']

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

class UserCreateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=[('MEMBER', 'Member'), ('LEAD', 'Lead'), ('FACULTY', 'Faculty')])
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role']

    def create(self, validated_data):
        role = validated_data.pop('role', 'MEMBER')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Profile is created via signals, update the role
        if hasattr(user, 'profile'):
            user.profile.role = role
            user.profile.save()
        else:
            # Fallback if signal didn't fire (unlikely but safe)
            from .models import UserProfile
            UserProfile.objects.create(user=user, role=role)
            
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        read_only_fields = ['username'] # Prevent username changes if desired, or allow it

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        
        if password:
            instance.set_password(password)
            instance.save()
            
        return instance
