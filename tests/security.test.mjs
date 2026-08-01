import test from "node:test";
import assert from "node:assert/strict";
import { createSecurity, readBearerToken, securityHeaders } from "../src/security.mjs";

function request(headers = {}, address = "127.0.0.1") {
  return { headers, socket: { remoteAddress: address } };
}

test("production rejects missing and invalid bearer tokens", () => {
  const security = createSecurity({ production: true, authTokens: { "a-very-long-private-token-123": "mohammed" } });
  assert.equal(security.authenticate(request()), null);
  assert.equal(security.authenticate(request({ authorization: "Bearer wrong" })), null);
  assert.deepEqual(security.authenticate(request({ authorization: "Bearer a-very-long-private-token-123" })), { userId: "mohammed", authenticated: true });
});

test("production refuses to start without a configured user", () => {
  assert.throws(() => createSecurity({ production: true, authTokens: {} }), /SFM_AUTH_TOKENS/);
});

test("development has an explicit isolated local identity", () => {
  const security = createSecurity({ production: false });
  assert.deepEqual(security.authenticate(request()), { userId: "local-development", authenticated: false });
});

test("rate limiter separates scopes and blocks excess calls", () => {
  const security = createSecurity({ production: false, rateLimitMax: 2, analysisRateLimitMax: 1 });
  assert.equal(security.checkRateLimit(request(), "analysis").allowed, true);
  assert.equal(security.checkRateLimit(request(), "analysis").allowed, false);
  assert.equal(security.checkRateLimit(request(), "default").allowed, true);
});

test("security headers include browser hardening", () => {
  const headers = securityHeaders("text/html", { html: true, hsts: true });
  assert.match(headers["content-security-policy"], /frame-ancestors 'none'/);
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.match(headers["strict-transport-security"], /max-age/);
});

test("bearer parser is strict", () => {
  assert.equal(readBearerToken("Bearer abc"), "abc");
  assert.equal(readBearerToken("Basic abc"), "");
});
