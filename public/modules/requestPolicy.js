const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_RETRY_DELAY_MS = 5_000;

export function parseRetryAfterMs(value, now = Date.now(), maximumMs = DEFAULT_MAX_RETRY_DELAY_MS) {
  const text = String(value || "").trim();
  if (!text) return null;
  const seconds = Number(text);
  const raw = Number.isFinite(seconds) ? seconds * 1_000 : Date.parse(text) - now;
  if (!Number.isFinite(raw)) return null;
  return Math.min(maximumMs, Math.max(0, Math.round(raw)));
}

export function isRetryableStatus(status) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

export async function fetchJsonWithPolicy(url, options = {}) {
  const retries = boundedInteger(options.retries, 0, 3, 0);
  const retryDelayMs = boundedInteger(options.retryDelayMs, 0, DEFAULT_MAX_RETRY_DELAY_MS, 500);
  const timeoutMs = boundedInteger(options.timeoutMs, 1, 60_000, DEFAULT_TIMEOUT_MS);
  const fetchRef = options.fetchRef || globalThis.fetch;
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const abortFromCaller = () => controller.abort(options.signal?.reason);
    options.signal?.addEventListener("abort", abortFromCaller, { once: true });
    const timeout = setTimeout(() => controller.abort(new Error("Request timed out")), timeoutMs);
    let retryAfterMs = retryDelayMs;
    try {
      if (options.signal?.aborted) abortFromCaller();
      const response = await fetchRef(url, { cache: "no-store", signal: controller.signal });
      retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after")) ?? retryDelayMs;
      const text = await response.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); }
        catch { throw createRequestError("وصل رد غير مفهوم من السيرفر. حدث الصفحة وحاول مرة ثانية.", response.status, false); }
      }
      if (!response.ok) {
        throw createRequestError(data.error || `تعذر تحميل البيانات (${response.status})`, response.status, isRetryableStatus(response.status));
      }
      return data;
    } catch (error) {
      if (options.signal?.aborted) throw error;
      lastError = controller.signal.aborted
        ? createRequestError("انتهت مهلة الاتصال بالسيرفر. حاول مرة أخرى.", 0, true)
        : error;
      if (attempt >= retries || lastError?.retryable === false) break;
      await delay(retryAfterMs, options.signal);
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener("abort", abortFromCaller);
    }
  }
  throw lastError;
}

function createRequestError(message, status, retryable) {
  const error = new Error(message);
  error.status = status;
  error.retryable = retryable;
  return error;
}

function boundedInteger(value, minimum, maximum, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, Math.floor(number))) : fallback;
}

function delay(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener("abort", abort);
    const timer = setTimeout(() => { cleanup(); resolve(); }, milliseconds);
    const abort = () => {
      clearTimeout(timer);
      cleanup();
      reject(signal.reason || new DOMException("Aborted", "AbortError"));
    };
    if (signal?.aborted) {
      abort();
      return;
    }
    signal?.addEventListener("abort", abort, { once: true });
  });
}
