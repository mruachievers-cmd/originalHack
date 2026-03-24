// seed_db.js — Populates the SQLite database with sample/mock data for demo
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'guardian.db'));
db.pragma('journal_mode = WAL');

// ── Ensure tables exist ──────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS suspects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    descriptor TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'Unknown',
    location TEXT,
    threat_classification TEXT NOT NULL DEFAULT 'Silence',
    confidence REAL DEFAULT 0,
    signal_path TEXT NOT NULL DEFAULT 'Direct',
    severity TEXT NOT NULL DEFAULT 'LOW',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ── Seed Suspects ─────────────────────────────────────────────────────────────
const suspectCount = db.prepare('SELECT COUNT(*) as count FROM suspects').get();
if (suspectCount.count === 0) {
  const insertSuspect = db.prepare('INSERT INTO suspects (name, descriptor) VALUES (?, ?)');

  const suspects = [
    { name: 'Rajan Mehta',    descriptor: Array(128).fill(0).map(() => Math.random() * 2 - 1) },
    { name: 'Arjun Verma',   descriptor: Array(128).fill(0).map(() => Math.random() * 2 - 1) },
    { name: 'Sanjay Patil',  descriptor: Array(128).fill(0).map(() => Math.random() * 2 - 1) },
    { name: 'Deepak Rao',    descriptor: Array(128).fill(0).map(() => Math.random() * 2 - 1) },
    { name: 'Vijay Sharma',  descriptor: Array(128).fill(0).map(() => Math.random() * 2 - 1) },
  ];

  for (const s of suspects) {
    insertSuspect.run(s.name, JSON.stringify(s.descriptor));
  }
  console.log(`✅ Inserted ${suspects.length} suspects`);
} else {
  console.log(`ℹ️  Suspects already seeded (${suspectCount.count} records)`);
}

// ── Seed ALEF Alerts ──────────────────────────────────────────────────────────
const alertCount = db.prepare('SELECT COUNT(*) as count FROM alerts').get();
if (alertCount.count === 0) {
  const insertAlert = db.prepare(`
    INSERT INTO alerts (user_id, location, threat_classification, confidence, signal_path, severity, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const now = Date.now();
  const alerts = [
    { user_id: 'GN-24-X',  location: 'Park Avenue, Lane 3',       cls: 'Gunshot',  conf: 0.91, path: 'Direct', sev: 'HIGH',   ts: new Date(now - 5 * 60000).toISOString() },
    { user_id: 'GN-19-B',  location: 'Central Mall Parking',       cls: 'Scream',   conf: 0.78, path: 'Mesh',   sev: 'MEDIUM', ts: new Date(now - 12 * 60000).toISOString() },
    { user_id: 'GN-31-K',  location: 'Metro Station Exit B',       cls: 'Silence',  conf: 0.95, path: 'Direct', sev: 'LOW',    ts: new Date(now - 20 * 60000).toISOString() },
    { user_id: 'GN-24-X',  location: 'North Station Road',         cls: 'Scream',   conf: 0.82, path: 'Mesh',   sev: 'MEDIUM', ts: new Date(now - 35 * 60000).toISOString() },
    { user_id: 'GN-07-Z',  location: 'Sector 4 Market',            cls: 'Gunshot',  conf: 0.88, path: 'Direct', sev: 'HIGH',   ts: new Date(now - 55 * 60000).toISOString() },
    { user_id: 'GN-52-T',  location: 'Old City Highway Junction',  cls: 'Silence',  conf: 0.97, path: 'Direct', sev: 'LOW',    ts: new Date(now - 90 * 60000).toISOString() },
    { user_id: 'GN-15-M',  location: 'Banjara Hills Checkpoint',   cls: 'SOS',      conf: 1.00, path: 'Mesh',   sev: 'HIGH',   ts: new Date(now - 110 * 60000).toISOString() },
  ];

  for (const a of alerts) {
    insertAlert.run(a.user_id, a.location, a.cls, a.conf, a.path, a.sev, a.ts);
  }
  console.log(`✅ Inserted ${alerts.length} ALEF alerts`);
} else {
  console.log(`ℹ️  Alerts already seeded (${alertCount.count} records)`);
}

// ── Summary ──────────────────────────────────────────────────────────────────
const totals = {
  suspects: db.prepare('SELECT COUNT(*) as count FROM suspects').get().count,
  alerts:   db.prepare('SELECT COUNT(*) as count FROM alerts').get().count,
};

console.log(`\n📊 Database Summary:`);
console.log(`   suspects: ${totals.suspects} records`);
console.log(`   alerts:   ${totals.alerts} records`);

db.close();
console.log('\n✅ Seed complete! Run: node backend/server.js\n');
