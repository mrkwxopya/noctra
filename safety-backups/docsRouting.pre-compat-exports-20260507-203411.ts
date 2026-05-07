export const NOCTRA_DOCS_BASE = "/noctra";

export type NoctraDocsRoute =
  | { route: "overview" }
  | { route: "components" }
  | { route: "component"; componentSlug: string }
  | { route: "architecture" }
  | { route: "theming" }
  | { route: "quality" }
  | { route: "release" }
  | { route: "tokens" };

export function normalizeSlashPath(path = "/"): string {
  if (!path || path === "/") return "/";

  let nextPath = String(path).trim();

  if (!nextPath) return "/";

  if (!nextPath.startsWith("/")) {
    nextPath = `/${nextPath}`;
  }

  nextPath = nextPath.replace(/\/+/g, "/");

  if (nextPath.length > 1 && nextPath.endsWith("/")) {
    nextPath = nextPath.slice(0, -1);
  }

  return nextPath || "/";
}

export function stripDocsBase(path = "/"): string {
  const normalized = normalizeSlashPath(path);

  if (normalized === NOCTRA_DOCS_BASE) return "/";

  if (normalized.startsWith(`${NOCTRA_DOCS_BASE}/`)) {
    return normalizeSlashPath(normalized.slice(NOCTRA_DOCS_BASE.length));
  }

  return normalized;
}

export function cleanDocsPath(path = "/"): string {
  let nextPath = String(path || "/").trim();

  if (!nextPath) return "/";

  if (nextPath.startsWith("#")) {
    nextPath = nextPath.slice(1);
  }

  if (nextPath.startsWith(`${NOCTRA_DOCS_BASE}/`)) {
    nextPath = nextPath.slice(NOCTRA_DOCS_BASE.length);
  }

  if (nextPath === NOCTRA_DOCS_BASE) {
    nextPath = "/";
  }

  return normalizeSlashPath(nextPath);
}

export const normalizeDocsPath = cleanDocsPath;
export const normalizeDocsRoutePath = cleanDocsPath;
export const cleanDocsRoutePath = cleanDocsPath;

export function docsHref(path = "/"): string {
  const clean = cleanDocsPath(path);

  return clean === "/" ? `${NOCTRA_DOCS_BASE}/` : `${NOCTRA_DOCS_BASE}${clean}`;
}

export const docsBaseHref = docsHref;
export const toDocsHref = docsHref;
export const getDocsHref = docsHref;

export function isDocsInternalUrl(url: URL): boolean {
  return (
    url.origin === window.location.origin &&
    (
      url.pathname === "/" ||
      url.pathname === NOCTRA_DOCS_BASE ||
      url.pathname.startsWith(`${NOCTRA_DOCS_BASE}/`) ||
      url.pathname === "/components" ||
      url.pathname.startsWith("/components/") ||
      url.pathname === "/architecture" ||
      url.pathname === "/theming" ||
      url.pathname === "/quality" ||
      url.pathname === "/release" ||
      url.pathname === "/tokens"
    )
  );
}

export const isInternalDocsUrl = isDocsInternalUrl;
export const isDocsUrl = isDocsInternalUrl;

export function resolveDocsRouteFromPath(path = "/", hash = ""): NoctraDocsRoute {
  const hashPath = String(hash || "");

  const candidate = hashPath.startsWith(`${NOCTRA_DOCS_BASE}/`) || hashPath === NOCTRA_DOCS_BASE
    ? hashPath
    : path;

  const clean = cleanDocsPath(candidate);

  if (clean === "/" || clean === "/overview") {
    return { route: "overview" };
  }

  if (clean === "/components") {
    return { route: "components" };
  }

  if (clean.startsWith("/components/")) {
    return {
      route: "component",
      componentSlug: clean.replace("/components/", "")
    };
  }

  if (clean === "/architecture") {
    return { route: "architecture" };
  }

  if (clean === "/theming") {
    return { route: "theming" };
  }

  if (clean === "/quality") {
    return { route: "quality" };
  }

  if (clean === "/release") {
    return { route: "release" };
  }

  if (clean === "/tokens") {
    return { route: "tokens" };
  }

  return { route: "overview" };
}

export function resolveDocsRoute(location: Location = window.location): NoctraDocsRoute {
  return resolveDocsRouteFromPath(location.pathname, location.hash.startsWith("#") ? location.hash.slice(1) : location.hash);
}

export const getDocsRouteFromLocation = resolveDocsRoute;
export const docsRouteFromLocation = resolveDocsRoute;
export const readDocsRoute = resolveDocsRoute;

export function currentDocsLocationKey(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export const getCurrentDocsLocationKey = currentDocsLocationKey;
export const getDocsCurrentPath = currentDocsLocationKey;

export function normalizeDocsNavigationTarget(path = "/", hash = ""): string {
  const hashPath = String(hash || "");

  if (hashPath.startsWith(`${NOCTRA_DOCS_BASE}/`) || hashPath === NOCTRA_DOCS_BASE) {
    return cleanDocsPath(hashPath);
  }

  return cleanDocsPath(path);
}

export const normalizeDocsHashToPath = normalizeDocsNavigationTarget;

export function sanitizeNoctraHashRoute(): void {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;

  if (!hash.startsWith(`#${NOCTRA_DOCS_BASE}/`) && hash !== `#${NOCTRA_DOCS_BASE}`) {
    return;
  }

  const clean = cleanDocsPath(hash.slice(1));
  const nextUrl = `${docsHref(clean)}${window.location.search || ""}`;

  window.history.replaceState(null, "", nextUrl);
}

export function rewriteDocsAnchors(scope: Document | HTMLElement = document): void {
  if (typeof window === "undefined") return;

  const anchors = Array.from(scope.querySelectorAll("a[href]"));

  for (const anchor of anchors) {
    if (!(anchor instanceof HTMLAnchorElement)) continue;

    const rawHref = anchor.getAttribute("href");

    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
      continue;
    }

    const url = new URL(anchor.href, window.location.origin);

    if (!isDocsInternalUrl(url)) {
      continue;
    }

    const target = cleanDocsPath(`${url.pathname}${url.search}${url.hash}`);
    anchor.href = docsHref(target);
  }
}

export const hardenDocsAnchors = rewriteDocsAnchors;
export const patchDocsAnchors = rewriteDocsAnchors;
