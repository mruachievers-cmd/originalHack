import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

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
            ]
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialState, null, 2));
    }
};

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

initDB();

// Citizen Signup
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Guardian Net Neural Server (Portable Mode) running on http://localhost:${PORT}`);
  console.log(`📂 JSON Database located at: ${DB_PATH}`);
});
