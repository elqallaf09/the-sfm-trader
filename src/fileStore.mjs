import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export function createUserFileStore(rootDir) {
  const queues = new Map();

  async function read(userId, namespace, fallback = {}) {
    const filePath = resolvePath(rootDir, userId, namespace);
    try { return JSON.parse(await readFile(filePath, "utf8")); } catch { return structuredClone(fallback); }
  }

  async function write(userId, namespace, value) {
    const key = `${userId}:${namespace}`;
    const previous = queues.get(key) || Promise.resolve();
    const operation = previous.then(async () => {
      const filePath = resolvePath(rootDir, userId, namespace);
      await mkdir(path.dirname(filePath), { recursive: true });
      const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
      await rename(temporaryPath, filePath);
      return value;
    });
    const queued = operation.catch(() => {});
    queues.set(key, queued);
    queued.finally(() => {
      if (queues.get(key) === queued) queues.delete(key);
    });
    return operation;
  }

  return { read, write };
}

function resolvePath(rootDir, userId, namespace) {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(userId)) throw new Error("Invalid user ID");
  if (!/^[a-zA-Z0-9_-]{1,40}$/.test(namespace)) throw new Error("Invalid namespace");
  return path.join(rootDir, userId, `${namespace}.json`);
}
