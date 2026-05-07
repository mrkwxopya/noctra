import type { DocsRoute } from "../components/DocsChrome";

export type ParsedDocsRoute = {
  route: DocsRoute;
  componentSlug?: string;
};

const REQUIRED_BASE = "/noctra/";

function getViteBaseUrl() {
  const meta = import.meta as unknown as {
    env?: {
      BASE_URL?: string;
    };
  };

  return meta.env?.BASE_URL ?? REQUIRED_BASE;
}

export function getDocsBasePath() {
  const viteBase = getViteBaseUrl();
  let base = viteBase && viteBase !== "/" ? viteBase : REQUIRED_BASE;

  if (!base.startsWith("/")) {
    base = `/${base}`;
  }

  return base.endsWith("/") ? base : `${base}/`;
}

export function normalizeDocsPath(value: string) {
  const withoutHash = value.replace(/^#\/?/, "/");
  const cleaned = withoutHash.replace(/^\/+/, "/").replace(/\/+$/, "");

  return cleaned === "" ? "/" : cleaned;
}

export function docsHref(path = "/") {
  const base = getDocsBasePath();
  const normalized = normalizeDocsPath(path);

  if (normalized === "/") return base;

  const withoutNoctra = normalized.replace(/^\/noctra(\/|$)/, "/");

  return `${base}${withoutNoctra.replace(/^\/+/, "")}`;
}

export function parseDocsRouteFromPath(path: string): ParsedDocsRoute {
  const normalized = normalizeDocsPath(path);
  const parts = normalized.split("/").filter(Boolean);

  if (parts[0] === "noctra") {
    parts.shift();
  }

  if (parts.length === 0) return { route: "overview" };

  if (parts[0] === "components" && parts[1]) {
    return {
      route: "component",
      componentSlug: parts[1]
    };
  }

  if (parts[0] === "components") return { route: "components" };
  if (parts[0] === "architecture") return { route: "architecture" };
  if (parts[0] === "theming") return { route: "theming" };
  if (parts[0] === "quality") return { route: "quality" };
  if (parts[0] === "release") return { route: "release" };

  return { route: "overview" };
}

export function getRelativeDocsPathFromLocation(location: Location) {
  if (location.hash.startsWith("#/")) {
    return normalizeDocsPath(location.hash);
  }

  const base = getDocsBasePath();
  const baseWithoutTrailingSlash = base.replace(/\/+$/, "");
  const pathname = location.pathname;

  if (pathname === "/components" || pathname.startsWith("/components/")) {
    return normalizeDocsPath(pathname);
  }

  if (baseWithoutTrailingSlash && pathname.startsWith(baseWithoutTrailingSlash)) {
    const relative = pathname.slice(baseWithoutTrailingSlash.length);

    return normalizeDocsPath(relative || "/");
  }

  return normalizeDocsPath(pathname);
}

export function parseDocsRouteFromLocation(location: Location): ParsedDocsRoute {
  return parseDocsRouteFromPath(getRelativeDocsPathFromLocation(location));
}

export function routeToPath(route: ParsedDocsRoute) {
  if (route.route === "component" && route.componentSlug) {
    return `/components/${route.componentSlug}`;
  }

  if (route.route === "overview") return "/";

  return `/${route.route}`;
}

export function canonicalCleanHrefForLocation(location: Location) {
  const parsed = parseDocsRouteFromLocation(location);

  return docsHref(routeToPath(parsed));
}

export function canonicalizeDocsCleanRoute() {
  const target = canonicalCleanHrefForLocation(window.location);
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (current !== target) {
    window.history.replaceState(null, "", target);
  }
}

export function isInternalDocsUrl(url: URL) {
  if (url.origin !== window.location.origin) return false;

  const base = getDocsBasePath();
  const baseWithoutTrailingSlash = base.replace(/\/+$/, "");

  return (
    url.pathname === baseWithoutTrailingSlash ||
    url.pathname.startsWith(`${baseWithoutTrailingSlash}/`) ||
    url.pathname === "/components" ||
    url.pathname.startsWith("/components/")
  );
}

export function toNoctraDocsUrl(path: string) {
  return docsHref(path);
}