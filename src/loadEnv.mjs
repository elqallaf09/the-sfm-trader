import { readFileSync } from "node:fs";

// This module must be imported before modules that snapshot process.env.
export function loadEnvFile(filePath, environment = process.env) {
  let source;
  try { source = readFileSync(filePath, "utf8"); }
  catch (error) { if (error.code === "ENOENT") return; throw error; }
  for (const line of source.split(/\r?\n/)) {
    const match = line.trim().match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || environment[match[1]] !== undefined) continue;
    const raw = match[2].trim();
    const quoted = (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"));
    environment[match[1]] = quoted ? raw.slice(1, -1) : raw.replace(/\s+#.*$/, "").trim();
  }
}
loadEnvFile(new URL("../.env", import.meta.url));
