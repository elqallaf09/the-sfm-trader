// Data returned by a provider is not automatically a supported trading decision.
export function nullableNumber(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeSymbolEvidence(item = {}, now = Date.now()) {
  const price = nullableNumber(item.currentPrice);
  const rawConfidence = nullableNumber(item.confidence);
  const provenance = item.dataProvenance || {};
  const observed = Date.parse(provenance.marketTimestamp || "");
  const quality = String(item.dataQuality?.status || item.dataQuality || item.status || "").toLowerCase();
  const ready = price !== null && price > 0 && rawConfidence !== null && rawConfidence >= 0 && rawConfidence <= 100
    && Number.isFinite(observed) && observed <= now + 300000 && provenance.freshness === "current"
    && nullableNumber(item.dataHealth?.coverage) >= 1 && nullableNumber(item.dataHealth?.score) >= 45
    && item.available !== false && !["partial", "stale", "unavailable", "error", "unsupported"].includes(quality);
  const changePercent = nullableNumber(item.changePercent ?? item.regularMarketChangePercent);
  const target = nullableNumber(item.target1 ?? item.targetPrice ?? item.target ?? item.priceTarget);
  return {
    ready, currentPrice: price !== null && price > 0 ? price : null,
    confidence: ready ? rawConfidence : null,
    // Daily change is an observed quote field, never expectedMovePct/projected price.
    changePercent: changePercent !== null && Math.abs(changePercent) <= 500 ? changePercent : null,
    target: ready && target !== null && target > 0 ? target : null,
    observedAt: Number.isFinite(observed) ? provenance.marketTimestamp : "",
    source: typeof item.dataProvider === "string" ? item.dataProvider : provenance.provider || item.dataProvider?.active || "",
  };
}

export function explicitAction(item, ready) {
  if (!ready) return "pending";
  const raw = String(item?.action || item?.recommendationAction || "").toLowerCase();
  if (["buy", "شراء"].includes(raw)) return "buy";
  if (["sell", "بيع"].includes(raw)) return "sell";
  if (["hold", "wait", "انتظار"].includes(raw)) return "hold";
  if (["avoid", "watch", "مراقبة"].includes(raw)) return "watch";
  return "pending";
}

export function validateSymbolDetail(payload, requestedSymbol) {
  const normalize = value => String(value || "").trim().toUpperCase();
  const requested = normalize(requestedSymbol);
  const row = payload?.recommendation;
  if (!requested || !row || payload.error || payload.success === false || payload.available === false
      || normalize(row.symbol) !== requested
      || (payload.asset?.symbol && normalize(payload.asset.symbol) !== requested)) {
    throw new Error("The provider did not return this symbol's detail.");
  }
  return row;
}

export function createStore({ ttlMs = 120000, maxEntries = 48, now = Date.now, onChange = () => {} } = {}) {
    const entries = new Map();
    const idle = () => ({ status: "idle", value: null, error: null });
    function read(key) { return entries.get(key) || idle(); }
    function trim() {
      while (entries.size > maxEntries) {
        const key = entries.keys().next().value;
        const entry = entries.get(key);
        entries.delete(key);
        entry.controller?.abort();
      }
    }
    function load(key, loader, { force = false } = {}) {
      const previous = entries.get(key);
      if (previous?.status === "loading") return previous.promise;
      if (!force && previous && (previous.status === "error" || now() - previous.loadedAt < ttlMs)) return Promise.resolve(previous);
      const controller = new AbortController();
      const entry = { status: "loading", value: previous?.value || null, error: null, controller, loadedAt: 0, promise: null };
      entries.delete(key);
      entries.set(key, entry);
      trim();
      entry.promise = Promise.resolve().then(() => loader(controller.signal)).then(value => {
        if (controller.signal.aborted || entries.get(key) !== entry) return idle();
        Object.assign(entry, { status: "success", value, loadedAt: now() });
        onChange(key, entry);
        return entry;
      }).catch(error => {
        if (controller.signal.aborted || entries.get(key) !== entry) return idle();
        Object.assign(entry, { status: "error", error, loadedAt: now() });
        onChange(key, entry);
        return entry;
      }).finally(() => { entry.controller = null; });
      return entry.promise;
    }
    function cancelPending() {
      entries.forEach((entry, key) => {
        if (entry.status !== "loading") return;
        entries.delete(key); // A late response must not resurrect a closed/replaced drawer.
        entry.controller?.abort();
      });
    }
    return Object.freeze({ read, load, cancelPending });
  }
