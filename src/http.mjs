const JSON_CONTENT_TYPE = /^application\/(?:[a-z0-9.+-]+\+)?json(?:\s*;|$)/i;

export async function readJsonBody(request, options = {}) {
  const maxBytes = positiveInteger(options.maxBytes, 1_000_000);
  const declaredLength = Number(request.headers?.["content-length"] || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw httpError("حجم الطلب أكبر من المسموح", 413);
  }

  const contentType = String(request.headers?.["content-type"] || "");
  if (contentType && !JSON_CONTENT_TYPE.test(contentType)) {
    throw httpError("نوع محتوى الطلب غير مدعوم؛ استخدم application/json", 415);
  }

  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > maxBytes) throw httpError("حجم الطلب أكبر من المسموح", 413);
    chunks.push(buffer);
  }

  const body = Buffer.concat(chunks).toString("utf8");
  if (!body.trim()) return {};
  try {
    return JSON.parse(body);
  } catch {
    throw httpError("صيغة الطلب غير صالحة", 400);
  }
}

export function configureHttpServer(server, options = {}) {
  server.requestTimeout = positiveInteger(options.requestTimeoutMs, 20_000);
  server.headersTimeout = positiveInteger(options.headersTimeoutMs, 10_000);
  server.keepAliveTimeout = positiveInteger(options.keepAliveTimeoutMs, 5_000);
  server.maxRequestsPerSocket = positiveInteger(options.maxRequestsPerSocket, 1_000);
  return server;
}

export function normalizeRequestId(value, fallback) {
  const candidate = String(value || "").trim();
  if (/^[A-Za-z0-9._:-]{8,80}$/.test(candidate)) return candidate;
  return fallback;
}

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}
