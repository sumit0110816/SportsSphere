# SportSphere Coach & Scouting Platform 🏆

A high-performance sports coaching intelligence, athlete telemetry radar, tournament discovery, and tactical training platform built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Lucide Icons**.

---

## 🚀 Features

- **📊 Coaching Overview**: High-level command center with key metrics, upcoming scouting events, athlete activity feeds, and tactical readiness indicators.
- **🏟️ Tournaments & Nearby Discovery**: Nearby events filter with customizable coach base radius (< 15 mi, < 25 mi, < 50 mi), simulated GPS location detection, distance badges, drive times, and venue map directions.
- **📰 Sports News & Live Wire**: Dedicated sports news feed with breaking news ticker, categories (Football, Athletics, Basketball, Cricket, Regulations, Sports Science), full article reader modal, and coach bookmarks.
- **💼 LinkedIn-Style Coach Profile**: Full LinkedIn-inspired profile layout featuring customizable cover banner, verified badge, headline, open-to-scouting status, private analytics (views & search appearances), experience history, certifications, and skills.
- **🎥 Post Highlights Composer**: In-profile highlight composer allowing coaches to post athlete match clips, telemetry metrics (#34.8km/h, #11.24s split), and video reels directly into an interactive social feed with likes, comments, and reposts.
- **📡 Athlete Telemetry Radar**: Deep-dive performance analytics, biometrics tracking, speed/stamina radar charts, and readiness scores.
- **🏅 Leaderboards & Rankings**: Searchable athlete directory with tier classifications, scout recommendations, and comparison tools.
- **🌐 Scouting Network**: Athlete scouting notes, coach network connections, and direct communication logs.
- **🎬 Highlights Hub**: Media player for athlete game reels, highlight tags, and performance video analysis.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **AI Integrations**: [@google/genai](https://www.npmjs.com/package/@google/genai)

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will launch on **http://localhost:3002/**.

### 3. Type Check & Build
```bash
npm run lint     # tsc --noEmit
npm run build    # vite build
```

---

## 🌐 Multi-Dashboard Ecosystem Architecture

This platform operates independently within the SportSphere multi-portal ecosystem:

| Portal | Directory | Default Port | Primary Audience |
| :--- | :--- | :--- | :--- |
| **Student / Athlete Dashboard** | `d:\yess\miniproject-student-dashboard` | `http://localhost:3000` | Students, Athletes, Highlighting, Resume/CV |
| **Tournament Organizer Dashboard** | `d:\yess\organizer2` | `http://localhost:3001` | Event Organizers, Brackets, Registrations |
| **Coach & Scouting Platform** | `d:\yess\sportsphere-coach-platform` | `http://localhost:3002` | Coaches, Talent Scouts, Tactical Analytics |
