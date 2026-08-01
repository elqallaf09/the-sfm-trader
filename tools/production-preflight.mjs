const required = ["DATABASE_URL", "SFM_AUTH_TOKENS", "SFM_ALLOWED_ORIGINS", "SFM_OPERATOR_NAME", "SFM_LEGAL_CONTACT"];
const missing = required.filter((name) => !String(process.env[name] || "").trim());
if (missing.length) throw new Error(`Missing production configuration: ${missing.join(", ")}`);
if (String(process.env.SFM_STORAGE_DRIVER || "postgres").toLowerCase() !== "postgres") {
  throw new Error("Production requires SFM_STORAGE_DRIVER=postgres");
}

const origins = String(process.env.SFM_ALLOWED_ORIGINS).split(",").map((value) => value.trim()).filter(Boolean);
if (!origins.length || origins.some((origin) => !origin.startsWith("https://"))) {
  throw new Error("Every SFM_ALLOWED_ORIGINS value must use HTTPS");
}

let tokens;
try {
  tokens = JSON.parse(process.env.SFM_AUTH_TOKENS);
} catch {
  throw new Error("SFM_AUTH_TOKENS must be valid JSON");
}
if (!tokens || typeof tokens !== "object" || Array.isArray(tokens) || !Object.keys(tokens).length) {
  throw new Error("SFM_AUTH_TOKENS must contain at least one token-to-user mapping");
}
if (Object.keys(tokens).some((token) => token.length < 24)) throw new Error("Every production token must be at least 24 characters");

const operatorName = String(process.env.SFM_OPERATOR_NAME).trim();
const legalContact = String(process.env.SFM_LEGAL_CONTACT).trim();
if (operatorName.length < 2) throw new Error("SFM_OPERATOR_NAME must identify the service operator");
if (!/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$|^https:\/\//i.test(legalContact)) {
  throw new Error("SFM_LEGAL_CONTACT must be an HTTPS URL or mailto address");
}

console.log(JSON.stringify({ ok: true, storage: "postgres", allowedOrigins: origins.length, configuredUsers: Object.keys(tokens).length, operatorConfigured: true }));
