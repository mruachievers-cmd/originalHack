# 🛡️ GuardianNet: Next-Gen Smart Police Assistant

GuardianNet is a premium, high-contrast "White & Green" SaaS ecosystem designed for modern smart cities. It streamlines the lifecycle of FIR tracking, biometric AI scanning, and emergency response into a unified neural interface.

## 🚀 Key Features

*   **Neural AI Bio-Scanner**: Real-time biometric identification and suspect tagging using `face-api.js`.
*   **Dynamic FIR Triage**: Automated priority classification (High/Medium/Low) for incoming complaints using semantic keyword analysis.
*   **Sentinel SOS Protocol**: Instant emergency broadcasting with integrated GPS telemetry and a direct "Helpline 200" support bridge.
*   **Police Command Center**: Advanced dashboard for officer assignments, case resolution, and real-time incident monitoring.
*   **Neural Webhook Bridge**: Automated dispatch of incident data to external automation hubs (ngrok/n8n/IFTTT).

## 🛠️ Technology Stack

*   **Frontend**: React + TypeScript + Vite + TailwindCSS + Framer Motion.
*   **Intelligence**: `face-api.js` (TensorFlow.js backend).
*   **Backend**: Node.js + Express.
*   **Storage**: Local JSON Database with automatic persistence.

---

## 🏗️ Execution Guide

To deploy the GuardianNet grid locally, follow these steps:

### 1. Initialize Neural Backend
The backend manages the database and the automated webhook dispatcher.

```powershell
# Navigate to northern server hub
cd server
# Install telemetry dependencies (if not already present)
npm install
# Start the neural engine
node index.js
```
*   **Port**: `5000`
*   **Data Hub**: `server/db.json`

### 2. Launch Local Interface
The frontend provides the interactive command surface.

```powershell
# In the project root directory
npm install
# Start the Vite development system
npm run dev
```
*   **Primary Port**: `8080` (or as specified by Vite)
*   **Local Access**: `http://localhost:8080`

---

## 🔑 Authentication Grid

### Officer Command Center
Use these credentials to access the Police Dashboard and AI Scanner:
*   **Badge ID**: `GN-1234-5678`
*   **Assigned Station**: `CENTRAL PRECINCT 01`

### Citizen Portal
Register a new account or log in as a verified citizen to file FIRs and track active investigations.

---

## 📡 Automation & Webhooks
GuardianNet is currently configured to broadcast all **FIR and SOS events** to the following external neural hub:
*   **Target URL**: `https://uninstructed-sharan-uncorpulent.ngrok-free.dev/webhook-test/476a8980-a1ec-4e11-8f7d-b4bb4a51d2dd`

To change the automation target, update the `targetUrl` in `server/index.js`.

---

## 🛡️ Security Protocol
*   All telemetry data is stored locally in the JSON grid.
*   The system uses the high-speed **TinyFaceDetector** for real-time biometric analysis.
*   The "Sentinal SOS" protocol uses the `tel:200` protocol for direct emergency dialing.

**© 2026 GuardianNet Neural Grid | Secured at the Edge**
