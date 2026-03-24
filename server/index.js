import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');
const UPLOADS_PATH = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_PATH)) fs.mkdirSync(UPLOADS_PATH);
app.use('/uploads', express.static(UPLOADS_PATH));

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_PATH),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Root Health Check Route
app.get('/', (req, res) => {
    res.send('✅ Guardian Net Neural Backend is Operational');
});

// Initialize local JSON database
const initDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        const initialState = {
            citizens: [],
            officers: [
                { badge_id: "GN-1234-5678", station: "CENTRAL PRECINCT 01" }
            ],
            firs: [],
            sos_alerts: [],
            evidence: [],
            tips: []
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialState, null, 2));
    }
};

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

initDB();

// --- NEW DATA ROUTES ---

// Submit FIR
app.post('/api/firs', (req, res) => {
  const { type, location, reporter, description, phone } = req.body;
  const db = getDB();
  const id = `FIR-${Date.now().toString().slice(-4)}`;
  const newFIR = { id, type, location, reporter, description, phone, status: "Active", created_at: new Date() };
  db.firs.push(newFIR);
  saveDB(db);
  res.json({ success: true, fir: newFIR });
});

// Get all FIRs
app.get('/api/firs', (req, res) => {
  res.json(getDB().firs || []);
});

// Submit SOS
app.post('/api/sos', (req, res) => {
  const { user, location, coordinates } = req.body;
  const db = getDB();
  const id = `SOS-${Date.now().toString().slice(-4)}`;
  const newSOS = { id, user, location, coordinates, status: "Critical", created_at: new Date() };
  db.sos_alerts.push(newSOS);
  saveDB(db);
  res.json({ success: true, sos: newSOS });
});

// Get SOS alerts
app.get('/api/sos', (req, res) => {
  res.json(getDB().sos_alerts || []);
});

// Submit Evidence (Multipart)
app.post('/api/evidence', upload.single('file'), (req, res) => {
  const { type, activityType, location, coordinates, userId } = req.body;
  const db = getDB();
  
  let evidenceUrl = req.body.evidenceUrl;
  if (req.file) {
    evidenceUrl = `http://localhost:5001/uploads/${req.file.filename}`;
  }

  const newEvidence = { 
    id: Date.now(), 
    type, 
    activityType, 
    location, 
    coordinates: coordinates ? JSON.parse(coordinates) : null, 
    userId, 
    evidenceUrl, 
    timestamp: new Date() 
  };
  
  db.evidence.push(newEvidence);
  saveDB(db);
  res.json({ success: true, evidence: newEvidence });
});

// Get Evidence
app.get('/api/evidence', (req, res) => {
  res.json(getDB().evidence || []);
});

// --- ANONYMOUS TIP ROUTES ---

// Submit Tip
app.post('/api/tips', (req, res) => {
  const { category, location, description } = req.body;
  const db = getDB();
  const id = `TIP-${Date.now().toString().slice(-4)}`;
  const newTip = { id, category, location, description, status: "Pending", timestamp: new Date() };
  if (!db.tips) db.tips = [];
  db.tips.push(newTip);
  saveDB(db);
  res.json({ success: true, tip: newTip });
});

// Get Tips
app.get('/api/tips', (req, res) => {
  res.json(getDB().tips || []);
});

// Update Tip Status
app.patch('/api/tips/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDB();
  const tip = db.tips.find(t => t.id === id);
  if (tip) {
    tip.status = status;
    saveDB(db);
    res.json({ success: true, tip });
  } else {
    res.status(404).json({ error: "Tip not found" });
  }
});

// --- EXISTING AUTH ROUTES ---
app.post('/api/signup', (req, res) => {
  const { name, email, unit, password } = req.body;
  const db = getDB();
  
  if (db.citizens.some(u => u.email === email)) {
      return res.status(400).json({ error: 'This email is already registered in the neural grid.' });
  }

  const newCitizen = { id: Date.now(), name, email, unit, password, created_at: new Date() };
  db.citizens.push(newCitizen);
  saveDB(db);
  res.json({ success: true, user: newCitizen });
});

// Citizen Login
app.post('/api/login/citizen', (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = db.citizens.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: 'AUTHENTICATION DENIED: Invalid citizen credentials or account not found.' });
  }
});

// Officer Login
app.post('/api/login/officer', (req, res) => {
  const { badge_id, station } = req.body;
  const db = getDB();
  const officer = db.officers.find(o => o.badge_id === badge_id && o.station === station);
  
  if (officer) {
    res.json({ success: true, officer });
  } else {
    res.status(401).json({ error: 'ACCESS DENIED: Credentials not found in official registry.' });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Guardian Net Neural Backend running on http://localhost:${PORT}`);
  console.log(`📂 JSON Database located at: ${DB_PATH}`);
});
