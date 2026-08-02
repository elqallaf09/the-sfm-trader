import crypto from "node:crypto";
import pg from "pg";

export function createPostgresStateStore(options = {}) {
  const pool = options.pool || new pg.Pool({
    connectionString: options.connectionString || process.env.DATABASE_URL,
    max: positiveInteger(options.maxConnections ?? process.env.SFM_DB_POOL_MAX, 10),
    idleTimeoutMillis: positiveInteger(options.idleTimeoutMs ?? process.env.SFM_DB_IDLE_TIMEOUT_MS, 30_000),
    connectionTimeoutMillis: positiveInteger(options.connectionTimeoutMs ?? process.env.SFM_DB_CONNECT_TIMEOUT_MS, 5_000),
    ssl: sslOptions(options.sslMode ?? process.env.SFM_DB_SSL_MODE)
  });

  return {
    driver: "postgres",
    async read(userId, namespace, fallback = {}) {
      return (await this.readVersioned(userId, namespace, fallback)).value;
    },
    async readVersioned(userId, namespace, fallback = {}) {
      validateScope(userId, namespace);
      const result = await pool.query(
        "SELECT version, payload, updated_at FROM sfm_user_state WHERE user_id = $1 AND namespace = $2",
        [userId, namespace]
      );
      if (!result.rowCount) return { value: structuredClone(fallback), version: 0, updatedAt: null };
      const row = result.rows[0];
      return { value: row.payload, version: Number(row.version), updatedAt: row.updated_at?.toISOString?.() || String(row.updated_at) };
    },
    async write(userId, namespace, value) {
      return (await this.writeVersioned(userId, namespace, value)).value;
    },
    async writeVersioned(userId, namespace, value, options = {}) {
      validateScope(userId, namespace);
      const idempotencyKey = normalizeIdempotencyKey(options.idempotencyKey);
      const requestHash = hashPayload(value);
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        if (idempotencyKey) {
          await client.query(
            "DELETE FROM sfm_idempotency_keys WHERE user_id=$1 AND namespace=$2 AND expires_at <= now()",
            [userId, namespace]
          );
          const replay = await client.query(
            "SELECT request_hash, state_version, response_payload FROM sfm_idempotency_keys WHERE user_id=$1 AND namespace=$2 AND idempotency_key=$3 AND expires_at > now()",
            [userId, namespace, idempotencyKey]
          );
          if (replay.rowCount) {
            if (replay.rows[0].request_hash !== requestHash) throw conflict("Idempotency key was already used with different content");
            await client.query("COMMIT");
            return { value: replay.rows[0].response_payload, version: Number(replay.rows[0].state_version), replayed: true };
          }
        }

        const current = await client.query(
          "SELECT version FROM sfm_user_state WHERE user_id=$1 AND namespace=$2 FOR UPDATE",
          [userId, namespace]
        );
        const currentVersion = current.rowCount ? Number(current.rows[0].version) : 0;
        if (options.expectedVersion !== undefined && Number(options.expectedVersion) !== currentVersion) {
          throw conflict(`State version mismatch; expected ${options.expectedVersion}, current ${currentVersion}`);
        }
        const nextVersion = currentVersion + 1;
        const saved = await client.query(
          `INSERT INTO sfm_user_state (user_id, namespace, version, payload)
           VALUES ($1,$2,$3,$4::jsonb)
           ON CONFLICT (user_id, namespace) DO UPDATE
           SET version=EXCLUDED.version, payload=EXCLUDED.payload, updated_at=now()
           RETURNING payload, updated_at`,
          [userId, namespace, nextVersion, JSON.stringify(value)]
        );
        if (idempotencyKey) {
          await client.query(
            `INSERT INTO sfm_idempotency_keys (user_id, namespace, idempotency_key, request_hash, state_version, response_payload)
             VALUES ($1,$2,$3,$4,$5,$6::jsonb)`,
            [userId, namespace, idempotencyKey, requestHash, nextVersion, JSON.stringify(saved.rows[0].payload)]
          );
        }
        await client.query("COMMIT");
        return { value: saved.rows[0].payload, version: nextVersion, updatedAt: saved.rows[0].updated_at?.toISOString?.(), replayed: false };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw error;
      } finally {
        client.release();
      }
    },
    async health() {
      const startedAt = performance.now();
      await pool.query("SELECT 1");
      return { ok: true, driver: "postgres", latencyMs: Math.round((performance.now() - startedAt) * 10) / 10 };
    },
    async close() { await pool.end(); }
  };
}

function validateScope(userId, namespace) {
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(String(userId))) throw new Error("Invalid user scope");
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(String(namespace))) throw new Error("Invalid state namespace");
}

function normalizeIdempotencyKey(value) {
  const key = String(value || "").trim();
  if (!key) return "";
  if (key.length < 8 || key.length > 120) throw new Error("Invalid idempotency key");
  return key;
}

function hashPayload(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function conflict(message) {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function sslOptions(mode = "require") {
  if (String(mode).toLowerCase() === "disable") return false;
  return { rejectUnauthorized: String(mode).toLowerCase() === "verify-full" };
}
