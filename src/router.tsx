import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routerBasepath } from "@/lib/publicUrl";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    basepath: routerBasepath(),
    defaultErrorComponent: AppErrorComponent,
    defaultPreload: "intent",
    scrollRestoration: false,
  });
}
