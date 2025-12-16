import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from club.models import UserProfile

def cleanup():
    # 1. Identify users
    preserved_username = 'lead'  # Lead Pawan Joshi
    
    # Check if 'lead' exists
    try:
        lead = User.objects.get(username=preserved_username)
        print(f"Found preserved user: {lead.username} (ID: {lead.id})")
    except User.DoesNotExist:
        print("WARNING: User 'lead' not found! Creating it...")
        lead = User.objects.create_superuser('lead', 'lead@awsclub.com', 'awsclub123')
        lead.first_name = 'Pawan'
        lead.last_name = 'Joshi'
        lead.save()
        UserProfile.objects.get_or_create(user=lead, role='LEAD')
        print(f"Created preserved user: {lead.username}")

    # 2. Delete all other users
    deleted_count = 0
    for u in User.objects.all():
        if u.username != preserved_username and u.username != 'pawanlead': # Don't delete if I re-run
            print(f"Deleting user: {u.username}")
            u.delete()
            deleted_count += 1
    
    print(f"Deleted {deleted_count} users.")

    # 3. Create 'pawanlead' superuser
    try:
        pawan = User.objects.get(username='pawanlead')
        print("User 'pawanlead' already exists.")
    except User.DoesNotExist:
        print("Creating superuser 'pawanlead'...")
        # Password? Let's use a default secure one or generic, user said they will add roles themselves later.
        # I'll use 'awsclub123' as default for consistency with previous setup.
        pawan = User.objects.create_superuser('pawanlead', 'pawan@awsclub.com', 'awsclub123')
        pawan.first_name = 'Pawan'
        pawan.last_name = 'Lead'
        pawan.save()
        # Ensure profile exists and is LEAD
        UserProfile.objects.get_or_create(user=pawan, role='LEAD')
        print("Created 'pawanlead'.")

if __name__ == '__main__':
    cleanup()
