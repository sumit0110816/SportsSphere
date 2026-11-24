import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function sharedSyncPlugin(): Plugin {
  const dbPath = path.resolve(__dirname, '../sharedSyncDb.json');

  const readDb = () => {
    try {
      if (fs.existsSync(dbPath)) {
        return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading sharedSyncDb in admin:', e);
    }
    return { users: [], coachApplications: [], organizerApplications: [] };
  };

  const writeDb = (data: any) => {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing sharedSyncDb in admin:', e);
    }
  };

  return {
    name: 'shared-sync-admin-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/sync')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.url === '/api/sync/all' && req.method === 'GET') {
          const db = readDb();
          res.end(JSON.stringify(db));
          return;
        }

        if (req.url?.startsWith('/api/sync/events') && req.method === 'GET') {
          const db = readDb();
          const allEvents = Array.isArray(db.events) ? db.events : [];
          const urlObj = new URL(req.url, 'http://localhost');
          const showAll = urlObj.searchParams.get('all') === 'true';
          const events = showAll
            ? allEvents
            : allEvents.filter((e: any) => e.status === 'published' || e.status === 'Open');
          res.end(JSON.stringify({ events }));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              const db = readDb();

              if (req.url === '/api/sync/publish-event') {
                if (!Array.isArray(db.events)) {
                  db.events = [];
                }
                const existingIdx = db.events.findIndex((e: any) => e.id === payload.id);
                const publishedEvent = {
                  id: payload.id || `evt-${Date.now()}`,
                  title: payload.title,
                  subtitle: payload.subtitle || "Men's & Women's • Intercollegiate Tournament",
                  sport: payload.sport || 'Football',
                  date: payload.date || 'Dec 15, 2026',
                  daysLeft: payload.daysLeft || 14,
                  venue: payload.venue || 'University Sports Complex',
                  city: payload.city || 'National Campus Arena',
                  district: payload.district || payload.city || 'Central District',
                  state: payload.state || 'Karnataka',
                  circuitTier: payload.circuitTier || 'District',
                  registeredCount: payload.registeredCount || 0,
                  totalCapacity: payload.totalCapacity || 16,
                  status: payload.status || 'pending',
                  fee: payload.fee || '₹500 / team',
                  feeAmount: payload.feeAmount || 500,
                  organizerName: payload.organizerName || 'Verified Collegiate Organizer',
                  publishedAt: new Date().toISOString(),
                };

                if (existingIdx >= 0) {
                  db.events[existingIdx] = { ...db.events[existingIdx], ...publishedEvent };
                } else {
                  db.events.unshift(publishedEvent);
                }

                writeDb(db);
                res.end(JSON.stringify({ success: true, event: publishedEvent }));
                return;
              }

              if (req.url === '/api/sync/update-event-status') {
                const { eventId, status, reason } = payload;
                if (!Array.isArray(db.events)) {
                  db.events = [];
                }
                const ev = db.events.find((e: any) => e.id === eventId);
                if (ev) {
                  ev.status = status;
                  if (reason) ev.rejectionReason = reason;
                  ev.sanctionedAt = new Date().toISOString();
                }
                writeDb(db);
                res.end(JSON.stringify({ success: true, event: ev }));
                return;
              }

              if (req.url === '/api/sync/approve') {
                const { id, type, notes } = payload;
                if (type === 'coach') {
                  const app = db.coachApplications.find((c: any) => c.id === id);
                  if (app) {
                    app.status = 'approved';
                    app.reviewedAt = new Date().toISOString();
                    if (notes) app.verificationNotes = notes;
                    const u = db.users.find(
                      (user: any) => user.email?.toLowerCase() === app.email?.toLowerCase()
                    );
                    if (u) {
                      u.status = 'approved';
                      if (!u.roles.includes('coach')) u.roles.push('coach');
                    }
                  }
                } else if (type === 'organizer') {
                  const app = db.organizerApplications.find((o: any) => o.id === id);
                  if (app) {
                    app.status = 'approved';
                    app.reviewedAt = new Date().toISOString();
                    if (notes) app.verificationNotes = notes;
                    const u = db.users.find(
                      (user: any) =>
                        user.email?.toLowerCase() === app.email?.toLowerCase() ||
                        user.email?.toLowerCase() === app.collegeEmail?.toLowerCase()
                    );
                    if (u) {
                      u.status = 'approved';
                      if (!u.roles.includes('organizer')) u.roles.push('organizer');
                    }
                  }
                }
                writeDb(db);
                res.end(JSON.stringify({ success: true }));
                return;
              }

              if (req.url === '/api/sync/reject') {
                const { id, type, reason } = payload;
                if (type === 'coach') {
                  const app = db.coachApplications.find((c: any) => c.id === id);
                  if (app) {
                    app.status = 'rejected';
                    app.rejectionReason = reason;
                    app.reviewedAt = new Date().toISOString();
                    const u = db.users.find(
                      (user: any) => user.email?.toLowerCase() === app.email?.toLowerCase()
                    );
                    if (u) {
                      u.status = 'rejected';
                      u.verificationNotes = reason;
                    }
                  }
                } else if (type === 'organizer') {
                  const app = db.organizerApplications.find((o: any) => o.id === id);
                  if (app) {
                    app.status = 'rejected';
                    app.rejectionReason = reason;
                    app.reviewedAt = new Date().toISOString();
                    const u = db.users.find(
                      (user: any) =>
                        user.email?.toLowerCase() === app.email?.toLowerCase() ||
                        user.email?.toLowerCase() === app.collegeEmail?.toLowerCase()
                    );
                    if (u) {
                      u.status = 'rejected';
                      u.verificationNotes = reason;
                    }
                  }
                }
                writeDb(db);
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: String(err) }));
              return;
            }

            res.end(JSON.stringify({ ok: true }));
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), sharedSyncPlugin()],
  server: {
    host: true,
    port: 3003,
  },
});
