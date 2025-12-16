import requests
from bs4 import BeautifulSoup

def fetch_meetup_details(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        data = {
            'title': '',
            'description': '',
            'image': '',
            'start_time': ''
        }

        # Extract OG tags
        og_title = soup.find('meta', property='og:title')
        if og_title:
            data['title'] = og_title.get('content', '')

        og_description = soup.find('meta', property='og:description')
        if og_description:
            data['description'] = og_description.get('content', '')

        og_image = soup.find('meta', property='og:image')
        if og_image:
            data['image'] = og_image.get('content', '')
            
        # Try to find date (generic approach, might need specific meetup selectors if OG fails)
        # Meetup usually puts date in specific schema.org scripts or meta tags, but let's stick to OG for MVP
        # If needed, we can parse specific ld+json blocks later.
        
        return data

    except Exception as e:
        print(f"Error fetching meetup details: {e}")
        return None
