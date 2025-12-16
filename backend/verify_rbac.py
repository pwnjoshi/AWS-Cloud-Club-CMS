import os
import django
import sys
# Setup Django environment
sys.path.append('c:/Users/joshi/Desktop/AWS Cloud Club GEU/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User
from club.models import UserProfile

def test_rbac_creation():
    # Get Lead User
    try:
        user = User.objects.get(username='lead')
        print(f"Testing as user: {user.username} (Role: {user.profile.role})")
    except User.DoesNotExist:
        print("User 'lead' not found")
        return

    client = APIClient()
    client.force_authenticate(user=user)

    data = {
        'title': 'Backend RBAC Test',
        'description': 'Created via script',
        'start_time': '2025-12-25T10:00:00Z',
        'end_time': '2025-12-25T12:00:00Z',
        'event_type': 'SESSION',
        'location': 'Script Land'
    }

    response = client.post('/api/events/', data, format='json')
    
    if response.status_code == 201:
        print("SUCCESS: Event created by Lead.")
    else:
        print(f"FAILURE: {response.status_code} - {response.data}")

if __name__ == '__main__':
    test_rbac_creation()
