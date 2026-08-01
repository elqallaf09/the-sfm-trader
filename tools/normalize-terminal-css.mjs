import { readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";

const file = "public/styles.css";
const css = await readFile(file, "utf8");
const root = postcss.parse(css, { from: file });
let restoredLoadingIndicators = 0;

root.walkRules((rule) => {
  const selectors = rule.selectors || [rule.selector];
  if (!selectors.includes(".loading-indicator") || rule.nodes?.every((node) => node.prop !== "display" || node.value !== "none")) return;
  const retained = selectors.filter((selector) => selector !== ".loading-indicator");
  if (retained.length) rule.selectors = retained;
  else rule.remove();
  restoredLoadingIndicators += 1;
});

await writeFile(file, root.toString());
console.log(JSON.stringify({ restoredLoadingIndicators }));
