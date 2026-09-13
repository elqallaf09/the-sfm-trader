import { readFileSync, readdirSync } from "node:fs";
import postcss from "postcss";

const files = readdirSync("public", { recursive: true }).map(file => "public/" + file);
const source = files.filter(file => /\.(?:html|js)$/.test(file)).map(file => readFileSync(file, "utf8")).join("\n");
let rules = 0, important = 0, bytes = 0;
const unused = new Set();
for (const file of files.filter(file => file.endsWith(".css"))) {
  const css = readFileSync(file, "utf8");
  bytes += Buffer.byteLength(css);
  const root = postcss.parse(css, { from: file });
  root.walkRules(rule => {
    rules++;
    for (const match of rule.selector.matchAll(/[.#]([a-zA-Z_][\w-]*)/g)) {
      if (!source.includes(match[1])) unused.add(match[1]);
    }
  });
  root.walkDecls(declaration => { if (declaration.important) important++; });
}
console.log(JSON.stringify({ rules, important, bytes, potentialUnused: unused.size, review: [...unused].slice(0, 40) }, null, 2));
// Prevent another large override layer while existing components are progressively simplified.
if (!rules || important > 8500) throw new Error("CSS override budget exceeded");
