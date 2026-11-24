import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
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
      console.error('Error reading sharedSyncDb in coach platform:', e);
    }
    return { users: [], coachApplications: [], organizerApplications: [], events: [] };
  };

  const writeDb = (data: any) => {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing sharedSyncDb in coach platform:', e);
    }
  };

  return {
    name: 'shared-sync-coach-plugin',
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

        if (req.url === '/api/sync/events' && req.method === 'GET') {
          const db = readDb();
          const events = Array.isArray(db.events) ? db.events : [];
          res.end(JSON.stringify({ events }));
          return;
        }

        if (req.url === '/api/sync/publish-event' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              const db = readDb();
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
                registeredCount: payload.registeredCount || 0,
                totalCapacity: payload.totalCapacity || 16,
                status: payload.status || 'Open',
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
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: String(err) }));
              return;
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), sharedSyncPlugin()],
    resolve: {
      alias: {
        '@': import.meta.dirname,
      },
    },
    server: {
      host: true,
      port: 3002,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
