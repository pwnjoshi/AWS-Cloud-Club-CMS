import requests
import json

BASE_URL = "http://localhost:8000"

def test():
    # 1. Login
    print("Logging in...")
    try:
        resp = requests.post(f"{BASE_URL}/api-token-auth/", json={
            "username": "pawanlead",
            "password": "awsclub123"
        })
        print(f"Login Status: {resp.status_code}")
        if resp.status_code != 200:
            print(resp.text)
            return

        token = resp.json()['token']
        print(f"Token: {token[:10]}...")

        # 2. Setup Headers
        headers = {
            "Authorization": f"Token {token}",
            "Content-Type": "application/json"
        }

        # 3. Create Resource
        print("Creating Resource...")
        payload = {
            "title": "API Test Resource",
            "url": "https://apitest.com",
            "category": "LINK",
            "description": "Testing from script"
        }
        resp = requests.post(f"{BASE_URL}/api/resources/", json=payload, headers=headers)
        print(f"Create Status: {resp.status_code}")
        
        if resp.status_code == 500:
            print("Server Error Traceback Extraction:")
            text = resp.text
            if "Traceback" in text:
                # Simple extraction: find first "Traceback" and print context
                start = text.find("Traceback")
                end = text.find("</textarea>", start) # Django debug page often puts it in textarea or pre
                if end == -1: end = start + 2000
                snippet = text[start:end]
                # Clean up html tags if needed (rudimentary)
                import re
                clean = re.sub(r'<[^>]+>', '', snippet)
                print(clean)
            else:
                print("No Traceback found in HTML.")
                print(text[:1000])
        else:
             print("Response Body:")
             print(resp.text)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
