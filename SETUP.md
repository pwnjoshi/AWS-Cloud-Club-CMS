# 🛠️ Setup Guide — AWS Student Builder Group GEU Platform

Complete configuration guide for all services and features.

---

## 1. Prerequisites

- **Node.js** 18+ (recommended: 22)
- **npm** 9+
- **Git**

---

## 2. Clone & Install

```bash
git clone https://github.com/pwnjoshi/AWS-Cloud-Club-CMS.git
cd AWS-Cloud-Club-CMS

# Backend
cd backend && npm install

# Portal
cd ../portal && npm install

# Public site
cd ../frontend && npm install
```

---

## 3. Backend Configuration

Copy the example env file and fill in your values:

```bash
cd backend
cp .env.example .env
```

### Required Settings

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite path (dev) or PostgreSQL URL (prod) | `file:./dev.db` |
| `JWT_SECRET` | Random secret for JWT signing (min 32 chars) | `your-super-secret-random-string-here` |
| `PORT` | Backend server port | `4000` |
| `CORS_ORIGIN` | Portal URL (for CORS) | `http://localhost:5174` |

### Optional: Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or use existing)
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Authorized JavaScript origins: `http://localhost:5174` (and your production URL)
6. Copy the **Client ID**

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |

### Optional: Email (Resend)

