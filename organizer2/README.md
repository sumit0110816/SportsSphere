# SportSphere | Tournament Organizer Dashboard

A dedicated, comprehensive management dashboard for sports tournament directors, athletic federations, and event organizers. Kept separately in `d:\yess\organizer2`.

---

## 📁 Directory Structure

```
organizer2/
├── src/
│   ├── components/
│   │   ├── common/              # Common UI cards, badges, statistics
│   │   ├── layout/              # Sidebar, Header, navigation components
│   │   ├── modals/              # Event creation, team registration modals
│   │   └── views/               # Dedicated views:
│   │       ├── OverviewView.tsx          # Real-time event telemetry, revenue, active teams
│   │       ├── MyEventsView.tsx          # Tournament fixtures, publish/draft statuses
│   │       ├── RegistrationsView.tsx     # Athlete entry approvals, payment verification
│   │       ├── TeamsAthletesView.tsx     # Rosters, bib allocations, identity cards
│   │       ├── FixturesScheduleView.tsx  # Match brackets, court/track assignments
│   │       ├── ScoresResultsView.tsx     # Live scoring, leaderboards, winner declarations
│   │       ├── VenuesResourcesView.tsx   # Ground bookings, equipment, technical staff
│   │       ├── PaymentsView.tsx          # Entry fees, payout reconciliation, gateway logs
│   │       ├── CertificatesView.tsx      # Digital merit certificates & bib generator
│   │       ├── AnalyticsView.tsx         # Attendance velocity, participation analytics
│   │       ├── AnnouncementsView.tsx     # Broadcast alerts & noticeboard
│   │       └── SettingsView.tsx          # Federation rules, sanctioning & organizers
│   ├── data/                    # Seed datasets & mock tournament fixtures
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx                  # Root application router
│   └── index.css                # Tailwind styling
├── index.html                   # HTML entry point
├── package.json                 # Scripts and dependencies (dev port 3001)
├── vite.config.ts               # Vite configuration
└── README.md                    # Project documentation
```

---

## 🚀 Key Modules & Capabilities

1. **Tournament Operations & Live Fixtures**:
   - Manage brackets, knockout rounds, and track lane draws.
   - Schedule venues, synthetic tracks, indoor courts, and technical officials.

2. **Athlete & Team Management**:
   - Verify collegiate squad eligibility and AIU certifications.
   - Allocate official electronic bib numbers and heats.

3. **Live Scoring & Leaderboards**:
   - Record photofinish electronic gate times and match scores.
   - Automatically update standing tables and medal tallies.

4. **Financial Reconciliation**:
   - Track entry fee collections, collegiate sponsorships, and refund workflows.

5. **Certificates & Accreditation**:
   - Generate automated digital certificates of participation and merit.

---

## 🛠️ How to Run Locally

```bash
# Navigate to the organizer directory
cd d:\yess\organizer2

# Install dependencies (if needed)
npm install

# Start the organizer development server on port 3001
npm run dev

# Run TypeScript lint check (0 errors)
npm run lint

# Build production bundle
npm run build
```

The Organizer Dashboard is accessible at **`http://localhost:3001/`**, running independently from the Student Dashboard on port `3000`.