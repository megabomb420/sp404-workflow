/** Vite `base` — `/` in preview, `/sp404-workflow/` on GitHub Pages. */
export const APP_BASE = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

export function publicUrl(path: string) {
  return `${APP_BASE}${String(path).replace(/^\//, "")}`;
}

export function routerBasepath() {
  const trimmed = APP_BASE.replace(/\/$/, "");
  return trimmed === "" ? "/" : trimmed;
}
