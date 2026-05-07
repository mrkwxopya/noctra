import {
  StrictMode,
  useEffect,
  useMemo,
  useState } from "react";

function sanitizeNoctraHashRoute() {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;

  if (!hash.startsWith(docsHref("/"))) return;

  const cleanPath = hash.slice(1);
  const nextPath = cleanPath === "/" ? "/noctra/" : `/noctra${cleanPath}`;
  const nextUrl = `${nextPath}${window.location.search || ""}`;

  window.history.replaceState(null, "", nextUrl);
}

sanitizeNoctraHashRoute();

import { createRoot } from "react-dom/client";
import { DocsChrome,
  type DocsRoute } from "./components/DocsChrome";
import { OverviewPage } from "./pages/OverviewPage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { ComponentDetailPage } from "./pages/ComponentDetailPage";
import { ArchitecturePage } from "./pages/ArchitecturePage";
import { ThemingPage } from "./pages/ThemingPage";
import { QualityPage } from "./pages/QualityPage";
import { ReleasePage } from "./pages/ReleasePage";
import { noctraDocsComponents } from "./generated/noctra-professional-docs.generated";
import {
  canonicalizeDocsCleanRoute,
  docsHref,
  isInternalDocsUrl,
  parseDocsRouteFromLocation,
  sanitizeDocsAnchors
} from "./lib/docsRouting";
import "./noctra-style-bridge.css";
import "./docs.css";

function locationKey() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function parseRoute(): { route: typeof DocsRoute; componentSlug?: string } {
  return parseDocsRouteFromLocation(window.location);
}

function App() {
  const [key, setKey] = useState(() => locationKey());
  const parsedRoute = useMemo(() => parseRoute(), [key]);

  useEffect(() => {
    canonicalizeDocsCleanRoute();
    setKey(locationKey());

    const syncRoute = () => {
      canonicalizeDocsCleanRoute();
      setKey(locationKey());
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;

      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href);

      if (!isInternalDocsUrl(url)) return;

      event.preventDefault();

      const next = `${url.pathname}${url.search}${url.hash}`;

      if (next !== locationKey()) {
        window.history.pushState(null, "", next);
      }

      syncRoute();
    };

    window.addEventListener("popstate", syncRoute);
    window.addEventListener("hashchange", syncRoute);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("hashchange", syncRoute);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [parsedRoute.route, parsedRoute.componentSlug]);

  const component = useMemo(() => {
    if (!parsedRoute.componentSlug) return undefined;

    return noctraDocsComponents.find((item) => item.kebab === parsedRoute.componentSlug);
  }, [parsedRoute.componentSlug]);

  useEffect(() => {
    document.title = component ? `Noctra Docs — ${component.name}` : "Noctra Professional Docs";
  }, [component]);

  // Smooth scroll to top on route changes.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [parsedRoute.route, parsedRoute.componentSlug]);

  const page = useMemo(() => {
    if (parsedRoute.route === "component") {
      return component ? <ComponentDetailPage component={component} /> : <ComponentsPage />;
    }

    if (parsedRoute.route === "components") return <ComponentsPage />;
    if (parsedRoute.route === "architecture") return <ArchitecturePage />;
    if (parsedRoute.route === "theming") return <ThemingPage />;
    if (parsedRoute.route === "quality") return <QualityPage />;
    if (parsedRoute.route === "release") return <ReleasePage />;

    return <OverviewPage />;
  }, [component, parsedRoute.route]);

  return <DocsChrome route={parsedRoute.route}>{page}</DocsChrome>;
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

if (window.location.pathname.endsWith("/index.html")) {
  window.history.replaceState(null, "", docsHref("/"));
}


sanitizeDocsAnchors();

const noctraAnchorObserver = new MutationObserver(() => {
  sanitizeDocsAnchors();
});

noctraAnchorObserver.observe(document.body, {
  childList: true,
  subtree: true
});

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
