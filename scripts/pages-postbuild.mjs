#!/usr/bin/env node
/**
 * Finish a static Pages build: promote TanStack's SPA shell to index.html and
 * rewrite the prerender CSS href to the real client stylesheet.
 *
 * GitHub Pages gets `404.html` (its only client-route fallback) and `.nojekyll`.
 * Cloudflare Pages must NOT: an unmatched path answered by `404.html` carries a
 * 404 status, and Cloudflare serves the fallback from `public/_redirects`
 * (`/* /index.html 200`) instead. `CF_PAGES=1` selects that shape — Cloudflare's
 * own build image sets it, and `scripts/build-cf-pages.mjs` sets it locally.
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

const forCloudflare = process.env.CF_PAGES === "1";

writeFileSync(join(outDir, "index.html"), html);
if (!forCloudflare) {
  writeFileSync(join(outDir, "404.html"), html);
  writeFileSync(join(outDir, ".nojekyll"), "");
}

console.log(
  `[pages-postbuild] ${outDir} from ${shellPath}${cssFile ? ` css=${cssFile}` : ""} ${
    forCloudflare ? "cf(_redirects)" : "gh-pages(404.html)"
  }`,
);
