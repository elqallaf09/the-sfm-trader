BEGIN;

CREATE TABLE IF NOT EXISTS sfm_user_state (
  user_id text NOT NULL CHECK (user_id ~ '^[A-Za-z0-9_-]{1,80}$'),
  namespace text NOT NULL CHECK (namespace ~ '^[A-Za-z0-9_-]{1,64}$'),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, namespace)
);

CREATE INDEX IF NOT EXISTS sfm_user_state_updated_at_idx
  ON sfm_user_state (updated_at DESC);

CREATE TABLE IF NOT EXISTS sfm_idempotency_keys (
  user_id text NOT NULL CHECK (user_id ~ '^[A-Za-z0-9_-]{1,80}$'),
  namespace text NOT NULL CHECK (namespace ~ '^[A-Za-z0-9_-]{1,64}$'),
  idempotency_key text NOT NULL CHECK (length(idempotency_key) BETWEEN 8 AND 120),
  request_hash text NOT NULL CHECK (length(request_hash) = 64),
  state_version bigint NOT NULL CHECK (state_version > 0),
  response_payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  PRIMARY KEY (user_id, namespace, idempotency_key)
);

CREATE INDEX IF NOT EXISTS sfm_idempotency_expiry_idx
  ON sfm_idempotency_keys (expires_at);

COMMIT;
