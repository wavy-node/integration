/**
 * Script to test your integration locally.
 * Simulates the calls WavyNode makes to your server.
 *
 * Usage: bun run test-integration.ts
 */
import { createHmacSignature, formCanonicalMessage } from "@wavynode/utils";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
const SECRET = process.env.SECRET;

async function testGetUser(userId: string) {
  console.log(`\n--- Testing GET /users/${userId} ---`);
  const timestamp = Date.now();
  const path = `/users/${userId}`;

  const canonicalMessage = formCanonicalMessage({
    method: "GET",
    path,
    body: {},
    timestamp,
  });

  const signature = createHmacSignature(canonicalMessage, SECRET);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "x-wavynode-hmac": signature,
      "x-wavynode-timestamp": timestamp.toString(),
    },
  });

  console.log(`Status: ${res.status} ${res.statusText}`);
  const data = await res.json();
  console.log("Response:", JSON.stringify(data, null, 2));
  return res.status === 200;
}

async function testWebhook() {
  console.log(`\n--- Testing POST /webhook ---`);
  const timestamp = Date.now();
  const path = "/webhook";

  const body = {
    type: "notification" as const,
    data: {
      id: 1,
      projectId: 1,
      chainId: 42161,
      address: {
        id: 543,
        userId: "user-123",
        address: "0x1234567890abcdef1234567890abcdef12345678",
        description: "Test address",
      },
      txHash: "0xabc123def456",
      timestamp: new Date().toISOString(),
      amount: { value: 1000000000000000000, usd: 3000 },
      token: { name: "Ethereum", symbol: "ETH", decimals: 18, address: null },
      inflictedLaws: [
        {
          name: "Notificación a la UIF",
          description: "Operación supera 210 UMAs",
          risk: "warn" as const,
          country: "México",
          countryCode: "MX",
        },
      ],
    },
  };

  const canonicalMessage = formCanonicalMessage({
    method: "POST",
    path,
    body,
    timestamp,
  });

  const signature = createHmacSignature(canonicalMessage, SECRET);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-wavynode-hmac": signature,
      "x-wavynode-timestamp": timestamp.toString(),
    },
    body: JSON.stringify(body),
  });

  console.log(`Status: ${res.status} ${res.statusText}`);
  const data = await res.text();
  console.log("Response:", data);
  return res.status === 200;
}

async function testInvalidSignature() {
  console.log(`\n--- Testing invalid signature (should fail with 401) ---`);
  const res = await fetch(`${BASE_URL}/users/test-user`, {
    method: "GET",
    headers: {
      "x-wavynode-hmac": "invalid-signature",
      "x-wavynode-timestamp": Date.now().toString(),
    },
  });

  console.log(`Status: ${res.status} ${res.statusText}`);
  return res.status === 401;
}

async function main() {
  console.log("=== WavyNode Integration Test ===");
  console.log(`Server: ${BASE_URL}`);

  if (!SECRET) {
    console.error("SECRET not set. Add it to your .env file.");
    process.exit(1);
  }

  console.log(`Secret: ${SECRET.substring(0, 8)}...`);

  let passed = 0;
  let failed = 0;

  if (await testGetUser("user-123")) {
    console.log("PASS: GET /users");
    passed++;
  } else {
    console.log("FAIL: GET /users");
    failed++;
  }

  if (await testWebhook()) {
    console.log("PASS: POST /webhook");
    passed++;
  } else {
    console.log("FAIL: POST /webhook");
    failed++;
  }

  if (await testInvalidSignature()) {
    console.log("PASS: Invalid signature correctly rejected");
    passed++;
  } else {
    console.log("FAIL: Invalid signature test");
    failed++;
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
}

main().catch(console.error);
