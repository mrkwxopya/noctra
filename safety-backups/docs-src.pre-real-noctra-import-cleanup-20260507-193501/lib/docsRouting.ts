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

export function docsHref(path = "/") {
  const cleanPath = normalizeNoctraDocsPath(path);
  return cleanPath === "/" ? "/noctra/" : `/noctra${cleanPath}`;
}

export function forceNoctraDocsHref(path = "/") {
  return docsHref(path);
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
  const hashPath = locationLike.hash.startsWith(docsHref("/")) ? locationLike.hash.slice(1) : "";
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

export function canonicalizeDocsCleanRoute(pathname = "/", hash = "") {
  const hashValue = String(hash || "");

  if (hashValue.startsWith(docsHref("/"))) {
    return normalizeNoctraDocsPath(hashValue.slice(1));
  }

  return normalizeNoctraDocsPath(pathname);
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

export function normalizeNoctraDocsPath(path = "/") {
  let value = String(path || "/").trim();

  if (!value) value = "/";
  if (value.startsWith(docsHref("/"))) value = value.slice(1);
  if (value.startsWith("#")) value = value.slice(1);
  if (value.startsWith("/noctra/")) value = value.slice("/noctra".length);
  if (value === "/noctra") value = "/";
  if (!value.startsWith("/")) value = `/${value}`;

  value = value.replace(/\/+/g, "/");

  return value === "" ? "/" : value;
}
