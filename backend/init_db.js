// init_db.js — No longer needed separately.
// The SQLite database and all tables are now created automatically
// when the backend server starts (backend/server.js handles it).
// You can still run this file to verify the DB is set up.

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'guardian.db'));
db.pragma('journal_mode = WAL');

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

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('✅ SQLite DB initialized: guardian.db');
console.log('   Tables:', tables.map(t => t.name).join(', '));
db.close();
