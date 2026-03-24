import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ═══════════════════════════════════════
// SQLite Database Setup
// ═══════════════════════════════════════
const db = new Database(join(__dirname, 'guardian.db'));
db.pragma('journal_mode = WAL');

// Create tables on startup
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

console.log('✅ SQLite database ready: guardian.db');

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[Socket.io] Police Dashboard connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`[Socket.io] Disconnected: ${socket.id}`));
});

// ═══════════════════════════════════════
// SUSPECTS API
// ═══════════════════════════════════════
app.get('/api/suspects', (req, res) => {
  try {
    const rows = db.prepare('SELECT name, descriptor FROM suspects').all();
    const suspects = rows.map(row => ({
      name: row.name,
      descriptors: [JSON.parse(row.descriptor)]
    }));
    res.json(suspects);
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: 'Failed to fetch suspects', details: error.message });
  }
});

app.post('/api/suspects', (req, res) => {
  const { name, descriptor } = req.body;
  try {
    db.prepare('INSERT INTO suspects (name, descriptor) VALUES (?, ?)').run(name, JSON.stringify(descriptor));
    res.status(201).json({ message: 'Suspect added successfully' });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: 'Failed to add suspect' });
  }
});

// ═══════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════
app.post('/api/signup', (req, res) => {
  const { name, unit, email, password } = req.body;
  if (name && email && password) {
    res.status(201).json({ message: 'Registration successful', user: { name, email } });
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});

app.post('/api/login/officer', (req, res) => {
  const { badge_id, station } = req.body;
  if (badge_id === 'GN-1234-5678' && station === 'CENTRAL PRECINCT 01') {
    res.json({ success: true, user: { badge_id, station, role: 'officer' } });
  } else {
    res.status(401).json({ error: 'Invalid Badge ID or Station' });
  }
});

app.post('/api/login/citizen', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ success: true, user: { email, role: 'citizen' } });
  } else {
    res.status(401).json({ error: 'Invalid Email or Password' });
  }
});

// ═══════════════════════════════════════
// ALEF — ACOUSTIC ALERTS API
// ═══════════════════════════════════════
app.post('/api/alerts', (req, res) => {
  const { classification, confidence, signal_path, user_id, location, timestamp } = req.body;
  try {
    const severity = classification === 'Gunshot' ? 'HIGH' : classification === 'Scream' ? 'MEDIUM' : 'LOW';
    db.prepare(
      'INSERT INTO alerts (user_id, location, threat_classification, confidence, signal_path, timestamp, severity) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      user_id || 'Unknown',
      location || 'Unknown',
      classification || 'Silence',
      confidence || 0,
      signal_path || 'Direct',
      timestamp || new Date().toISOString(),
      severity
    );

    // Broadcast to Police Dashboard
    io.emit('new_alert', { user_id, location, classification, confidence, signal_path, timestamp, severity });
    console.log(`[ALEF] Alert: ${classification} (${((confidence || 0) * 100).toFixed(0)}%) via ${signal_path}`);
    res.status(201).json({ message: 'Alert recorded', classification });
  } catch (error) {
    console.error('[ALEF] DB error:', error);
    io.emit('new_alert', { user_id, location, classification, confidence, signal_path, timestamp });
    res.status(201).json({ message: 'Alert broadcast (DB error)', classification });
  }
});

