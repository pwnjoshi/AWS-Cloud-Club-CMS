import os
import django
import sys
import shutil
from django.core.files import File
from pathlib import Path

sys.path.append('c:/Users/joshi/Desktop/AWS Cloud Club GEU/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from club.models import Highlight
from django.contrib.auth.models import User

# Ensure media directory exists
MEDIA_ROOT = Path('c:/Users/joshi/Desktop/AWS Cloud Club GEU/backend/media/highlights')
MEDIA_ROOT.mkdir(parents=True, exist_ok=True)

# Create a dummy image if not exists
src_img = Path('c:/Users/joshi/Desktop/AWS Cloud Club GEU/backend/dummy_image.jpg')
if not src_img.exists():
    with open(src_img, 'wb') as f:
        f.write(b'\xFF\xD8\xFF\xE0\x00\x10\x4A\x46\x49\x46\x00\x01') # JPEG Header

def seed():
    user = User.objects.get(username='lead')
    
    # Check if highlight exists
    if Highlight.objects.filter(title="Manual Verification Highlight").exists():
        print("Highlight already exists.")
        return

    with open(src_img, 'rb') as f:
        highlight = Highlight(
            title="Manual Verification Highlight",
            uploaded_by=user
        )
        highlight.image.save('verify_test.jpg', File(f), save=True)
        highlight.save()
    
    print("SUCCESS: Seeded highlight.")

if __name__ == '__main__':
    seed()
