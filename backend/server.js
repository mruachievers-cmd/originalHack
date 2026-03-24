import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Debug environment variables
console.log('DB CONFIG:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'criminal_db',
  hasPassword: !!process.env.DB_PASSWORD
});

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'criminal_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[Socket.io] Police Dashboard connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`[Socket.io] Disconnected: ${socket.id}`));
});

// ═══════════════════════════════════════
// SUSPECTS API
// ═══════════════════════════════════════
app.get('/api/suspects', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name, descriptor FROM suspects');
    const suspects = rows.map(row => ({
      name: row.name,
      descriptors: [JSON.parse(row.descriptor)]
    }));
    res.json(suspects);
  } catch (error) {
    console.error('DATABASE ERROR DETAILS:', error);
    res.status(500).json({ error: 'Failed to fetch suspects', details: error.message });
  }
});

app.post('/api/suspects', async (req, res) => {
  const { name, descriptor } = req.body;
  try {
    await pool.query('INSERT INTO suspects (name, descriptor) VALUES (?, ?)', [name, JSON.stringify(descriptor)]);
    res.status(201).json({ message: 'Suspect added successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to add suspect' });
  }
});

// ═══════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════
app.post('/api/signup', async (req, res) => {
  const { name, unit, email, password } = req.body;
  console.log('SIGNUP REQUEST:', { name, unit, email });
  if (name && email && password) {
    res.status(201).json({ message: 'Registration successful', user: { name, email } });
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});

app.post('/api/login/officer', async (req, res) => {
  const { badge_id, station } = req.body;
  if (badge_id === 'GN-1234-5678' && station === 'CENTRAL PRECINCT 01') {
    res.json({ success: true, user: { badge_id, station, role: 'officer' } });
  } else {
    res.status(401).json({ error: 'Invalid Badge ID or Station' });
  }
});

app.post('/api/login/citizen', async (req, res) => {
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
app.post('/api/alerts', async (req, res) => {
  const { classification, confidence, signal_path, user_id, location, timestamp } = req.body;
  try {
    await pool.query(
      'INSERT INTO alerts (user_id, location, threat_classification, confidence, signal_path, timestamp, severity) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        user_id || 'Unknown',
        location || 'Unknown',
        classification || 'Silence',
        confidence || 0,
        signal_path || 'Direct',
        timestamp || new Date().toISOString(),
        classification === 'Gunshot' ? 'HIGH' : classification === 'Scream' ? 'MEDIUM' : 'LOW',
      ]
    );
    // Broadcast to Police Dashboard via Socket.io
    io.emit('new_alert', {
      user_id,
      location,
      classification,
      confidence,
      signal_path,
      timestamp,
      severity: classification === 'Gunshot' ? 'HIGH' : classification === 'Scream' ? 'MEDIUM' : 'LOW',
    });
    console.log(`[ALEF] Alert received: ${classification} (${(confidence * 100).toFixed(0)}%) via ${signal_path}`);
    res.status(201).json({ message: 'Alert recorded', classification });
  } catch (error) {
    console.error('[ALEF] DB error:', error);
    // Still broadcast even if DB fails
    io.emit('new_alert', { user_id, location, classification, confidence, signal_path, timestamp });
    res.status(201).json({ message: 'Alert broadcast (DB error)', classification });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// ═══════════════════════════════════════
// PHANTOM MESH — RELAY PACKET API
// ═══════════════════════════════════════
app.post('/api/relay-packet', async (req, res) => {
  const { userId, lastGPS, timestamp, signalPath } = req.body;
  console.log(`[Phantom Mesh] Relay packet received from ${userId} via ${signalPath}`, lastGPS);

  // Broadcast to Police Dashboard
  io.emit('mesh_relay', {
    userId,
    lastGPS,
    timestamp,
    signalPath,
    message: `Relaying Emergency Signal for User ${userId} via Bluetooth Mesh`,
  });

  // Store as alert
  try {
    await pool.query(
      'INSERT INTO alerts (user_id, location, threat_classification, confidence, signal_path, timestamp, severity) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        userId || 'Unknown',
        lastGPS ? `${lastGPS.lat}, ${lastGPS.lng}` : 'Unknown',
        'SOS',
        1.0,
        signalPath || 'Mesh',
        timestamp || new Date().toISOString(),
        'HIGH',
      ]
    );
  } catch (error) {
    console.error('[Phantom Mesh] DB error (non-critical):', error.message);
  }

  res.status(201).json({ message: 'Relay packet received and broadcast to command center' });
});

httpServer.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Socket.io ready for Police Dashboard connections`);
});
