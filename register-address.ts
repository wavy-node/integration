/**
 * Register an address in your WavyNode project.
 * Usage: bun run register-address.ts
 */

const API_BASE = "https://api.wavynode.com/v1";
const API_KEY = process.env.WAVYNODE_API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;

async function registerAddress() {
  if (!API_KEY || !PROJECT_ID) {
    console.error("WAVYNODE_API_KEY and PROJECT_ID must be set in your .env file.");
    process.exit(1);
  }

  const res = await fetch(`${API_BASE}/projects/${PROJECT_ID}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      address: "0x2c63bbbcc4b40ca0f149717195fea66a8f1a0395",
      description: "Demo address - Maria",
      foreign_user_id: "user-123",
    }),
  });

  console.log(`Status: ${res.status} ${res.statusText}`);
  const data = await res.json();
  console.log("Response:", JSON.stringify(data, null, 2));
}

registerAddress().catch(console.error);
