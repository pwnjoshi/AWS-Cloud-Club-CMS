import os
import django
import sys

# Setup Django environment
sys.path.append('c:/Users/joshi/Desktop/AWS Cloud Club GEU/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from club.models import UserProfile

try:
    user = User.objects.get(username='lead')
    # Use get_or_create to handle cases where signal might have fired or not
    profile, created = UserProfile.objects.get_or_create(user=user)
    profile.role = 'LEAD'
    profile.save()
    print(f"Successfully assigned LEAD role to user: {user.username}")
except User.DoesNotExist:
    print("User 'lead' not found.")
except Exception as e:
    print(f"Error: {e}")
