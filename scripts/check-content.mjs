// Content guard: fails if a forbidden link/word appears in site source or public text files.
// Run: npm run check:content
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const banned = [["linked", "in"].join("")]; // built dynamically so this file doesn't trip itself
const roots = ["app", "components", "data", "lib", "public", "sanity", "scripts", "sanity.config.ts"];
const textExt = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".md", ".txt", ".svg", ".html", ".xml"]);
let bad = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (textExt.has(extname(p))) {
      const text = readFileSync(p, "utf8").toLowerCase();
      for (const w of banned) if (text.includes(w)) { console.error(`✗ forbidden reference in ${p}`); bad++; }
    }
  }
}
for (const r of roots) {
  try {
    if (statSync(r).isDirectory()) walk(r);
    else if (readFileSync(r, "utf8").toLowerCase().includes(banned[0])) { console.error(`✗ forbidden reference in ${r}`); bad++; }
  } catch { /* path not present */ }
}
if (bad) process.exit(1);
console.log("✓ content check passed (no forbidden references)");
