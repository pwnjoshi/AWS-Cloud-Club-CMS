from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('MEMBER', 'Member'),
        ('LEAD', 'Lead'),
        ('FACULTY', 'Faculty'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()

class Highlight(models.Model):
    title = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='highlights/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title or f"Highlight {self.id}"

class Event(models.Model):
    EVENT_TYPES = [
        ('WORKSHOP', 'Workshop'),
        ('SESSION', 'Session'),
        ('HACKATHON', 'Hackathon'),
        ('MEETING', 'Internal Meeting'),
        ('IDEATION', 'Ideation'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=200, default="TBD")
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='SESSION')
    is_public = models.BooleanField(default=True)
    organizer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.start_time.date()})"


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class News(models.Model):
    content = models.CharField(max_length=255)
    link_text = models.CharField(max_length=50, blank=True, default="Register Now")
    link_url = models.CharField(max_length=200, blank=True, default="/events")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "News"
        ordering = ['-created_at']

    def __str__(self):
        return self.content
