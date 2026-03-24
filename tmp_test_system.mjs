async function testWebhooks() {
  console.log("--- STARTING SYSTEM VERIFICATION (ESM) ---");

  // 1. Test FIR Webhook Proxy
  console.log("\nTesting FIR Webhook Proxy...");
  try {
    const firRes = await fetch("http://localhost:5000/api/trigger-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        suspectName: "TEST_SUSPECT_ESM",
        description: "SYSTEM_VERIFICATION_TEST_ESM",
        telegramNum: "99988877"
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
        user: "TEST_USER_ESM",
        location: "TEST_LOCATION_ESM",
        status: "VERIFICATION_ACTIVE_ESM"
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
