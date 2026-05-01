# 🚀 AWS Student Builder Group — Graphic Era University

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_22-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![AWS](https://img.shields.io/badge/Community-AWS_Student_Builder_Group-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

> **The official platform for the AWS Student Builder Group at Graphic Era Deemed to be University.**
> Learn cloud, AI, and full-stack development while building real-world projects and shipping impactful solutions.

---

## 🏗️ Architecture

```
frontend/  (port 5173)  →  Public website
portal/    (port 5174)  →  Member portal (PWA)  →  backend/ (port 4000)  →  SQLite/PostgreSQL
```

| App | Description |
|-----|-------------|
| `frontend/` | Public landing page, events, team, blog, gallery |
| `backend/` | Express REST API — 20+ routes, Prisma ORM, JWT auth |
| `portal/` | Member portal — PWA, installable, push notifications |

---

## ⚡ Quick Start

```bash
git clone https://github.com/pwnjoshi/AWS-Cloud-Club-CMS.git
cd AWS-Cloud-Club-CMS

# Backend
cd backend && npm install && cp .env.example .env
npx prisma db push && node prisma/seed.js && npm run dev

# Portal (new terminal)
cd portal && npm install && npm run dev

# Public site (new terminal)
cd frontend && npm install && npm run dev
```

**Default logins:** `admin@awssbggeu.in` / `admin123456` · `member@example.com` / `member123456`

> See [SETUP.md](SETUP.md) for full configuration guide (Google OAuth, email, push notifications, AWS Lab, PostgreSQL).

---

## ✨ Features

### Member Portal (PWA — installable on mobile)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Points, attendance, certificates, announcements |
| **Events** | Browse, register, QR scan or OTP check-in with geolocation |
| **AWS Lab** | Temporary AWS credentials during events (STS AssumeRole) |
| **Points** | Immutable ledger — earn via attendance, certs, referrals, blogs, suggestions |
| **Leaderboard** | Top 50 builders ranked by points |
| **Badges** | 15+ achievement badges, auto-awarded + admin custom badges with images |
| **Certificates** | Unique QR codes, public verification page |
| **Resources** | Categorized learning materials, completion tracking |
| **Blogs** | Submit posts for review, community feed, points on approval |
| **Referrals** | Anti-spoof: 5/day cap, 1hr account age, geo-verified attendance |
| **Rewards** | Redeem points for rewards |
| **Suggest Events** | Propose ideas, earn points if approved |
| **Support** | Submit tickets, admin replies |
| **Profile** | Edit name, bio |
| **PWA** | Install as app, push notifications |

### Admin Panel

| Feature | Description |
|---------|-------------|
| **Dashboard** | 11 metrics + charts (signups/day, attendance/event, top builders) |
| **Users** | Add, bulk add (CSV), edit name/email/password, toggle role, activate/deactivate |
| **Events** | Create, rotating OTP + QR check-in with configurable geo, manual add attendee |
| **Certificates** | Issue single or one-click bulk to event attendees, unique QR per cert |
| **Badges** | Create custom badges with images, award to any user |
| **Points** | Manual adjust with searchable member select |
| **Blogs** | Approve/reject submissions |
| **Suggestions** | Review event ideas, award points (25/50 pts) |
| **Support** | View/reply to tickets, filter by status |
| **Rewards** | Add, enable/disable, delete |
| **Announcements** | Create with priority levels |
| **Bulk Email** | HTML emails with `{{name}}` personalization (Resend) |
| **Push Notifications** | Send to all subscribed users (VAPID) |
| **AWS Lab** | Enable per event, configure services/duration, revoke sessions |
| **Maintenance Mode** | One-click portal lockdown for all non-admin users |
| **Audit Log** | Full trail of every admin action |

### Security

| Layer | Implementation |
|-------|---------------|
| **Auth** | JWT + bcrypt (12 rounds), Google OAuth, forced password reset for admin-created users |
| **Email validation** | Only Gmail, Outlook, Yahoo, GEU, iCloud, ProtonMail — temp/disposable emails blocked |
| **Input sanitization** | HTML tags stripped from all text inputs |
| **Rate limiting** | 30 login attempts/15min, 1000 global/15min |
| **Anti-fraud points** | Immutable ledger, OTP + geo attendance, referral caps, account age checks |
| **Rotating OTP** | 30s default (10-300s configurable), QR code, geolocation radius check |
| **Maintenance mode** | Instant portal lockdown, admin-only access |
| **CORS** | Configurable allowed origins |
| **Helmet** | Security headers on all responses |
| **Audit trail** | Every admin action logged with actor, target, details |
| **Past event guard** | Check-in and AWS Lab blocked after event ends |
| **Data persistence** | PostgreSQL for production, auto-backup for SQLite dev |

### Check-in System

```
Admin starts session → Code rotates every 30s → QR + OTP displayed
Student scans QR or enters code → Geo verified (if enabled) → Attendance + points
```

### Points System

| Action | Points | Verification |
|--------|--------|-------------|
| Event attendance | 50 | Rotating OTP + geo |
| AWS certification | 200 | Admin verifies |
| Blog approved | 50 | Admin reviews |
| Event suggestion approved | 25-50 | Admin reviews |
| Referral | 30 | First event + 1hr account age |
| Resource completion | 20 | One-time, server-side |
| Hackathon | 100 | Admin-issued |

---

## ☁️ Deployment

| App | Platform | Root Dir | Build | Output |
|-----|----------|----------|-------|--------|
| Public site | Vercel/Netlify | `frontend` | `npm run build` | `dist` |
| Portal | Vercel/Netlify | `portal` | `npm run build` | `dist` |
| Backend | Railway/Render | `backend` | — | `npm start` |

> ⚠️ **Use PostgreSQL for production** — SQLite data is lost on Render cold starts. See [SETUP.md](SETUP.md).

---

## 🤝 Contributing

1. Fork → 2. Branch → 3. Commit → 4. PR

---

<div align="center">
  <p>Made with ❤️ by Pawan Joshi</p>
  <p>© 2025-2026 AWS Student Builder Group GEU</p>
  <p><em>Same Community. Bigger Vision.</em></p>
</div>
