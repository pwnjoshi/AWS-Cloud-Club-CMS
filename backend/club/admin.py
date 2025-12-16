from django.contrib import admin
from .models import Event, Highlight, News, UserProfile, BlogPost

# Register your models here.

admin.site.register(Event)
admin.site.register(BlogPost)
admin.site.register(Highlight)
admin.site.register(News)
admin.site.register(UserProfile)
