import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("production surfaces link all legal disclosures", async () => {
  for (const page of ["public/index.html", "public/detail.html"]) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), "utf8");
    for (const href of ["/risk-disclosure.html", "/privacy.html", "/terms.html"]) assert.match(html, new RegExp(href));
  }
});

test("iOS privacy manifest declares processed user data and no tracking", async () => {
  const manifest = await readFile(new URL("../ios/App/App/PrivacyInfo.xcprivacy", import.meta.url), "utf8");
  assert.match(manifest, /<key>NSPrivacyTracking<\/key>\s*<false\/>/);
  for (const type of ["UserID", "ProductInteraction", "OtherUserContent"]) assert.match(manifest, new RegExp(`NSPrivacyCollectedDataType${type}`));
});
