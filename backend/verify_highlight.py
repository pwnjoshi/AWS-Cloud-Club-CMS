import os
import django
import sys
# Setup Django
sys.path.append('c:/Users/joshi/Desktop/AWS Cloud Club GEU/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile

def test_highlight_upload():
    try:
        user = User.objects.get(username='lead')
    except User.DoesNotExist:
        print("Lead user not found")
        return

    client = APIClient()
    client.force_authenticate(user=user)

    # Create dummy image
    image_content = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    image = SimpleUploadedFile('test_image.jpg', image_content, content_type='image/jpeg')

    data = {
        'title': 'Script Uploaded Highlight',
        'image': image
    }

    response = client.post('/api/highlights/', data, format='multipart')
    
    if response.status_code == 201:
        print("SUCCESS: Highlight uploaded by Lead.")
    else:
        print(f"FAILURE: {response.status_code} - {response.data}")

if __name__ == '__main__':
    test_highlight_upload()
