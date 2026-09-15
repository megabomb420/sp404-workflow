#!/usr/bin/env node
/**
 * Finish a GitHub Pages build: promote TanStack's SPA shell to index.html
 * and 404.html (client-side routes), rewrite the prerender CSS href to the
 * real client stylesheet, and drop .nojekyll.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const candidates = ["dist/client", ".output/public", "dist"];
const root = process.cwd();
const outDir = candidates
  .map((dir) => join(root, dir))
  .find((dir) => existsSync(join(dir, "_shell.html")) || existsSync(join(dir, "index.html")));

if (!outDir) {
  console.error("[pages-postbuild] no SPA output in", candidates.join(", "));
  process.exit(1);
}

const shellPath = existsSync(join(outDir, "_shell.html"))
  ? join(outDir, "_shell.html")
  : join(outDir, "index.html");

const assetsDir = join(outDir, "assets");
const cssFile = existsSync(assetsDir)
  ? readdirSync(assetsDir).find((name) => /^styles-.*\.css$/.test(name))
  : undefined;

let html = readFileSync(shellPath, "utf8");
if (cssFile) {
  html = html.replace(/styles-[^"'\\\s]+\.css/g, cssFile);
}

writeFileSync(join(outDir, "index.html"), html);
writeFileSync(join(outDir, "404.html"), html);
writeFileSync(join(outDir, ".nojekyll"), "");

console.log(`[pages-postbuild] ${outDir} from ${shellPath}${cssFile ? ` css=${cssFile}` : ""}`);
