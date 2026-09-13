export const API_TOKEN_STORAGE_KEY = "the-sfm-trader-api-token";

// Tokens are intentionally session-scoped. Remove any value left by older builds.
try { window.localStorage.removeItem(API_TOKEN_STORAGE_KEY); } catch {}
let volatileToken = "";
let tokenWasSet = false;

export function getApiToken() {
  if (tokenWasSet) return volatileToken;
  try { return window.sessionStorage.getItem(API_TOKEN_STORAGE_KEY) || volatileToken; }
  catch { return volatileToken; }
}

export function setApiToken(value) {
  volatileToken = String(value || "").trim();
  tokenWasSet = true;
  try {
    if (volatileToken) window.sessionStorage.setItem(API_TOKEN_STORAGE_KEY, volatileToken);
    else window.sessionStorage.removeItem(API_TOKEN_STORAGE_KEY);
  } catch {}
}


if (!window.__sfmApiClientInstalled) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const sameOriginApi = url.startsWith("/api/") || url.startsWith(`${window.location.origin}/api/`);
    if (!sameOriginApi) return nativeFetch(input, init);

    const token = getApiToken();
    const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
    if (token) headers.set("authorization", `Bearer ${token}`);
    return nativeFetch(input, { ...init, headers });
  };
  window.__sfmApiClientInstalled = true;
}

export function readStateVersion(response, fallback = 0) {
  const value = Number(response.headers.get("x-state-version") || String(fallback));
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

export function createIdempotencyKey(scope) {
  const random = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${scope}-${random}`.slice(0, 120);
}
