# SportSphere | Universal Sports & Student Talent Platform

A modern, high-performance web dashboard for collegiate sports competition discovery, athlete talent scouting, verified sprint analytics, and tournament registrations.

---

## 🚀 Frontend Technologies

In accordance with project requirements, the frontend is built using:
- **HTML5**: Semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<dialog>`, `<footer>`) with accessible attributes and meta tags.
- **CSS3 with Tailwind CSS CDN Integration**: 
  - Integrated via official CDN (`https://cdn.tailwindcss.com`).
  - Custom keyframe animations (`athletePacing`, `stadiumGlow`, `pulseAura`, `slideInUp`).
  - Glassmorphism navigation bars and backdrop blurs (`backdrop-filter`).
  - Custom scrollbars, responsive cards, and badge accents.
- **JavaScript (Fetch API)**:
  - Native asynchronous **Fetch API** (`fetch()`, `async/await`, `Promise.all`).
  - Dynamic data consumption from structured JSON endpoints (`/data/competitions.json`, `/data/venues.json`, `/data/athlete.json`, `/data/teams.json`, `/data/scholarships.json`).
  - Simulated RESTful `POST` endpoints with headers, response validation, and local state updates.
  - Offline / `file://` fallback handling so the application functions seamlessly in any environment.

---

## 📁 Project Directory Structure

```
miniproject-student-dashboard/
│
├── index.html                   # HTML5 Entry Point with Tailwind CSS CDN & Material Symbols
├── css/
│   └── style.css                # CSS3 styles, keyframe animations, glassmorphism, responsive tokens
├── js/
│   ├── api.js                   # JavaScript Fetch API client (asynchronous data provider & endpoints)
│   └── app.js                   # Application state, navigation tabs, geolocation, modals, filtering
├── data/
│   ├── competitions.json        # Tournament fixtures, match scores, entry fees, deadlines
│   ├── venues.json              # Stadium venues, synthetic track facilities, coordinates
│   ├── athlete.json             # Athlete profile, biometrics, registrations, achievements, experience
│   ├── highlights.json          # Athletic video/photo highlights, match reels, verified stats
│   ├── categories.json          # Sports disciplines & categories with active tournament counts
│   └── scholarships.json        # National SAI fellowships, Reliance grants, sports quota positions
├── src/                         # TypeScript/React source components (verified with zero errors)
├── package.json                 # Project configuration and NPM scripts
├── vite.config.ts               # Vite server & bundler configuration
└── README.md                    # Project documentation
```

---

## 🌟 Key Features

1. **Dashboard Landing on Overview**:
   - When a student or athlete opens the dashboard, the first screen they see is the **Overview** containing the floodlit stadium hero banner, key metric counters, confirmed schedules, upcoming trials, sprint biometrics snapshot, and quick jump cards to Reels and Categories.

2. **Dedicated Highlights & Reels Section (Separate)**:
   - Separate navigation tab for viewing and posting athletic video reels, photofinish finishes, jump smashes, and training clips.
   - Verified stats tags on every highlight (e.g. *Sub-47s 400m*, *340 km/h jump smash*, *28-yard curler*).
   - Interactive Like button with live count increment, comment counters, and share links.
   - **"Post New Highlight"** interactive modal to publish new highlights with title, sport category, caption, stat metrics, and media URL via asynchronous Fetch API simulation.

