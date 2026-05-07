export type DocsRoute =
  | { route: "overview" }
  | { route: "components" }
  | { route: "component"; componentSlug: string }
  | { route: "architecture" }
  | { route: "theming" }
  | { route: "quality" }
  | { route: "release" };

export const NOCTRA_DOCS_BASE = "/noctra/";

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return "/";

  let next = pathname.trim();

  if (!next.startsWith("/")) {
    next = `/${next}`;
  }

  next = next.replace(/\/{2,}/g, "/");

  if (next.length > 1 && next.endsWith("/")) {
    next = next.slice(0, -1);
  }

  return next;
}

function stripNoctraBase(pathname: string) {
  const normalized = normalizePathname(pathname);

  if (normalized === "/noctra") return "/";

  if (normalized.startsWith("/noctra/")) {
    return normalizePathname(normalized.slice("/noctra".length));
  }

  return normalized;
}

export function docsHref(pathname = "/") {
  const cleanPath = stripNoctraBase(pathname);
  const normalized = normalizePathname(cleanPath);

  if (normalized === "/") return NOCTRA_DOCS_BASE;

  return `${NOCTRA_DOCS_BASE.replace(/\/$/, "")}${normalized}`;
}

export function forceNoctraDocsHref(value: string) {
  if (!value) return docsHref("/");

  try {
    const url = new URL(value, window.location.origin);
    const cleanPath = stripNoctraBase(url.pathname);
    return `${docsHref(cleanPath)}${url.search}${url.hash}`;
  } catch {
    const [pathAndSearch = "/", hash = ""] = value.split("#");
    const [pathname = "/", search = ""] = pathAndSearch.split("?");
    const nextHash = hash ? `#${hash}` : "";
    const nextSearch = search ? `?${search}` : "";

    return `${docsHref(pathname)}${nextSearch}${nextHash}`;
  }
}

export function isInternalDocsUrl(url: URL) {
  if (url.origin !== window.location.origin) return false;

  return (
    url.pathname === "/" ||
    url.pathname === "/noctra" ||
    url.pathname.startsWith("/noctra/") ||
    url.pathname === "/components" ||
    url.pathname.startsWith("/components/") ||
    url.pathname === "/architecture" ||
    url.pathname === "/theming" ||
    url.pathname === "/quality" ||
    url.pathname === "/release"
  );
}

export function parseDocsRouteFromLocation(locationLike: Pick<Location, "pathname" | "hash">): DocsRoute {
  const pathname = stripNoctraBase(locationLike.pathname);
  const hashPath = locationLike.hash.startsWith("#/") ? locationLike.hash.slice(1) : "";
  const routePath = normalizePathname(hashPath || pathname);

  if (routePath === "/" || routePath === "/overview") {
    return { route: "overview" };
  }

  if (routePath === "/components") {
    return { route: "components" };
  }

  if (routePath.startsWith("/components/")) {
    return {
      route: "component",
      componentSlug: routePath.replace("/components/", "")
    };
  }

  if (routePath === "/architecture") return { route: "architecture" };
  if (routePath === "/theming") return { route: "theming" };
  if (routePath === "/quality") return { route: "quality" };
  if (routePath === "/release") return { route: "release" };

  return { route: "overview" };
}

export function canonicalizeDocsCleanRoute() {
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const canonical = forceNoctraDocsHref(current);

  if (canonical !== current) {
    window.history.replaceState(null, "", canonical);
  }
}

export function sanitizeDocsAnchors(root: ParentNode = document) {
  const anchors = Array.from(root.querySelectorAll("a[href]"));

  for (const anchor of anchors) {
    if (!(anchor instanceof HTMLAnchorElement)) continue;

    const rawHref = anchor.getAttribute("href");

    if (!rawHref) continue;
    if (rawHref.startsWith("#")) continue;
    if (rawHref.startsWith("mailto:")) continue;
    if (rawHref.startsWith("tel:")) continue;

    const url = new URL(anchor.href, window.location.origin);

    if (!isInternalDocsUrl(url)) continue;

    anchor.href = forceNoctraDocsHref(`${url.pathname}${url.search}${url.hash}`);
  }
}