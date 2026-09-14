import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import postcss from "postcss";

test("every shipped stylesheet parses without recovery", () => {
  const directory = new URL("../public/", import.meta.url);
  const files = readdirSync(directory, { recursive: true }).filter(file => file.endsWith(".css"));
  assert.ok(files.length > 0);
  for (const file of files) {
    const css = readFileSync(new URL(file, directory), "utf8");
    assert.doesNotThrow(() => postcss.parse(css, { from: file }), file);
  }
});
