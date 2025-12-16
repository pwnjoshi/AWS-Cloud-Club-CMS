from django.contrib.auth.models import User
from club.models import UserProfile

try:
    username = 'testadmin'
    password = 'password123'
    email = 'admin@example.com'
    
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"Updated existing user '{username}' with password '{password}'")
    else:
        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"Created new superuser '{username}'")

    # Ensure profile exists and is LEAD
    profile, created = UserProfile.objects.get_or_create(user=user)
    profile.role = 'LEAD'
    profile.save()
    print("Profile role set to LEAD")

except Exception as e:
    print(f"Error: {e}")
