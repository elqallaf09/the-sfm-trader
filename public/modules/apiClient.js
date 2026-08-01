export const API_TOKEN_STORAGE_KEY = "the-sfm-trader-api-token";

// Tokens are intentionally session-scoped. Remove any value left by older builds.
window.localStorage.removeItem(API_TOKEN_STORAGE_KEY);

if (!window.__sfmApiClientInstalled) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url || "";
    const sameOriginApi = url.startsWith("/api/") || url.startsWith(`${window.location.origin}/api/`);
    if (!sameOriginApi) return nativeFetch(input, init);

    const token = window.sessionStorage.getItem(API_TOKEN_STORAGE_KEY) || "";
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
