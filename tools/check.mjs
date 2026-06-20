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

if (failed) {
  console.error("Check failed.");
  process.exit(1);
}

console.log("Check passed.");
