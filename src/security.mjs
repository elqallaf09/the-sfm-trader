import { createHash } from "node:crypto";

const DEFAULT_WINDOW_MS = 60_000;

export function createSecurity(options = {}) {
  const production = options.production ?? process.env.NODE_ENV === "production";
  const tokenMap = parseTokenMap(options.authTokens ?? process.env.SFM_AUTH_TOKENS);
  const allowDevAnonymous = options.allowDevAnonymous ?? !production;
  const allowedOrigins = new Set(parseList(options.allowedOrigins ?? process.env.SFM_ALLOWED_ORIGINS));
  const rateLimitMax = positiveNumber(options.rateLimitMax ?? process.env.SFM_RATE_LIMIT_MAX, 120);
  const analysisRateLimitMax = positiveNumber(options.analysisRateLimitMax ?? process.env.SFM_ANALYSIS_RATE_LIMIT_MAX, 30);
  const buckets = new Map();
  if (production && tokenMap.size === 0) {
    throw new Error("SFM_AUTH_TOKENS must configure at least one production user");
  }

  function authenticate(request) {
    const token = readBearerToken(request.headers.authorization);
    const userId = token ? tokenMap.get(hashToken(token)) : null;
    if (userId) return { userId, authenticated: true };
    if (allowDevAnonymous) return { userId: "local-development", authenticated: false };
    return null;
  }

  function checkRateLimit(request, scope = "default") {
    const now = Date.now();
    const key = `${scope}:${clientAddress(request)}`;
    const max = scope === "analysis" ? analysisRateLimitMax : rateLimitMax;
    const current = buckets.get(key);
    if (!current || now >= current.resetAt) {
      const next = { count: 1, resetAt: now + DEFAULT_WINDOW_MS };
      buckets.set(key, next);
      return { allowed: true, remaining: max - 1, resetAt: next.resetAt };
    }
    current.count += 1;
    return { allowed: current.count <= max, remaining: Math.max(0, max - current.count), resetAt: current.resetAt };
  }

  function corsOrigin(request) {
    const origin = String(request.headers.origin || "");
    if (!origin) return "";
    if (allowedOrigins.has(origin)) return origin;
    return "";
  }

  return { authenticate, checkRateLimit, corsOrigin, production, configuredUsers: tokenMap.size };
}

export function securityHeaders(contentType, options = {}) {
  const headers = {
    "content-type": contentType,
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), geolocation=(), payment=(), usb=()",
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-resource-policy": "same-origin"
  };
  if (options.html) {
    headers["content-security-policy"] = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
  }
  if (options.hsts) headers["strict-transport-security"] = "max-age=31536000; includeSubDomains";
  return headers;
}

export function readBearerToken(value = "") {
  const match = /^Bearer\s+(.+)$/i.exec(String(value).trim());
  return match?.[1]?.trim() || "";
}

function parseTokenMap(raw) {
  if (!raw) return new Map();
  let parsed;
  try { parsed = typeof raw === "string" ? JSON.parse(raw) : raw; } catch { throw new Error("SFM_AUTH_TOKENS must be valid JSON"); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("SFM_AUTH_TOKENS must be an object mapping tokens to user IDs");
  const entries = Object.entries(parsed).filter(([token, userId]) => token.length >= 24 && /^[a-zA-Z0-9_-]{1,80}$/.test(String(userId)));
  return new Map(entries.map(([token, userId]) => [hashToken(token), String(userId)]));
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function parseList(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function clientAddress(request) {
  const forwarded = String(request.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || request.socket?.remoteAddress || "unknown";
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}
