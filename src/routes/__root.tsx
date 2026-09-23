import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ViewportLock } from "@/components/nav/ViewportLock";
import { APP_REV } from "@/lib/appRev";
import { publicUrl } from "@/lib/publicUrl";
import { Layout } from "@/app/Layout";
import { LocaleProvider } from "@/i18n/locale";
import { AuthProvider } from "@/lib/auth/provider";
import { Navigate } from "@/lib/rr";
import { DisplayProvider } from "@/state/display";
import { StoreProvider, useStore } from "@/state/store";
import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import appCss from "../styles.css?url";

const APP_NAME = "SP Workflow";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // No `viewport-fit=cover`: WebKit then insets the installed app itself and
      // the icon reaches the screen bottom. Asking for edge-to-edge left an
      // orphan band below the dock that no CSS could reach (iPhone 17 Pro /
      // iOS 27; the N3X build was fixed by removing this flag).
      { name: "viewport", content: "width=device-width, initial-scale=1, interactive-widget=resizes-content" },
      { title: APP_NAME },
      { name: "theme-color", content: "#121315" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      // Opaque, like N3X: with automatic insetting the page starts below the
      // status bar, so `black-translucent` only bought a header that had to be
      // padded back out of the clock.
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "description", content: "Offline companion for the Roland SP-404MKII — workflows, shortcuts, muscle memory." },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: publicUrl("favicon.svg") },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: publicUrl("manifest.webmanifest") },
      { rel: "apple-touch-icon", href: publicUrl("icons/apple-touch-icon.png") },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <ViewportLock />
        <div className="app-root">
          <AuthProvider>
            <LocaleProvider>
              <StoreProvider>
                <DisplayProvider>
                  <ClientShell />
                </DisplayProvider>
              </StoreProvider>
            </LocaleProvider>
          </AuthProvider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function ClientShell() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  if (!ready) {
    return (
      <div className="boot">
        <span className="boot__brand u-label">SP WORKFLOW</span>
        <span className="boot__lcd u-mono">{APP_REV}</span>
      </div>
    );
  }
  return <AppGate />;
}

function AppGate() {
  const { state } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onboarded = state.ui.onboarded;

  if (!onboarded && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  if (onboarded && pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }
  if (pathname === "/onboarding") {
    return <Outlet />;
  }
  return <Layout />;
}
