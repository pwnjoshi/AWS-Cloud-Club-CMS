import os
import django
from django.core.files.images import ImageFile
from django.core.files.base import ContentFile
from io import BytesIO
from PIL import Image

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from club.models import Highlight, User

def create_dummy_image(color='blue'):
    file = BytesIO()
    image = Image.new('RGB', (800, 600), color)
    image.save(file, 'JPEG')
    file.name = f'test_image_{color}.jpg'
    file.seek(0)
    return file

def seed():
    # Get user
    try:
        user = User.objects.get(username='lead')
    except User.DoesNotExist:
        print("User 'lead' not found. Run migrations/reset script first.")
        return

    # Create dummy image
    img_content = create_dummy_image('red') # Different color for distinction
    
    # Create Highlight
    highlight = Highlight.objects.create(
        title="Simulated Upload Highlight",
        uploaded_by=user
    )
    highlight.image.save('simulated_upload.jpg', ContentFile(img_content.read()), save=True)
    
    print(f"Created highlight: {highlight.title} (ID: {highlight.id})")

if __name__ == '__main__':
    seed()
