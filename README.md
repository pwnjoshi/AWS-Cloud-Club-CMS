# ☁️ AWS Cloud Club - Graphic Era University

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![AWS](https://img.shields.io/badge/Community-AWS_Cloud_Club-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://www.meetup.com/aws-cloud-club-at-graphic-era/)

> **The official digital hub for the AWS Cloud Club at Graphic Era Deemed to be University.**  
> Bridging the gap between theory and practice, empowering students to build on the Cloud.

---

## 🚀 Project Overview

Everything you see is **100% Static Frontend**.  
We have architected this platform to be lightweight, incredibly fast, and serverless-ready.

- **Zero Backend**: No databases to manage, no API latency.
- **Instant Deployment**: Optimized for Vercel & Netlify.
- **Premium UI**: Custom-built Glassmorphism design system.

---

## ⚡ Tech Stack & Architecture

| Component | Technology | Description |
|-----------|------------|-------------|
| **Core** | ![React](https://img.shields.io/badge/-React-black?style=flat-square&logo=react) | Component-based UI Architecture |
| **Bundler** | ![Vite](https://img.shields.io/badge/-Vite-black?style=flat-square&logo=vite) | Lightning-fast HMR and build |
| **Styling** | ![CSS3](https://img.shields.io/badge/-CSS3-black?style=flat-square&logo=css3) | Vanilla CSS with Variables & Glassmorphism |
| **Icons** | ![Lucide](https://img.shields.io/badge/-Lucide-black?style=flat-square) | Lightweight, beautiful SVG icons |
| **Routing** | ![React Router](https://img.shields.io/badge/-React_Router-black?style=flat-square&logo=react-router) | Client-side navigation |

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

## � Project Structure

```bash
AWS-Cloud-Club-GEU/
├── frontend/             # 🎨 The Heart of the App
│   ├── public/           # Static Assets (Images, Icons)
│   └── src/
│       ├── components/   # Atomic UI Building Blocks (Navbar, Cards, Footer)
│       ├── pages/        # Route Views (Home, Events, Team, Gallery)
│       ├── data/         # 🧠 The "Brain" (Static Data)
│       │   └── mockData.js  <-- EDIT THIS TO UPDATE CONTENT
│       ├── App.jsx       # Routing Logic
│       └── index.css     # Global Design System
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
  <p>© 2025 AWS Cloud Club GEU</p>
</div>
