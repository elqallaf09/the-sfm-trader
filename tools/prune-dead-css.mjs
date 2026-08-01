import { readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";

const files = ["public/styles.css", "public/desktop-balance.css", "public/cinema.css"];
const deadTokens = new Set([
  "rail-ai-card", "floor-aurora", "floor-head", "home-rec-sparkline", "content-main",
  "site-bg-overlay", "ambient-orb", "dashboard-ambient", "soft-glow", "screen-glow",
  "terminal-header", "home-dashboard", "agent-log-section", "premium-footer"
]);

let removedSelectors = 0;
let removedRules = 0;
for (const file of files) {
  const css = await readFile(file, "utf8");
  const root = postcss.parse(css, { from: file });
  root.walkRules((rule) => {
    const selectors = rule.selectors || [rule.selector];
    const retained = selectors.filter((selector) => ![...deadTokens].some((token) => selector.includes(`.${token}`)));
    removedSelectors += selectors.length - retained.length;
    if (retained.length === 0) {
      removedRules += 1;
      rule.remove();
    } else if (retained.length !== selectors.length) {
      rule.selectors = retained;
    }
  });
  await writeFile(file, root.toString());
}

console.log(JSON.stringify({ removedSelectors, removedRules, deadTokens: [...deadTokens] }, null, 2));
