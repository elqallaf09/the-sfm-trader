export function createBoundedCache(options = {}) {
  const maxEntries = positiveInteger(options.maxEntries, 250);
  const maxAgeMs = positiveInteger(options.maxAgeMs, 10 * 60_000);
  const entries = new Map();

  function get(key) {
    const entry = entries.get(key);
    if (!entry) return undefined;
    const createdAt = Number(entry.createdAt || 0);
    if (!createdAt || Date.now() - createdAt >= maxAgeMs) {
      entries.delete(key);
      return undefined;
    }
    entries.delete(key);
    entries.set(key, entry);
    return entry;
  }

  function set(key, value) {
    if (entries.has(key)) entries.delete(key);
    entries.set(key, value);
    while (entries.size > maxEntries) {
      entries.delete(entries.keys().next().value);
    }
    return api;
  }

  const api = {
    get,
    set,
    delete: (key) => entries.delete(key),
    clear: () => entries.clear(),
    has: (key) => get(key) !== undefined,
    get size() { return entries.size; }
  };
  return api;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}
