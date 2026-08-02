import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { configureHttpServer, normalizeRequestId, readJsonBody } from "../src/http.mjs";

function request(body, headers = {}) {
  const stream = Readable.from(body === undefined ? [] : [Buffer.from(body)]);
  stream.headers = headers;
  return stream;
}

test("JSON body parser accepts valid JSON and empty bodies", async () => {
  assert.deepEqual(await readJsonBody(request('{"ok":true}', { "content-type": "application/json" })), { ok: true });
  assert.deepEqual(await readJsonBody(request(undefined)), {});
});

test("JSON body parser rejects invalid media types, syntax, and oversized requests", async () => {
  await assert.rejects(readJsonBody(request("text", { "content-type": "text/plain" })), (error) => error.statusCode === 415);
  await assert.rejects(readJsonBody(request('{"ok":true}')), (error) => error.statusCode === 415);
  await assert.rejects(readJsonBody(request("{", { "content-type": "application/json" })), (error) => error.statusCode === 400);
  await assert.rejects(readJsonBody(request("[]", { "content-type": "application/json" })), (error) => error.statusCode === 400);
  await assert.rejects(readJsonBody(request("null", { "content-type": "application/json" })), (error) => error.statusCode === 400);
  await assert.rejects(readJsonBody(request("12345", { "content-type": "application/json", "content-length": "5" }), { maxBytes: 4 }), (error) => error.statusCode === 413);
});

test("HTTP server limits receive safe defaults and explicit overrides", () => {
  const server = {};
  configureHttpServer(server, { requestTimeoutMs: 12_000, maxRequestsPerSocket: 250 });
  assert.equal(server.requestTimeout, 12_000);
  assert.equal(server.headersTimeout, 10_000);
  assert.equal(server.keepAliveTimeout, 5_000);
  assert.equal(server.maxRequestsPerSocket, 250);
});

test("request IDs accept bounded safe values and replace untrusted input", () => {
  assert.equal(normalizeRequestId("client-request_123", "fallback"), "client-request_123");
  assert.equal(normalizeRequestId("short", "fallback"), "fallback");
  assert.equal(normalizeRequestId("x".repeat(81), "fallback"), "fallback");
  assert.equal(normalizeRequestId("request id with spaces", "fallback"), "fallback");
});
