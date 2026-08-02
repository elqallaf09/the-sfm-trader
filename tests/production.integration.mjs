import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const token = "integration-private-token-123456789";
const port = await getFreePort();
const baseUrl = `http://127.0.0.1:${port}`;
const dataDir = await mkdtemp(path.join(tmpdir(), "sfm-production-integration-"));
const output = [];
const child = spawn(process.execPath, ["server.mjs"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(port),
    SFM_AUTH_TOKENS: JSON.stringify({ [token]: "integration-user" }),
    SFM_ALLOWED_ORIGINS: "https://trader.the-sfm.com",
    SFM_STORAGE_DRIVER: "file",
    SFM_DATA_DIR: dataDir,
    OLLAMA_ENABLED: "false"
  },
  stdio: ["ignore", "pipe", "pipe", "ipc"]
});
child.stdout.on("data", (chunk) => output.push(chunk.toString()));
child.stderr.on("data", (chunk) => output.push(chunk.toString()));

try {
  await waitForHealth();

  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).authentication, "required");

  const readiness = await fetch(`${baseUrl}/api/ready`);
  assert.equal(readiness.status, 200);
  const readinessPayload = await readiness.json();
  assert.equal(readinessPayload.status, "ready");
  assert.equal("lastError" in readinessPayload.providerHealth, false);

  const unsafeRequestId = await fetch(`${baseUrl}/api/health`, { headers: { "x-request-id": "not safe spaces" } });
  assert.notEqual(unsafeRequestId.headers.get("x-request-id"), "not safe spaces");

  const unauthorized = await fetch(`${baseUrl}/api/followed-trades`);
  assert.equal(unauthorized.status, 401);

  const unauthorizedMetrics = await fetch(`${baseUrl}/api/metrics`);
  assert.equal(unauthorizedMetrics.status, 401);

  const authorized = await fetch(`${baseUrl}/api/followed-trades`, {
    headers: { authorization: `Bearer ${token}` }
  });
  assert.equal(authorized.status, 200);
  assert.equal(authorized.headers.get("x-state-version"), "0");

  const mutationHeaders = {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "if-match": '"0"',
    "idempotency-key": "integration-request-0001"
  };
  const statePayload = JSON.stringify({ followedTradeKeys: ["AAPL:buy"], followedEntries: [] });
  const createdState = await fetch(`${baseUrl}/api/followed-trades`, { method: "POST", headers: mutationHeaders, body: statePayload });
  assert.equal(createdState.status, 200);
  assert.equal(createdState.headers.get("x-state-version"), "1");
  const replayedState = await fetch(`${baseUrl}/api/followed-trades`, { method: "POST", headers: mutationHeaders, body: statePayload });
  assert.equal(replayedState.status, 200);
  assert.equal(replayedState.headers.get("idempotency-replayed"), "true");
  const conflictState = await fetch(`${baseUrl}/api/followed-trades`, {
    method: "POST",
    headers: { ...mutationHeaders, "idempotency-key": "integration-request-0002" },
    body: JSON.stringify({ followedTradeKeys: ["MSFT:buy"], followedEntries: [] })
  });
  assert.equal(conflictState.status, 409);

  const vital = await fetch(`${baseUrl}/api/telemetry/web-vitals`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ name: "LCP", value: 1800, rating: "good", page: "/" })
  });
  assert.equal(vital.status, 202);
  const metrics = await fetch(`${baseUrl}/api/metrics`, { headers: { authorization: `Bearer ${token}` } });
  assert.equal(metrics.status, 200);
  assert.equal((await metrics.json()).webVitals[0].name, "LCP");

  const blockedOrigin = await fetch(`${baseUrl}/api/markets`, {
    headers: { origin: "https://attacker.example" }
  });
  assert.equal(blockedOrigin.status, 403);

  const invalidMedia = await fetch(`${baseUrl}/api/followed-trades`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "text/plain" },
    body: "not-json"
  });
  assert.equal(invalidMedia.status, 415);

  const html = await fetch(`${baseUrl}/`);
  assert.equal(html.status, 200);
  assert.match(html.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);
  assert.match(html.headers.get("strict-transport-security") || "", /max-age/);
  const etag = html.headers.get("etag");
  assert.ok(etag);

  const unchanged = await fetch(`${baseUrl}/`, { headers: { "if-none-match": etag } });
  assert.equal(unchanged.status, 304);
  assert.match(unchanged.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);

  const head = await rawRequest(`${baseUrl}/`, {}, "HEAD");
  assert.equal(head.statusCode, 200);
  assert.equal(head.bodyBytes, 0);

  const rejectedStaticMutation = await rawRequest(`${baseUrl}/`, { "content-type": "text/plain" }, "POST");
  assert.equal(rejectedStaticMutation.statusCode, 405);
  assert.equal(rejectedStaticMutation.headers.allow, "GET, HEAD");

  const compressed = await rawRequest(`${baseUrl}/api/markets`, { "accept-encoding": "br" });
  assert.equal(compressed.statusCode, 200);
  assert.equal(compressed.headers["content-encoding"], "br");

  const exit = waitForExit(child, 12_000);
  child.send({ type: "shutdown" });
  const result = await exit;
  assert.equal(result.code, 0);
  await rm(dataDir, { recursive: true, force: true });
  console.log("Production integration passed.");
} catch (error) {
  if (child.exitCode === null) child.kill("SIGKILL");
  await rm(dataDir, { recursive: true, force: true }).catch(() => {});
  console.error(output.join(""));
  throw error;
}

async function waitForHealth() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Server exited early with ${child.exitCode}`);
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Production server did not become healthy");
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const socket = net.createServer();
    socket.once("error", reject);
    socket.listen(0, "127.0.0.1", () => {
      const address = socket.address();
      socket.close((error) => error ? reject(error) : resolve(address.port));
    });
  });
}

function waitForExit(processHandle, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Server did not shut down gracefully")), timeoutMs);
    processHandle.once("exit", (code, signal) => {
      clearTimeout(timeout);
      resolve({ code, signal });
    });
  });
}

function rawRequest(url, headers, method = "GET") {
  return new Promise(async (resolve, reject) => {
    const { request } = await import("node:http");
    const operation = request(url, { headers, method }, (response) => {
      let bodyBytes = 0;
      response.on("data", (chunk) => { bodyBytes += chunk.length; });
      response.once("end", () => resolve({ statusCode: response.statusCode, headers: response.headers, bodyBytes }));
    });
    operation.once("error", reject);
    operation.end();
  });
}
