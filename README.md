# 🚀 AWS Student Builder Group - Graphic Era University

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_22-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![AWS](https://img.shields.io/badge/Community-AWS_Student_Builder_Group-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

> **The official platform for the AWS Student Builder Group at Graphic Era Deemed to be University.**
> Learn cloud, AI, and full-stack development while building real-world projects and shipping impactful solutions.

---

## 🏗️ Architecture

The platform has three parts:

| App | Port | Description |
|-----|------|-------------|
| **`frontend/`** | 5173 | Public website — landing page, events, team, blog, gallery |
| **`backend/`** | 4000 | REST API — Express + Prisma + SQLite |
| **`portal/`** | 5174 | Member portal — dashboard, attendance, points, AWS Lab, admin panel |

```
Public Site (frontend:5173)
    ├── "Member Portal" button in navbar
    └── Links to → Portal (portal:5174)
                      └── Calls → API (backend:4000)
```

---

## 🛠️ Quick Start

### 1. Clone
```bash
git clone https://github.com/pwnjoshi/AWS-Cloud-Club-CMS.git
cd AWS-Cloud-Club-CMS
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env        # edit JWT_SECRET for production
npx prisma db push           # create database
node prisma/seed.js          # seed admin + sample data
npm run dev                  # → http://localhost:4000
```

### 3. Portal (Member App)
```bash
cd portal
npm install
npm run dev                  # → http://localhost:5174
```

### 4. Public Site
```bash
cd frontend
npm install
npm run dev                  # → http://localhost:5173
```

### Default Logins
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@awssbggeu.in` | `admin123456` |
| Member | `member@example.com` | `member123456` |

---

## 📂 Project Structure

```
├── frontend/                 # Public website (React + Vite + Tailwind)
│   ├── public/               # Static assets (logo, images, handbook)
│   └── src/
│       ├── components/       # Navbar, Footer, Layout
│       ├── pages/            # Home, About, Events, Team, Blog, Gallery, Verify
│       └── data/             # Static event/highlight data
│
├── backend/                  # REST API (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema (20+ models)
│   │   └── seed.js           # Seed script
│   └── src/
│       ├── routes/           # auth, users, events, attendance, certificates,
│       │                     # points, referrals, resources, announcements,
│       │                     # rewards, admin, awsLab, badges, blogs, notifications
│       ├── middleware/       # JWT auth, admin guard
│       └── utils/            # audit, helpers, badges, referral, email
│
├── portal/                   # Member portal (React + Vite + Tailwind)
│   └── src/
│       ├── components/       # Shell (sidebar/bottom nav), UI primitives, InstallBanner
│       ├── context/          # Auth context (JWT)
│       ├── hooks/            # PWA install, push notifications, service worker
│       ├── pages/            # Member pages (13) + Admin pages (11)
│       └── lib/              # API client
│
└── README.md
```

---

## ✨ Features

### Public Website
- Modern dark-theme landing page with glassmorphism design
- Events, team, blog, gallery, member ID verification
- SEO optimized with structured data, OG tags, sitemap

### Member Portal (PWA — installable on mobile)
| Feature | Description |
|---------|-------------|
| **Dashboard** | Points balance, attendance count, certificates, announcements |
| **Events** | Browse events, view details, register via external link |
| **Check-in** | Rotating OTP (30s default) + QR scan + optional geolocation verification |
| **AWS Lab Access** | Request temporary AWS credentials scoped to specific services |
| **Points** | Immutable ledger — earn via attendance, certs, referrals, resources, blogs |
| **Leaderboard** | Top 50 builders ranked by points |
| **Resources** | Categorized learning materials (Cloud, AI, Full-Stack), completion tracking |
| **Certificates** | View certs with unique QR codes, public verification page |
| **Badges** | 9 achievement badges — auto-awarded on milestones |
| **Blogs** | Submit blog posts for review, community feed of approved posts |
| **Referrals** | Shareable link, anti-spoof (5/day cap, 1hr account age, geo-verified attendance) |
| **Rewards Store** | Redeem points for rewards |
| **Profile** | Edit name, bio |
| **PWA** | Install as app on mobile, push notifications |

### Admin Panel
| Feature | Description |
|---------|-------------|
| **Dashboard** | 11 metrics + charts: signups/day, attendance/event, top builders |
| **User Management** | Search, add user, bulk add (CSV), toggle role, activate/deactivate |
| **Event Management** | Create events, rotating OTP + QR check-in with geo config |
| **Certificate Issuance** | Issue single or **one-click bulk to all event attendees** with unique QR |
| **Points Adjustment** | Manual credit/debit with required reason |
| **Announcements** | Create with priority levels (Low/Normal/High/Urgent) |
| **Rewards Store** | Add, enable/disable, delete rewards |
| **Blog Reviews** | Approve/reject blog submissions, award points |
| **Bulk Email** | Send HTML emails to all members with `{{name}}` personalization |
| **Push Notifications** | Send push notifications to all subscribed users |
| **AWS Lab** | Enable/disable per event, configure services/duration, revoke sessions |
| **Audit Log** | Full trail of every admin action |

### Points System (Anti-Fraud)
| Action | Points | Verification |
|--------|--------|-------------|
| Event attendance | 50 | Time-limited OTP code (10 min) |
| AWS certification | 200 | Admin verifies before credit |
| Referral | 30 | Only after referred user attends first event |
| Resource completion | 20 | One-time per resource, server-side dedup |
| Hackathon | 100 | Admin-issued only |

Points are stored as an **immutable transaction ledger** — balance is always computed from `SUM(transactions)`, never stored as a field.

### Certificate Verification
Every certificate has a unique QR code and verification URL:
- Public verify page at `/verify/CERT-XXXXXXXXXXXX` — no login required
- Shows recipient name, certificate title, type, issue date
- QR code on each certificate links to the verify page
- Revoked certificates show as invalid

### Badge System (9 badges)
| Badge | Trigger |
|---|---|
| 🎯 First Event | Attend 1 event |
| 🔥 Regular Builder | Attend 5 events |
| ⚡ Power Builder | Attend 10 events |
| 📝 Blog Writer | 1 approved blog post |
| ✍️ Prolific Writer | 5 approved blog posts |
| 🌟 Top Contributor | Reach 500 points |
| 🚀 Referral Champion | 10 successful referrals |
| 🎓 AWS Certified | Earn an AWS certification |
| 🏆 Hackathon Winner | Admin-issued |

### PWA (Progressive Web App)
- Installable on mobile — "Add to Home Screen" prompt on first visit
- Push notifications via Web Push API (VAPID)
- Service worker for offline shell
- Generate VAPID keys: `npx web-push generate-vapid-keys`

### AWS Lab Access
Gives students temporary AWS Console credentials during events:
1. Admin enables lab on an event (sets allowed services, duration, max sessions)
2. Student clicks "Get AWS Access" on the event page
3. Backend calls AWS STS `AssumeRole` with a scoped session policy
4. Temporary credentials shown once with copy buttons
5. Credentials auto-expire — no cleanup needed

**Required AWS setup** (one-time):
- IAM Role (`SBG-StudentLabRole`) with permission boundary blocking expensive services
- Backend IAM User with only `sts:AssumeRole` permission
- Set `AWS_LAB_ROLE_ARN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` in `backend/.env`

---

## ☁️ Deployment

### Public Site (Vercel/Netlify)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Portal (Vercel/Netlify)
- **Root Directory**: `portal`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Set env: `VITE_API_URL` to your backend URL

### Backend (Railway/Render/EC2)
- **Root Directory**: `backend`
- **Start Command**: `npm start`
- Set env vars from `.env.example`
- For production: switch `DATABASE_URL` to PostgreSQL

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Open a Pull Request

---

<div align="center">
  <p>Made with ❤️ by Pawan Joshi</p>
  <p>© 2025-2026 AWS Student Builder Group GEU</p>
  <p><em>Same Community. Bigger Vision.</em></p>
</div>
