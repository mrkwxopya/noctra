import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const chrome = readText("apps/docs/src/components/DocsChrome.tsx");
const main = readText("apps/docs/src/main.tsx");
const css = readText("apps/docs/src/docs.css");

const problems = [];

if (!chrome.includes("window.scrollTo({")) {
  problems.push("AnchorList does not use window.scrollTo for smooth section navigation.");
}

if (!chrome.includes('behavior: "smooth"')) {
  problems.push("AnchorList smooth behavior is missing.");
}

if (chrome.includes('<a key={item.href} href={item.href}')) {
  problems.push("AnchorList still uses hash anchor links, which conflicts with hash router.");
}

if (!main.includes("Smooth scroll to top on route changes")) {
  problems.push("main.tsx route-change scroll-to-top effect is missing.");
}

if (!css.includes(".nd-anchor-list button")) {
  problems.push("docs.css is missing button styles for in-page navigation.");
}

const report = [
  "# Docs Smooth Navigation Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Interpretation",
  "",
  "- Right-side in-page navigation should scroll smoothly without changing the hash route.",
  "- Main sidebar route changes should scroll smoothly back to the top of the new page."
].join("\n");

writeFileSync("docs-smooth-navigation-audit-report.md", `${report}\n`, "utf8");

console.log(`Docs smooth navigation audit completed. Problems: ${problems.length}. Report: docs-smooth-navigation-audit-report.md`);

if (problems.length > 0) {
  throw new Error(`Docs smooth navigation audit failed with ${problems.length} problem(s).`);
}