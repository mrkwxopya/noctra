import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const distRoot = "apps/docs/dist";
const indexPath = join(distRoot, "index.html");
const sidebarPath = "apps/docs/src/data/docsSidebarLinks.ts";
const reportPath = "static-route-fallbacks-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  writeFileSync(path, content, "utf8");
}

function cleanRoute(route) {
  const value = String(route || "").trim();

  if (!value || value === "/") return "/";

  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

function addRoute(routes, route) {
  routes.add(cleanRoute(route));
}

if (!existsSync(indexPath)) {
  throw new Error(`${indexPath} bulunamadı. Önce docs build çalışmalı.`);
}

const indexHtml = readText(indexPath);
const sidebar = readText(sidebarPath);

const routes = new Set();

for (const route of [
  "/",
  "/components",
  "/architecture",
  "/theming",
  "/tokens",
  "/quality",
  "/release"
]) {
  addRoute(routes, route);
}

for (const match of sidebar.matchAll(/href:\s*["']([^"']+)["']/g)) {
  addRoute(routes, match[1]);
}

for (const match of sidebar.matchAll(/"href":\s*"([^"]+)"/g)) {
  addRoute(routes, match[1]);
}

const aliases = {
  "/components/listbox": "/components/list-box",
  "/components/creditcard": "/components/credit-card",
  "/components/pincode": "/components/pin-code",
  "/components/pininput": "/components/pin-input",
  "/components/textinput": "/components/text-input",
  "/components/searchinput": "/components/search-input",
  "/components/passwordinput": "/components/password-input",
  "/components/numberinput": "/components/number-input",
  "/components/iconbutton": "/components/icon-button",
  "/components/codeblock": "/components/code-block",
  "/components/datagrid": "/components/data-grid",
  "/components/hovercard": "/components/hover-card",
  "/components/contextmenu": "/components/context-menu",
  "/components/multiselect": "/components/multi-select",
  "/components/nativeselect": "/components/native-select",
  "/components/rangeslider": "/components/range-slider",
  "/components/tableofcontents": "/components/table-of-contents",
  "/components/transferlist": "/components/transfer-list",
  "/components/treeselect": "/components/tree-select",
  "/components/treeview": "/components/tree-view",
  "/components/visuallyhidden": "/components/visually-hidden"
};

for (const alias of Object.keys(aliases)) {
  addRoute(routes, alias);
}

const written = [];

for (const route of [...routes].sort()) {
  if (route === "/") continue;

  const target = join(distRoot, route.replace(/^\/+/, ""), "index.html");
  writeText(target, indexHtml);
  written.push(target.replace(/\\/g, "/"));
}

writeText(join(distRoot, "404.html"), indexHtml);

const deployInfoPath = join(distRoot, "noctra-deploy-info.json");

let asset = "";
const assetMatch = indexHtml.match(/assets\/index-[^"]+\.js/);

if (assetMatch) {
  asset = assetMatch[0];
}

const info = {
  generatedAt: new Date().toISOString(),
  sha: process.env.GITHUB_SHA || "",
  asset,
  base: process.env.GITHUB_PAGES_BASE || "/noctra/",
  routeFallbacks: written.map((file) => file.replace(/^apps\/docs\/dist/, ""))
};

writeText(deployInfoPath, `${JSON.stringify(info, null, 2)}\n`);

const problems = [];

for (const required of [
  "apps/docs/dist/404.html",
  "apps/docs/dist/components/index.html",
  "apps/docs/dist/components/button/index.html",
  "apps/docs/dist/components/card/index.html",
  "apps/docs/dist/components/list-box/index.html",
  "apps/docs/dist/components/listbox/index.html",
  "apps/docs/dist/components/text-input/index.html",
  "apps/docs/dist/components/textinput/index.html"
]) {
  if (!existsSync(required)) {
    problems.push(`Missing generated fallback: ${required}`);
  }
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
  "- /components",
  "- /components/button",
  "- /components/card",
  "- /components/list-box",
  "- /components/listbox",
  "- /components/text-input",
  "- /components/textinput",
  "",
  "## Applied",
  "",
  "- Copied Vite index.html into every docs route directory.",
  "- Copied Vite index.html into every component route directory.",
  "- Added alias route directories for non-canonical component slugs.",
  "- Recreated 404.html as SPA fallback.",
  "- Added routeFallbacks into noctra-deploy-info.json."
].join("\n");

writeText(reportPath, `${report}\n`);

console.log(`Static route fallbacks completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Static route fallbacks failed.");
}
