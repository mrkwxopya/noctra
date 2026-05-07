import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const distRoot = "apps/docs/dist";
const indexPath = join(distRoot, "index.html");
const sidebarPath = "apps/docs/src/data/docsSidebarLinks.ts";
const reportPath = "static-route-fallbacks-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function cleanRoute(route) {
  if (!route || typeof route !== "string") return "/";
  let out = route.trim();

  if (!out.startsWith("/")) out = "/" + out;

  out = out.split("?")[0].split("#")[0];
  out = out.replace(/\/+/g, "/");

  if (out !== "/") out = out.replace(/\/+$/, "");

  return out || "/";
}

function routeToIndexPath(route) {
  const clean = cleanRoute(route);

  if (clean === "/") return indexPath;

  return join(distRoot, clean.slice(1), "index.html");
}

function kebabToCompactAlias(slug) {
  return slug.replace(/-/g, "");
}

function addRoute(set, route) {
  const clean = cleanRoute(route);
  set.add(clean);

  if (clean !== "/") {
    set.add(clean + "/");
  }
}

if (!existsSync(indexPath)) {
  throw new Error(`Missing dist index: ${indexPath}`);
}

const indexHtml = readText(indexPath);
const routes = new Set();

const generalRoutes = [
  "/",
  "/overview",
  "/getting-started",
  "/components",
  "/architecture",
  "/tokens",
  "/theming",
  "/quality",
  "/release",
  "/layout",
  "/accessibility"
];

for (const route of generalRoutes) {
  addRoute(routes, route);
}

const sidebar = readText(sidebarPath);
const hrefs = [...sidebar.matchAll(/href["']?\s*:\s*["']([^"']+)["']/g)]
  .map((match) => match[1])
  .filter((href) => href.startsWith("/"));

for (const href of hrefs) {
  addRoute(routes, href);

  if (href.startsWith("/components/")) {
    const slug = cleanRoute(href).replace("/components/", "");
    const compact = kebabToCompactAlias(slug);

    if (compact && compact !== slug) {
      addRoute(routes, `/components/${compact}`);
    }
  }
}

const written = [];
const uniqueCleanRoutes = [...routes]
  .map(cleanRoute)
  .filter((route, index, all) => all.indexOf(route) === index)
  .sort((a, b) => a.localeCompare(b));

for (const route of uniqueCleanRoutes) {
  const outPath = routeToIndexPath(route);
  writeText(outPath, indexHtml);
  written.push(route);
}

writeText(join(distRoot, "404.html"), indexHtml);

const assetMatch = indexHtml.match(/assets\/index-[^"]+\.js/);
const asset = assetMatch ? assetMatch[0] : "";

const deployInfoPath = join(distRoot, "noctra-deploy-info.json");
let deployInfo = {};

if (existsSync(deployInfoPath)) {
  try {
    deployInfo = JSON.parse(readText(deployInfoPath));
  } catch {
    deployInfo = {};
  }
}

deployInfo = {
  ...deployInfo,
  generatedAt: new Date().toISOString(),
  sha: process.env.GITHUB_SHA || deployInfo.sha || "",
  asset: asset || deployInfo.asset || "",
  base: process.env.GITHUB_PAGES_BASE || deployInfo.base || "/noctra/",
  routeFallbacks: written
};

writeText(deployInfoPath, JSON.stringify(deployInfo, null, 2));

const important = [
  "/overview",
  "/overview/",
  "/getting-started",
  "/getting-started/",
  "/accessibility",
  "/accessibility/",
  "/components/button",
  "/components/button/",
  "/components/listbox",
  "/components/listbox/"
];

const problems = [];

for (const route of important) {
  const outPath = routeToIndexPath(route);

  if (!existsSync(outPath)) {
    problems.push(`Missing generated fallback: ${route} -> ${outPath}`);
  }
}

if (!asset) {
  problems.push("Could not detect Vite JS asset from index.html.");
}

const report = [
  "# Static Route Fallbacks Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Routes written: ${written.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Important generated routes",
  "",
  ...important.map((route) => `- ${route}`),
  "",
  "## Applied",
  "",
  "- Rebuilt static route fallback generator with explicit general docs routes.",
  "- Added /overview, /getting-started and /accessibility fallbacks.",
  "- Preserved all component route fallbacks from docsSidebarLinks.",
  "- Added compact component aliases such as /components/listbox and /components/textinput.",
  "- Recreated 404.html as SPA fallback.",
  "- Added routeFallbacks into noctra-deploy-info.json."
].join("\n");

writeText(reportPath, report);

console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
