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
│   │   ├── schema.prisma     # Database schema (15 models)
│   │   └── seed.js           # Seed script
│   └── src/
│       ├── routes/           # auth, users, events, attendance, certificates,
│       │                     # points, referrals, resources, announcements,
│       │                     # rewards, admin, awsLab
│       ├── middleware/       # JWT auth, admin guard
│       └── utils/            # audit logger, helpers
│
├── portal/                   # Member portal (React + Vite + Tailwind)
│   └── src/
│       ├── components/       # Shell (sidebar/bottom nav), UI primitives
│       ├── context/          # Auth context (JWT)
│       ├── pages/            # Member pages (11) + Admin pages (9)
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

### Member Portal
| Feature | Description |
|---------|-------------|
| **Dashboard** | Points balance, attendance count, certificates, announcements |
| **Events** | Browse events, view details, register via external link |
| **OTP Check-in** | Enter 6-digit code at events to mark attendance + earn points |
| **AWS Lab Access** | Request temporary AWS credentials scoped to specific services |
| **Points** | Immutable ledger — earn via attendance, certs, referrals, resources |
| **Leaderboard** | Top 50 builders ranked by points |
| **Resources** | Categorized learning materials (Cloud, AI, Full-Stack), completion tracking |
| **Certificates** | View issued certs, unique verification codes |
| **Referrals** | Shareable link, points credited after referred user's first event |
| **Rewards Store** | Redeem points for rewards |
| **Profile** | Edit name, bio |

### Admin Panel
| Feature | Description |
|---------|-------------|
| **Dashboard** | Total users, events, attendance, certificates, points stats |
| **User Management** | Search, toggle role (Admin/Member), activate/deactivate |
| **Event Management** | Create events, generate OTP codes for check-in |
| **Certificate Issuance** | Issue to individual members with optional points |
| **Points Adjustment** | Manual credit/debit with required reason |
| **Announcements** | Create with priority levels (Low/Normal/High/Urgent) |
| **Rewards Store** | Add/manage rewards, view redemptions |
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
