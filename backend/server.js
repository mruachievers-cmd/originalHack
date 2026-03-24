import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
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

// Get all suspects with their descriptors
app.get('/api/suspects', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name, descriptor FROM suspects');
    // Parse descriptor strings back to arrays
    const suspects = rows.map(row => ({
      name: row.name,
      descriptors: [JSON.parse(row.descriptor)]
    }));
    res.json(suspects);
  } catch (error) {
    console.error('DATABASE ERROR DETAILS:', error);
    res.status(500).json({ 
      error: 'Failed to fetch suspects from database',
      details: error.message 
    });
  }
});

// Add a new suspect
app.post('/api/suspects', async (req, res) => {
  const { name, descriptor } = req.body;
  try {
    await pool.query(
      'INSERT INTO suspects (name, descriptor) VALUES (?, ?)',
      [name, JSON.stringify(descriptor)]
    );
    res.status(201).json({ message: 'Suspect added successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to add suspect' });
  }
});

// Signup for Citizens/Officers
app.post('/api/signup', async (req, res) => {
  const { name, unit, email, password } = req.body;
  console.log('SIGNUP REQUEST:', { name, unit, email });
  // For now, just a mock success response
  if (name && email && password) {
    res.status(201).json({ message: 'Registration successful', user: { name, email } });
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});

// Login for Officers
app.post('/api/login/officer', async (req, res) => {
  const { badge_id, station } = req.body;
  // Hardcoded check for the specific officer credentials requested by user
  if (badge_id === 'GN-1234-5678' && station === 'CENTRAL PRECINCT 01') {
    res.json({ success: true, user: { badge_id, station, role: 'officer' } });
  } else {
    res.status(401).json({ error: 'Invalid Badge ID or Station' });
  }
});

// Login for Citizens (Mock implementation)
app.post('/api/login/citizen', async (req, res) => {
  const { email, password } = req.body;
  // Simple mock check
  if (email && password) {
    res.json({ success: true, user: { email, role: 'citizen' } });
  } else {
    res.status(401).json({ error: 'Invalid Email or Password' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
