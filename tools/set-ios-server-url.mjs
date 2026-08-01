import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const configPath = path.join(projectRoot, "capacitor.config.json");
const nextUrl = process.argv[2];

if (!nextUrl) {
  console.error("Usage: node tools/set-ios-server-url.mjs <url>");
  process.exit(1);
}

const parsedUrl = new URL(nextUrl);
const insecureAllowed = process.env.ALLOW_INSECURE_IOS_SERVER === "true";
if (parsedUrl.protocol !== "https:" && !insecureAllowed) {
  console.error("Release iOS server URL must use HTTPS. Set ALLOW_INSECURE_IOS_SERVER=true only for local debug builds.");
  process.exit(1);
}

const config = JSON.parse(await readFile(configPath, "utf8"));
config.server = config.server || {};
config.server.url = nextUrl;
config.server.cleartext = parsedUrl.protocol !== "https:";

await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log(`Updated iOS server URL to: ${nextUrl}`);
