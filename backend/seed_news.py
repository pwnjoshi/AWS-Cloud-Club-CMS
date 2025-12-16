#!/usr/bin/env python
"""
Seed default news announcement for the Breaking News ticker
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from club.models import News

# Check if news exists, if not create default
if News.objects.count() == 0:
    default_news = News.objects.create(
        content="Registrations for the Serverless Workshop are closing soon! Secure your spot today.",
        link_text="Register Now",
        link_url="/events",
        is_active=True
    )
    print(f"✓ Created default news: {default_news.content}")
else:
    print("✓ News already exists. Skipping...")
    for news in News.objects.all():
        print(f"  - {news.content}")
