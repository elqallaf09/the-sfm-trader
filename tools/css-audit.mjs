import { readFileSync } from "node:fs";

const cssFiles = ["public/styles.css", "public/desktop-balance.css", "public/cinema.css"];
const sourceFiles = ["public/index.html", "public/detail.html", "public/app.js", "public/detail.js"];
const source = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const selectors = [];

for (const file of cssFiles) {
  const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of css.matchAll(/(?:^|})\s*([^@}{][^{]*)\{/g)) {
    for (const selector of match[1].split(",")) selectors.push({ file, selector: selector.trim() });
  }
}

const simple = selectors.flatMap(({ file, selector }) =>
  [...selector.matchAll(/([.#])([a-zA-Z_][\w-]*)/g)].map((match) => ({ file, kind: match[1], name: match[2], selector }))
);
// Conservative by design: dynamic template strings still count as usage.
const unused = simple.filter(({ name }) => !source.includes(name));
const uniqueUnused = [...new Map(unused.map((item) => [`${item.kind}${item.name}`, item])).values()];

console.log(JSON.stringify({ selectors: selectors.length, simpleTokens: simple.length, potentialUnused: uniqueUnused.length, review: uniqueUnused.slice(0, 40) }, null, 2));
if (selectors.length === 0) process.exitCode = 1;
