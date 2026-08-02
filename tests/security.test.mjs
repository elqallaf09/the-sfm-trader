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

test("development permits only same-origin browser API requests without an allowlist", () => {
  const security = createSecurity({ production: false });
  const local = request({ origin: "http://127.0.0.1:4173", host: "127.0.0.1:4173" });
  const crossOrigin = request({ origin: "https://untrusted.example", host: "127.0.0.1:4173" });

  assert.equal(security.corsOrigin(local), "http://127.0.0.1:4173");
  assert.equal(security.corsOrigin(crossOrigin), "");
});

test("rate limiter separates scopes and blocks excess calls", () => {
  const security = createSecurity({ production: false, rateLimitMax: 2, analysisRateLimitMax: 1 });
  assert.equal(security.checkRateLimit(request(), "analysis").allowed, true);
  assert.equal(security.checkRateLimit(request(), "analysis").allowed, false);
  assert.equal(security.checkRateLimit(request(), "default").allowed, true);
});

test("rate limiter ignores spoofed forwarding headers unless a trusted proxy is configured", () => {
  const direct = createSecurity({ production: false, rateLimitMax: 1, trustProxy: false });
  assert.equal(direct.checkRateLimit(request({ "x-forwarded-for": "198.51.100.1" }), "default").allowed, true);
  assert.equal(direct.checkRateLimit(request({ "x-forwarded-for": "198.51.100.2" }), "default").allowed, false);

  const proxied = createSecurity({ production: false, rateLimitMax: 1, trustProxy: true });
  assert.equal(proxied.checkRateLimit(request({ "x-forwarded-for": "198.51.100.1" }), "default").allowed, true);
  assert.equal(proxied.checkRateLimit(request({ "x-forwarded-for": "198.51.100.2" }), "default").allowed, true);
});

test("rate limiter isolates authenticated users sharing one network address", () => {
  const security = createSecurity({
    production: true,
    rateLimitMax: 1,
    authTokens: {
      "first-user-private-token-1234": "first-user",
      "second-user-private-token-123": "second-user"
    }
  });
  const first = request({ authorization: "Bearer first-user-private-token-1234" }, "203.0.113.10");
  const second = request({ authorization: "Bearer second-user-private-token-123" }, "203.0.113.10");

  assert.equal(security.checkRateLimit(first).allowed, true);
  assert.equal(security.checkRateLimit(first).allowed, false);
  assert.equal(security.checkRateLimit(second).allowed, true);
});

test("security headers include browser hardening", () => {
  const headers = securityHeaders("text/html", { html: true, hsts: true });
  assert.match(headers["content-security-policy"], /frame-ancestors 'none'/);
  assert.match(headers["content-security-policy"], /font-src 'self' https:\/\/fonts\.gstatic\.com/);
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.match(headers["strict-transport-security"], /max-age/);
});

test("bearer parser is strict", () => {
  assert.equal(readBearerToken("Bearer abc"), "abc");
  assert.equal(readBearerToken("Basic abc"), "");
});
