# AWS Cloud Club GEU

Full-stack application for AWS Cloud Club GEU. Django REST Framework backend + React (Vite) frontend with modern AWS-styled UI, token auth, role-based dashboard, events, highlights, and resources.

## Project Structure

- **Backend:** Django REST Framework API (located in `backend/`)
- **Frontend:** React + Vite SPA (located in `frontend/`)

## How to Run

### 1. Backend (Django)

Open a terminal in the `backend` folder:

```bash
# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Run server
python manage.py runserver
```

The API will be available at [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/).

### 2. Frontend (React)

Open a new terminal in the `frontend` folder:

```bash
# Install dependencies (if not already installed)
npm install

# Run development server
npm run dev
```

The website will be available at [http://localhost:5173](http://localhost:5173). Vite may switch to another port automatically; backend CORS allows 5173 and 5174.

## Features

### Public Landing Page
- Modern, responsive design with "Glassmorphism" aesthetics.
- Hero section, Breaking News ticker, Mission cards, and Gallery.
- **PublicLayout** ensures consistent navigation across public pages.

### Secure Dashboard
- **Role-Based Access Control (RBAC):**
  - **Leads/Faculty:** Can create events, upload gallery highlights, manage tasks, and manage breaking news.
  - **Members/Public:** Read-only access to events and gallery.
- **Task Management:** Rapid task entry and status tracking.
- **Interactive Calendar:** Monthly view of club events.
- **Resources Hub:** Shared documents and links.
- **Breaking News Manager:** Leads/Faculty can manage dynamic announcements on the home page.
- **Faculty View:** Oversight dashboard for Leads/Faculty.

### Event Management
- **Meetup.com Import:** Auto-fetch event details from a URL.
- **RBAC:** Only 'LEAD' and 'FACULTY' roles can create new events.

### Dynamic Highlights (Gallery)
- Images are served dynamically from the backend.
- Uploads are restricted to authorized roles.

## Tech Stack

- **Backend:** Python, Django, Django REST Framework, SQLite
- **Frontend:** JavaScript, React, Vite, CSS (Glassmorphism)
- **Authentication:** Token Authentication

## Environment & Config
- CORS allowed origins: `http://localhost:5173`, `http://localhost:5174` (see `backend/config/settings.py`).
- Media served from `backend/media/` with `ImageField` uploads for `Highlight`.
- API base used by frontend: `frontend/src/api.js` (`API_URL = 'http://127.0.0.1:8000'`).

## Authentication
Token-based login via `/api-token-auth/`.

Example (PowerShell):
```powershell
$body = @{ username = "lead"; password = "awsclub123" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api-token-auth/" -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -UseBasicParsing | Select-Object -ExpandProperty Content
```

## RBAC Summary
- Leads & Faculty: create events, manage highlights (gallery), manage breaking news, access resources and calendar.
- Members/Public: read-only access to public endpoints and pages.
- Enforcement via `IsLeadOrFaculty` (backend `club/permissions.py`).

## Key API Endpoints
- `GET/POST /api/events/` — public read, lead/faculty write
- `GET/POST /api/highlights/` — public read, lead/faculty write
- `DELETE /api/highlights/{id}/` — lead/faculty only
- `GET/POST /api/news/` — public read, lead/faculty write
- `GET /api/users/` — list users (restricted)
- `GET /api/users/me/` — current user profile (role included)
- `POST /api/import-meetup-event/` — import event details by URL (auth required)

## Deployment Notes
- Backend
  - Use production WSGI/ASGI server (e.g., gunicorn/uvicorn) and reverse proxy (nginx).
  - Configure environment variables for `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`.
  - Set up persistent storage for `media/` uploads.
  - Ensure `rest_framework.authtoken` installed and migrations applied.
- Frontend
  - Build with `npm run build`; serve `dist/` via static hosting or proxy through backend.
  - Update `API_URL` in `frontend/src/api.js` to your backend domain.

## Troubleshooting
- Login says "Invalid credentials": verify token endpoint returns a token; reset password via `manage.py shell`.
- 401 on API calls: ensure token stored in localStorage; confirm `Authorization: Token <token>` header.
- File upload fails: confirm `authenticatedFetch` does not set `Content-Type` for `FormData` (fixed). Check `MEDIA_URL`/`MEDIA_ROOT`.
- Frontend can’t reach backend: confirm CORS origin matches actual frontend port.

## Contributing
PRs welcome. Open issues for bugs or feature requests.

## License
This project is intended for club operations and learning purposes.