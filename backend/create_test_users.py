#!/usr/bin/env python
"""
Create test users with different roles
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from club.models import UserProfile

# Create Core Team Member (if doesn't exist)
if not User.objects.filter(username='core').exists():
    core_user = User.objects.create_user(
        username='core',
        password='awsclub123',
        first_name='Core',
        last_name='Member'
    )
    core_user.profile.role = 'MEMBER'
    core_user.profile.save()
    print(f"✓ Created Core Team Member: {core_user.username} (role: {core_user.profile.role})")
else:
    core_user = User.objects.get(username='core')
    core_user.profile.role = 'MEMBER'
    core_user.profile.save()
    print(f"✓ Updated Core Team Member: {core_user.username} (role: {core_user.profile.role})")

# Create Faculty (if doesn't exist)
if not User.objects.filter(username='faculty').exists():
    faculty_user = User.objects.create_user(
        username='faculty',
        password='awsclub123',
        first_name='Faculty',
        last_name='Coordinator'
    )
    faculty_user.profile.role = 'FACULTY'
    faculty_user.profile.save()
    print(f"✓ Created Faculty: {faculty_user.username} (role: {faculty_user.profile.role})")
else:
    faculty_user = User.objects.get(username='faculty')
    faculty_user.profile.role = 'FACULTY'
    faculty_user.profile.save()
    print(f"✓ Updated Faculty: {faculty_user.username} (role: {faculty_user.profile.role})")

# Verify Lead user
lead_user = User.objects.get(username='lead')
lead_user.profile.role = 'LEAD'
lead_user.profile.save()
print(f"✓ Verified Lead: {lead_user.username} (role: {lead_user.profile.role})")

print("\n=== Test Credentials ===")
print("Lead:    username=lead    password=awsclub123")
print("Faculty: username=faculty password=awsclub123")
print("Member:  username=core    password=awsclub123")