app.get('/api/alerts', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50').all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// ═══════════════════════════════════════
// PHANTOM MESH — RELAY PACKET API
// ═══════════════════════════════════════
app.post('/api/relay-packet', (req, res) => {
  const { userId, lastGPS, timestamp, signalPath } = req.body;
  console.log(`[Phantom Mesh] Relay from ${userId} via ${signalPath}`, lastGPS);

  // Broadcast to Police Dashboard
  io.emit('mesh_relay', {
    userId,
    lastGPS,
    timestamp,
    signalPath,
    message: `Relaying Emergency Signal for User ${userId} via Bluetooth Mesh`,
  });

  try {
    db.prepare(
      'INSERT INTO alerts (user_id, location, threat_classification, confidence, signal_path, timestamp, severity) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      userId || 'Unknown',
      lastGPS ? `${lastGPS.lat}, ${lastGPS.lng}` : 'Unknown',
      'SOS',
      1.0,
      signalPath || 'Mesh',
      timestamp || new Date().toISOString(),
      'HIGH'
    );
  } catch (error) {
    console.error('[Phantom Mesh] DB error (non-critical):', error.message);
  }

  res.status(201).json({ message: 'Relay packet received and broadcast to command center' });
});

// ═══════════════════════════════════════
// WEBHOOK PROXY
// ═══════════════════════════════════════
app.post('/api/trigger-webhook', async (req, res) => {
  const TEST_URL = "https://uninstructed-sharan-uncorpulent.ngrok-free.dev/webhook-test/e036c541-c252-4eda-af88-6eeca706a184";
  const PROD_URL = "https://uninstructed-sharan-uncorpulent.ngrok-free.dev/webhook/e036c541-c252-4eda-af88-6eeca706a184";
  
  console.log(`[Proxy] Incoming FIR for Telegram: ${req.body.telegram}`);
  
  const trigger = async (url) => {
    console.log(`[Proxy] Attempting FIR Trigger: ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    return response;
  };

  try {
    // Try Production first
    let response = await trigger(PROD_URL);
    
    if (response.status === 404) {
      console.log(`[Proxy] FIR Production URL returned 404. Trying Test URL...`);
      response = await trigger(TEST_URL);
    }

    if (response.ok) {
      console.log(`[Proxy] FIR Success! Status: ${response.status}`);
      res.json({ success: true, message: 'Webhook triggered successfully' });
    } else {
      const text = await response.text();
      console.error(`[Proxy] FIR Failed. Status: ${response.status}, Body: ${text}`);
      res.status(response.status).json({ success: false, message: 'Webhook failed', error: text });
    }
  } catch (error) {
    console.error('[Proxy] Critical Error:', error.message);
    res.status(500).json({ success: false, message: 'Proxy failed', error: error.message });
  }
});

// SOS Webhook Proxy
app.post('/api/sos-webhook', async (req, res) => {
  const TEST_URL = "https://uninstructed-sharan-uncorpulent.ngrok-free.dev/webhook-test/476a8980-a1ec-4e11-8f7d-b4bb4a51d2dd";
  const PROD_URL = "https://uninstructed-sharan-uncorpulent.ngrok-free.dev/webhook/476a8980-a1ec-4e11-8f7d-b4bb4a51d2dd";
  
  console.log(`[Proxy] SOS Alert from: ${req.body.user}`);
  
  const trigger = async (url) => {
    console.log(`[Proxy] Attempting SOS Trigger: ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...req.body,
        timestamp: new Date().toISOString(),
        alert_type: "CRITICAL_SOS_EMERGENCY"
      })
    });
    return response;
  };

  try {
    // Try Production first
    let response = await trigger(PROD_URL);
    
    if (response.status === 404) {
      console.log(`[Proxy] SOS Production URL returned 404. Trying Test URL...`);
      response = await trigger(TEST_URL);
    }

    if (response.ok) {
      console.log(`[Proxy] SOS Webhook success! Status: ${response.status}`);
      res.json({ success: true, message: 'SOS Webhook triggered' });
    } else {
      const text = await response.text();
      console.error(`[Proxy] SOS Webhook failed. Status: ${response.status}, Body: ${text}`);
      res.status(response.status).json({ success: false, error: text });
    }
  } catch (error) {
    console.error('[Proxy] SOS Proxy Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

httpServer.listen(PORT, () => {
  console.log(`\n🛡️  GuardianNet Backend`);
  console.log(`   ✅ Server running on http://localhost:${PORT}`);
  console.log(`   ✅ Socket.io ready for Police Dashboard`);
  console.log(`   ✅ SQLite database: backend/guardian.db\n`);
});
