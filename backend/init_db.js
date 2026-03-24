import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    const dbName = process.env.DB_NAME || 'criminal_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.query(`USE ${dbName}`);
    
    // Suspects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS suspects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        descriptor TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // ═══════════════════════════════════════
    // ALEF & Phantom Mesh: Alerts table
    // ═══════════════════════════════════════
    await connection.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        location TEXT,
        threat_classification ENUM('Scream', 'Gunshot', 'Silence', 'SOS') NOT NULL DEFAULT 'Silence',
        confidence FLOAT DEFAULT 0,
        signal_path ENUM('Direct', 'Mesh') NOT NULL DEFAULT 'Direct',
        severity ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'LOW',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("Database and all tables initialized successfully.");
    console.log("  ✓ suspects table");
    console.log("  ✓ alerts table (ALEF + Phantom Mesh)");

  } catch (error) {
    console.error("Initialization error:", error);
  } finally {
    await connection.end();
  }
}

initDB();
