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
import { createHash } from "node:crypto";

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

// Precache every route chunk, font and icon so unvisited tools work offline too.
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
function walk(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const name = `${prefix}${entry.name}`;
    return entry.isDirectory() ? walk(join(dir, entry.name), `${name}/`) : [name];
  });
}
const files = walk(outDir).filter(name => !['sw.js', '_redirects', '.nojekyll', '404.html', '_shell.html'].includes(name));
const version = createHash('sha256').update(files.map(name => name + readFileSync(join(outDir, name))).join('|')).digest('hex').slice(0, 16);
writeFileSync(join(outDir, 'sw.js'), `
const CACHE = 'spw-static-${version}';
const BASE = ${JSON.stringify(base)};
const FILES = ${JSON.stringify(files.map(name => base + name))};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('spw-static-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE) || url.pathname.includes('/api/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.open(CACHE).then(cache => cache.match(BASE + 'index.html'))));
    return;
  }
  if (FILES.includes(url.pathname)) event.respondWith(caches.open(CACHE).then(cache => cache.match(request).then(hit => hit || fetch(request))));
});
`);

console.log(
  `[pages-postbuild] ${outDir} from ${shellPath}${cssFile ? ` css=${cssFile}` : ""} ${
    forCloudflare ? "cf(_redirects)" : "gh-pages(404.html)"
  }`,
);
