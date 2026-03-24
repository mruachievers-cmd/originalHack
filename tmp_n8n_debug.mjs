import fetch from 'node-fetch';

async function checkN8nError() {
  console.log("Logging into n8n...");
  const loginRes = await fetch("http://localhost:5678/rest/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "sai880272@gmail.com",
      password: "Mruh@123"
    })
  });

  if (!loginRes.ok) {
    console.log("Login failed:", loginRes.status);
    return;
  }

  const cookieStr = loginRes.headers.raw()['set-cookie']?.map(c => c.split(';')[0]).join('; ');

  console.log("Fetching latest executions...");
  const execsRes = await fetch("http://localhost:5678/rest/executions?limit=3", {
    headers: { "Cookie": cookieStr }
  });

  const execs = await execsRes.json();
  
  if (!execs.data || execs.data.length === 0) {
    console.log("No executions found.");
    return;
  }

  for (const exec of execs.data) {
    if (exec.status === 'error') {
      console.log(`\n--- FOUND ERROR IN EXECUTION ID: ${exec.id} ---`);
      
      const detailRes = await fetch(`http://localhost:5678/rest/executions/` + exec.id, {
        headers: { "Cookie": cookieStr }
      });
      const detail = await detailRes.json();
      
      const data = detail.data?.resultData?.error;
      if (data) {
        console.log("Failing Node:", data.node?.name || "Unknown");
        console.log("Error Message:", data.message);
        console.log("Description:", data.description);
      } else {
        console.log("Execution marked as error but no specific node error found.");
      }
    } else {
      console.log(`Execution ${exec.id} was successful.`);
    }
  }
}

checkN8nError();