1. Sign up at [resend.com](https://resend.com) (free: 100 emails/day)
2. Add and verify your domain (or use their test domain)
3. Create an API key

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend API key | `re_xxxxx` |
| `EMAIL_FROM` | Sender address | `AWS SBG GEU <noreply@awsclubgeu.in>` |

### Optional: Push Notifications (VAPID)

Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

| Variable | Description |
|----------|-------------|
| `VAPID_PUBLIC_KEY` | Public VAPID key |
| `VAPID_PRIVATE_KEY` | Private VAPID key |
| `VAPID_SUBJECT` | Contact email | `mailto:awscloudclubgeu@gmail.com` |

### Optional: AWS Lab Access (STS)

1. Create an IAM Role in your AWS account (e.g., `SBG-StudentLabRole`)
2. Attach a Permission Boundary that blocks expensive services
3. Create a backend IAM User with only `sts:AssumeRole` permission
4. Set the role's trust policy to allow the backend user to assume it

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_REGION` | AWS region | `ap-south-1` |
| `AWS_ACCESS_KEY_ID` | Backend IAM user access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Backend IAM user secret key | `wJal...` |
| `AWS_LAB_ROLE_ARN` | Role ARN for student sessions | `arn:aws:iam::123456789012:role/SBG-StudentLabRole` |

### Optional: Portal URL

| Variable | Description | Example |
|----------|-------------|---------|
| `PORTAL_URL` | Portal base URL (for certificate verify links) | `https://portal.awsclubgeu.in` |

---

## 4. Database Setup

```bash
cd backend

# Create database and tables
npx prisma db push

# Seed with admin user, sample data, and badges
node prisma/seed.js
```

### Default Logins
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@awssbggeu.in` | `admin123456` |
| Member | `member@example.com` | `member123456` |

> ⚠️ **Change the admin password immediately after first login.**

### Production Database (PostgreSQL — REQUIRED for Render/Railway)

> ⚠️ **SQLite data is lost on Render cold starts.** You MUST use PostgreSQL for production.

**Free PostgreSQL options:**
- [Supabase](https://supabase.com) — 500MB free, automatic backups
- [Neon](https://neon.tech) — 512MB free, branching
- [Railway](https://railway.app) — $5/month with generous free trial
- [Render](https://render.com) — Free PostgreSQL (90-day limit)

**Setup:**
1. Create a PostgreSQL database on any provider above
2. Get the connection string (looks like `postgresql://user:pass@host:5432/dbname`)
3. Update `prisma/schema.prisma` — change `provider = "sqlite"` to `provider = "postgresql"`
4. Set it as `DATABASE_URL` in your `.env`:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
   ```
5. Run migrations:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

**Data safety:**
- PostgreSQL data persists across server restarts and deploys
- Most providers include automatic daily backups
- The backend also creates local SQLite backups every 6 hours (dev mode only)

---

## 5. Running Locally

```bash
# Terminal 1: Backend
cd backend && npm run dev     # → http://localhost:4000

# Terminal 2: Portal
cd portal && npm run dev      # → http://localhost:5174

# Terminal 3: Public site
cd frontend && npm run dev    # → http://localhost:5173
```

---

## 6. Production Deployment

### Public Site (Vercel/Netlify)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Portal (Vercel/Netlify)
- Root Directory: `portal`
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend (Railway/Render/EC2)
- Root Directory: `backend`
- Start Command: `npm start`
- Set all env vars from `.env.example`

---

## 7. Feature Configuration Checklist

| Feature | Required Config | Status |
|---------|----------------|--------|
| Basic auth (email/password) | `JWT_SECRET` | ✅ Works out of box |
| Google Sign-In | `GOOGLE_CLIENT_ID` | Optional |
| Email (welcome, bulk) | `RESEND_API_KEY` | Optional |
| Push notifications | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | Optional |
| AWS Lab Access | `AWS_*` variables | Optional |
| Certificate verification | `PORTAL_URL` | Optional (defaults to localhost) |
| Rotating OTP check-in | None | ✅ Works out of box |
| QR code check-in | None | ✅ Works out of box |
| Geolocation check-in | None (configured per event in admin) | ✅ Works out of box |
| Points & badges | None | ✅ Works out of box |
| Blog submissions | None | ✅ Works out of box |
| Maintenance mode | None (toggle in admin sidebar) | ✅ Works out of box |

---

## 8. Admin Quick Start

After setup:
1. Login at `http://localhost:5174` with admin credentials
2. Expand the **Admin** section in the sidebar
3. Create your first event
4. Start a check-in session (with optional geo)
5. Create badges, add resources, configure rewards
6. Toggle maintenance mode from the sidebar when needed

---

## 9. Security Configuration

### Email Domain Whitelist

Only these email domains are allowed for registration and Google OAuth:

| Provider | Domains |
|----------|---------|
| Google | `gmail.com` |
| Microsoft | `outlook.com`, `hotmail.com`, `live.com`, `msn.com`, `outlook.in` |
| GEU | `geu.ac.in` |
| Yahoo | `yahoo.com`, `yahoo.in`, `yahoo.co.in` |
| Apple | `icloud.com`, `me.com` |
| ProtonMail | `protonmail.com`, `proton.me` |
| Indian | `rediffmail.com` |

To add more domains, edit `backend/src/utils/validation.js` → `ALLOWED_DOMAINS` array.

Temp/disposable email services (tempmail, guerrillamail, etc.) are automatically blocked.

### Input Sanitization

All text inputs (names, descriptions, messages) are stripped of HTML tags before storage. This prevents XSS attacks.

### Password Policy

- Minimum 8 characters, maximum 128
- Hashed with bcrypt (12 rounds)
- Admin-created users must reset password on first login
- Google OAuth users have no password (can't be brute-forced)

### Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Login/Register/Google auth (POST) | 30 per 15 minutes per IP |
| All other endpoints | 1000 per 15 minutes per IP |

### Data Safety Checklist

- [ ] Use PostgreSQL for production (SQLite data lost on cold starts)
- [ ] Set a strong `JWT_SECRET` (32+ random characters)
- [ ] Change default admin password immediately
- [ ] Set `CORS_ORIGIN` to your actual portal domain
- [ ] Enable HTTPS on all services
- [ ] Set up database backups (most PostgreSQL providers include this)
- [ ] Review audit log regularly

---

## 10. Allowed Email Domains (Customization)

To modify which email domains can register:

```javascript
// backend/src/utils/validation.js
const ALLOWED_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'geu.ac.in',
  // Add your custom domains here
  'yourdomain.com',
];
```

Restart the backend after changes.