3. **LinkedIn-Style Athlete Sports CV & Profile Section (Separate)**:
   - Dedicated profile tab designed like LinkedIn for varsity athletes and students.
   - Cover banner, verified athlete badge, and athletic headline (*"400m Track & Field Varsity Sprinter | AIU National Gold Medalist '24 | AFI Verified Scout Index: 94/100"*).
   - **"Share Sports CV"** action (copies direct shareable athlete link).
   - **"Download Resume (PDF)"** action (clean printable athletic CV).
   - **"Open to Scouting & Trials"** badge (analogous to LinkedIn's "Open to Work") showing target roles.
   - **Athletic Career & Leadership Experience** timeline (Captaincy, State team, SAI trainee).
   - **Education & Degree background** (B.P.Ed, Honours, Sports Council).
   - **Skills & Endorsements** with interactive `+ Endorse` buttons and counter updates.
   - **Coach & Faculty Recommendations** with authentic testimonials.

4. **Dedicated Sports Categories Section (Separate)**:
   - Browse tournaments and circuits by discipline (*Athletics / Track & Field, Football, Badminton, Aquatics, Volleyball, Basketball*).
   - Displays active tournaments, registered athletes, top venue, and key events.
   - One-click **"Browse Category Tournaments"** button that directly opens the Discover view with that category pre-filtered.

5. **Slide-Out Sidebar Menu Drawer (All & Remaining Features)**:
   - Accessible via the hamburger menu icon (`menu`) next to the brand logo.
   - Organizes all core and remaining features into categorized sections:
     - **Main Platform**: Overview, Highlights & Reels, Sports CV & Profile, Categories, Discover Tournaments.
     - **Competitions & Stadiums**: Nearby Stadiums & Hubs (interactive map), My Registrations & Bib Passes (with badge count), Sports Calendar & Timeline.
     - **Biometrics & Records**: Sprint Biometrics & Velocity Curves, Verified Medals & Accreditations (6 medals).
     - **Grants & Saved**: National Scholarships & Fellowships, Saved Competitions (with live bookmark count).
   - Quick action shortcuts in the sidebar footer: **"Submit Trial"** and **"Upload Video"**.
   - Keyboard accessible (`Esc` key closes drawer). Auto-closes upon selecting any feature.

6. **Tournament Discovery & Instant Filtering**:
   - Live search with instant debounce matching competition names, venues, or sports categories.
   - Discipline filter chips (Athletics, Football, Badminton, Swimming, Volleyball).
   - Circuit tier filters (University, State, National, District).
   - Multi-attribute sorting: Match Score, Distance, Available Slots.

3. **Live Geolocation & Distance Calculation**:
   - Real-time GPS detection via browser `navigator.geolocation`.
   - Haversine mathematical formula computing precise distances in kilometers.
   - Preset Indian regional hub switcher:
     - Bengaluru Central, KA
     - Delhi NCR University Hub
     - Mumbai University Campus, MH
     - Hyderabad Gachibowli Hub, TS
     - Chennai Anna University, TN
     - Kolkata Salt Lake Stadium, WB
   - Instant re-calculation of all competition distances upon location change.

4. **Interactive Stadium Map Canvas**:
   - Visual stadium node coordinate pins across regional athletic circuits.
   - Comprehensive facility inspection (synthetic 8-lane tracks, Omega photofinish gates, medical centers).

5. **Competition Registration & Digital Bib Passes**:
   - Interactive Registration Modal with division selection, UID input, and waiver check.
   - Asynchronous submission using the native **Fetch API**.
   - Generates verified registration records with assigned Bib Numbers (e.g., `KA-400M-8492`), heat numbers, and download bib passes.

6. **Sprint Biometrics & Season Pacing Analytics**:
   - Photofinish split velocities (0–100m, 100–200m, 200–300m, 300–400m).
   - Velocity outputs (m/s) and effort percentages.
   - Season progression timeline across state and university meets.

8. **Athlete CV Dossier**:
   - Comprehensive printable digital athletic dossier including verified medals, scout rating, block reaction times, and anti-doping certifications.

9. **National Sports Scholarships & Grants**:
   - Sports Authority of India (SAI) Varsity Fellowship, Reliance Foundation Olympic Pathway, and Indian Railways Sports Quota.

---

## 🛠️ How to Run Locally

### Option 1: Direct Browser Opening
Simply double-click or open [index.html](file:///d:/yess/miniproject-student-dashboard/index.html) in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Run with Development Server
```bash
# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```
Open `http://localhost:3000/` in your browser.

### Option 3: Production Build & Verification
```bash
# Run TypeScript / Linting check (0 errors)
npm run lint

# Build production bundle
npm run build
```

---

## 🏆 Standards & Accreditations
- **AIU (Association of Indian Universities)**: Accredited inter-university qualification pathway.
- **AFI (Athletics Federation of India)**: Electronic timing photofinish calibration.
- **NADA**: Clean sport and anti-doping compliance.
