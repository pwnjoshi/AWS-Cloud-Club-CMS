from django.contrib import admin
from .models import Event, Task, Resource, Highlight, News, UserProfile

# Register your models here.

admin.site.register(Event)
admin.site.register(Task)
admin.site.register(Resource)
admin.site.register(Highlight)
admin.site.register(News)
admin.site.register(UserProfile)
