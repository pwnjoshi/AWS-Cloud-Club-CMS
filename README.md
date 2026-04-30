# 🚀 AWS Student Builder Group - Graphic Era University

[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![AWS](https://img.shields.io/badge/Community-AWS_Student_Builder_Group-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

> **The official digital hub for the AWS Student Builder Group at Graphic Era Deemed to be University.**  
> Learn cloud, AI, and full-stack development while building real-world projects and shipping impactful solutions.

---

## 🚀 Project Overview

Everything you see is **100% Static Frontend**.  
We have architected this platform to be lightweight, incredibly fast, and serverless-ready.

- **Zero Backend**: No databases to manage, no API latency.
- **Instant Deployment**: Optimized for Vercel & Netlify.
- **Modern UI**: Custom-built Glassmorphism design system using Tailwind CSS.
- **SEO Optimized**: Built-in sitemap, meta tags, and structured data.

---

## ⚡ Tech Stack & Architecture

| Component | Technology | Description |
|-----------|------------|-------------|
| **Core** | ![React](https://img.shields.io/badge/-React_19-black?style=flat-square&logo=react) | Component-based UI Architecture |
| **Bundler** | ![Vite](https://img.shields.io/badge/-Vite-black?style=flat-square&logo=vite) | Lightning-fast HMR and build |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS_4-black?style=flat-square&logo=tailwind-css) | Utility-first CSS framework with Glassmorphism |
| **Icons** | ![Lucide](https://img.shields.io/badge/-Lucide-black?style=flat-square) | Lightweight, beautiful SVG icons |
| **Routing** | ![React Router](https://img.shields.io/badge/-React_Router_7-black?style=flat-square&logo=react-router) | Client-side navigation |

---

## 🛠️ Quick Start Guide

Ready to contribute or run this locally? Follow these simple steps:

### 1. Clone & Navigate
```bash
git clone https://github.com/pwnjoshi/AWS-Cloud-Club-CMS.git
cd AWS-Cloud-Club-CMS/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Dev Server
```bash
npm run dev
```
🌟 Open `http://localhost:5173` to view the site!

---

## 📂 Project Structure

```bash
AWS-Student-Builder-Group-GEU/
├── frontend/             # 🎨 The Heart of the App
│   ├── public/           # Static Assets (Images, Icons, Sitemap)
│   └── src/
│       ├── components/   # Atomic UI Building Blocks (Navbar, Footer, Cards)
│       ├── pages/        # Route Views (Home, Events, Team, Gallery, About)
│       ├── data/         # 🧠 The "Brain" (Static Data)
│       │   └── mockData.js  <-- EDIT THIS TO UPDATE DYNAMIC CONTENT
│       ├── App.jsx       # Routing Logic
│       └── index.css     # Global Styles (Tailwind Directives)
├── README.md             # 📖 You are here
└── .gitignore            # Git configuration
```

---

## 📝 Managing Content (CMS)

We use a **"Code-as-CMS"** approach. You don't need a database to update the site.

### Updating Events, News, or Highlights
1.  Navigate to `frontend/src/data/mockData.js`.
2.  Modify the constant arrays:
    -   **`EVENTS`**: Add new objects for upcoming meetups.
    -   **`NEWS`**: Update the breaking news ticker.
    -   **`HIGHLIGHTS`**: Change the homepage featured image.

**Example Event Update:**
```javascript
{
    id: 1,
    title: "New Workshop",
    start_time: "2026-02-15T10:00:00+05:30", // or "TBA"
    location: "Auditorium",
    image: "/events/new-image.jpg"
}
```

### Updating Static Pages
- **About/Team**: Edit `frontend/src/pages/About.jsx` or `Team.jsx` directly to update text content or add/remove team members.

---

## ☁️ Deployment

This project is built to live on the **Edge**.

1.  **Vercel / Netlify**: Connect your GitHub repo.
2.  **Build Settings**:
    -   **Root Directory**: `frontend`
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
3.  **Deploy**: It just works.

---

## 🤝 Contributing

We welcome contributions from the community!
1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Open a Pull Request.

---

<div align="center">
  <p>Made with ❤️ by Pawan Joshi</p>
  <p>© 2025-2026 AWS Student Builder Group GEU</p>
  <p><em>Same Community. Bigger Vision.</em></p>
</div>
