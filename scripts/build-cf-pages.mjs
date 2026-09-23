#!/usr/bin/env node
/**
 * Build the static SPA for Cloudflare Pages.
 *
 * Three flags, all environment rather than CLI: `PAGES=1` keeps TanStack Start
 * in SPA mode, `BASE_PATH=/` pins the app to a root domain (`sp-workflow.pages.dev`
 * has no path prefix, unlike the GitHub Pages copy under `/sp404-workflow/`), and
 * `CF_PAGES=1` tells `pages-postbuild.mjs` to skip the GitHub-only 404.html shim.
 *
 * `VITE_` flags still come from `.grok/app-env.json` through the same merge
 * `with-app-env` applies, so a Cloudflare build and a `npm run dev` session
 * cannot disagree about `VITE_AUTH_ENABLED`.
 *
 * Vite is spawned as a Node module instead of a bare `vite` binary: on Windows
 * the `.bin` shim is a `.cmd`, which `spawn` cannot execute.
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { mergeAppEnv, projectRoot, readAppEnv } from "./with-app-env.mjs";

const root = projectRoot();
const env = {
  ...mergeAppEnv(readAppEnv(root), process.env),
  PAGES: "1",
  BASE_PATH: "/",
  CF_PAGES: "1",
};

function run(entry, args) {
  const result = spawnSync(process.execPath, [join(root, entry), ...args], {
    cwd: root,
    env,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("node_modules/vite/bin/vite.js", ["build"]);
run("scripts/pages-postbuild.mjs", []);
