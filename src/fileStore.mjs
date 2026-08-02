import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

export function createUserFileStore(rootDir) {
  const queues = new Map();

  async function read(userId, namespace, fallback = {}) {
    return (await readVersioned(userId, namespace, fallback)).value;
  }

  async function readVersioned(userId, namespace, fallback = {}) {
    const parsed = await readDocument(resolvePath(rootDir, userId, namespace));
    if (parsed === null) return { value: structuredClone(fallback), version: 0, updatedAt: null };
    if (parsed?._sfmState === 1) return { value: parsed.value, version: Number(parsed.version || 0), updatedAt: parsed.updatedAt || null };
    return { value: parsed, version: 0, updatedAt: null };
  }

  async function write(userId, namespace, value) {
    return (await writeVersioned(userId, namespace, value)).value;
  }

  async function writeVersioned(userId, namespace, value, options = {}) {
    const key = `${userId}:${namespace}`;
    const previous = queues.get(key) || Promise.resolve();
    const operation = previous.then(async () => {
      const filePath = resolvePath(rootDir, userId, namespace);
      const existing = await readDocument(filePath);
      const document = existing?._sfmState === 1
        ? existing
        : { _sfmState: 1, version: 0, value: existing ?? {}, updatedAt: null, idempotency: {} };
      const currentVersion = Number(document.version || 0);
      const idempotencyKey = normalizeIdempotencyKey(options.idempotencyKey);
      const requestHash = crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
      const replay = idempotencyKey ? document.idempotency?.[idempotencyKey] : null;
      if (replay) {
        if (replay.requestHash !== requestHash) throw conflict("Idempotency key was already used with different content");
        return { value: replay.value, version: replay.version, replayed: true, updatedAt: document.updatedAt };
      }
      if (options.expectedVersion !== undefined && Number(options.expectedVersion) !== currentVersion) {
        throw conflict(`State version mismatch; expected ${options.expectedVersion}, current ${currentVersion}`);
      }
      const nextVersion = currentVersion + 1;
      const updatedAt = new Date().toISOString();
      const idempotency = pruneIdempotency(document.idempotency);
      if (idempotencyKey) idempotency[idempotencyKey] = { requestHash, version: nextVersion, value, createdAt: updatedAt };
      const nextDocument = { _sfmState: 1, version: nextVersion, value, updatedAt, idempotency };
      await mkdir(path.dirname(filePath), { recursive: true });
      const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(temporaryPath, `${JSON.stringify(nextDocument, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
      await rename(temporaryPath, filePath);
      return { value, version: nextVersion, replayed: false, updatedAt };
    });
    const queued = operation.catch(() => {});
    queues.set(key, queued);
    queued.finally(() => {
      if (queues.get(key) === queued) queues.delete(key);
    });
    return operation;
  }

  return {
    driver: "file",
    read,
    readVersioned,
    write,
    writeVersioned,
    async health() { await mkdir(rootDir, { recursive: true }); return { ok: true, driver: "file" }; },
    async close() {}
  };
}

async function readDocument(filePath) {
  try { return JSON.parse(await readFile(filePath, "utf8")); } catch (error) {
    if (error.code === "ENOENT") return null;
    if (error instanceof SyntaxError) {
      const corrupted = new Error("Stored user state is corrupted and was not modified");
      corrupted.code = "SFM_STATE_CORRUPTED";
      corrupted.cause = error;
      throw corrupted;
    }
    throw error;
  }
}

function resolvePath(rootDir, userId, namespace) {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(userId)) throw new Error("Invalid user ID");
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(namespace)) throw new Error("Invalid namespace");
  return path.join(rootDir, userId, `${namespace}.json`);
}

function normalizeIdempotencyKey(value) {
  const key = String(value || "").trim();
  if (!key) return "";
  if (key.length < 8 || key.length > 120) throw new Error("Invalid idempotency key");
  return key;
}

function pruneIdempotency(entries = {}) {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return Object.fromEntries(Object.entries(entries)
    .filter(([, entry]) => new Date(entry.createdAt || 0).getTime() > cutoff)
    .slice(-100));
}

function conflict(message) {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
}
