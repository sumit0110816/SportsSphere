# SportSphere 🏆

A Unified Multi-Role Sports Ecosystem connecting Student Athletes, Sports Organizers, and Coaches on a single platform with Firebase Cloud Backend.

---

## 🏛️ Architecture & Platform Overview

SportSphere consists of 4 integrated web applications running seamlessly together:

| Application | Port | Role / Purpose | Tech Stack |
|---|---|---|---|
| **sportsphere-auth** | `:3003` | Central Authentication & Single Sign-On (SSO) Portal with Firebase Auth & Cloud Firestore | React, Vite, TypeScript, Firebase |
| **miniproject-student-dashboard** | `:3000` | Athlete & Student Dashboard (Leaderboards, Highlights, Event Registrations) | HTML5, TailwindCSS, JavaScript, Vite |
| **organizer2** | `:3001` | Sports Tournament & Event Organizer Platform (Fixtures, Approvals, Results) | React, Vite, TypeScript, TailwindCSS |
| **sportsphere-coach-platform** | `:3002` | Coach & Scouting Platform (Radar, Talent Scouting, Tactical Analytics) | React, Vite, TypeScript, TailwindCSS |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### 2. Running the Applications

Each platform can be started independently:

#### Central Auth Portal (Port 3003)
```bash
cd sportsphere-auth
npm install
npm run dev -- --port 3003
```

#### Student / Athlete Dashboard (Port 3000)
```bash
cd miniproject-student-dashboard
npm install
npm run dev
```

#### Organizer Platform (Port 3001)
```bash
cd organizer2
npm install
npm run dev
```

#### Coach & Scouting Platform (Port 3002)
```bash
cd sportsphere-coach-platform
npm install
npm run dev
```

---

## 🔥 Firebase Backend Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password & Google Sign-In).
3. Enable **Cloud Firestore Database**.
4. Configure credentials in `sportsphere-auth/.env` or via the in-app **Firebase Setup** button on `http://localhost:3003`.

---

## 📄 License
MIT License. Created for the SportSphere Sports Ecosystem.
