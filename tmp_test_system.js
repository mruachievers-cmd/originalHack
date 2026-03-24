const fetch = require('node-fetch');

async function testWebhooks() {
  console.log("--- STARTING SYSTEM VERIFICATION ---");

  // 1. Test FIR Webhook Proxy
  console.log("\nTesting FIR Webhook Proxy...");
  try {
    const firRes = await fetch("http://localhost:5000/api/trigger-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        suspectName: "TEST_SUSPECT",
        description: "SYSTEM_VERIFICATION_TEST",
        telegramNum: "12345678"
      })
    });
    console.log(`FIR Status: ${firRes.status} ${firRes.statusText}`);
    const firData = await firRes.json();
    console.log("FIR Response:", firData);
  } catch (e) {
    console.error("FIR Test Failed:", e.message);
  }

  // 2. Test SOS Webhook Proxy
  console.log("\nTesting SOS Webhook Proxy...");
  try {
    const sosRes = await fetch("http://localhost:5000/api/sos-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "TEST_USER",
        location: "TEST_LOCATION",
        status: "VERIFICATION_ACTIVE"
      })
    });
    console.log(`SOS Status: ${sosRes.status} ${sosRes.statusText}`);
    const sosData = await sosRes.json();
    console.log("SOS Response:", sosData);
  } catch (e) {
    console.error("SOS Test Failed:", e.message);
  }

  console.log("\n--- VERIFICATION COMPLETE ---");
}

testWebhooks();
