import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const syntaxFiles = [
  "server.mjs",
  "src/analysis.mjs",
  "src/dataProviders.mjs",
  "src/markets.mjs",
  "src/economicCalendar.mjs",
  "public/app.js",
  "public/detail.js",
  "tools/set-ios-server-url.mjs",
  "tools/smoke.mjs"
];

const jsonFiles = [
  "package.json",
  "capacitor.config.json",
  "public/manifest.webmanifest"
];

let failed = false;
const nonLatinDigits = /[\u0660-\u0669\u06F0-\u06F9]/;

function normalizeDigits(value) {
  return String(value ?? "")
    .replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (digit) => {
      const code = digit.charCodeAt(0);
      return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
    })
    .replace(/\u066B/g, ".")
    .replace(/\u066C/g, ",")
    .replace(/\u066A/g, "%")
    .replace(/[\u061C\u200E\u200F]/g, "");
}

for (const file of syntaxFiles) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
    shell: false
  });

  if (result.status !== 0) {
    failed = true;
    console.error(`[syntax failed] ${file}`);
    if (result.stderr) console.error(result.stderr.trim());
  } else {
    console.log(`[syntax ok] ${file}`);
  }
}

for (const file of jsonFiles) {
  try {
    JSON.parse(readFileSync(file, "utf8"));
    console.log(`[json ok] ${file}`);
  } catch (error) {
    failed = true;
    console.error(`[json failed] ${file}: ${error.message}`);
  }
}

const normalizedSample = normalizeDigits("\u0661\u0662\u0663 \u06F4\u06F5\u06F6 \u0664\u0665\u066B\u0666\u0667\u066A");
if (normalizedSample !== "123 456 45.67%" || nonLatinDigits.test(normalizedSample)) {
  failed = true;
  console.error("[latin-digits failed] digit normalization fallback");
} else {
  console.log("[latin-digits ok] digit normalization fallback");
}

for (const file of ["public/app.js", "public/detail.js"]) {
  const content = readFileSync(file, "utf8");
  const hasNormalizer = content.includes("function normalizeDigits");
  const rawArabicIntl = /new Intl\.(?:NumberFormat|DateTimeFormat)\(\s*["']ar(?:-|["'])/.test(content);
  const rawArabicLocale = /\.toLocale(?:String|DateString|TimeString)\(\s*["']ar(?:-|["'])/.test(content);
  if (!hasNormalizer || rawArabicIntl || rawArabicLocale) {
    failed = true;
    console.error(`[latin-digits failed] ${file}`);
  } else {
    console.log(`[latin-digits ok] ${file}`);
  }
}

if (failed) {
  console.error("Check failed.");
  process.exit(1);
}

console.log("Check passed.");
