const { existsSync, readFileSync, writeFileSync } = require("node:fs");

const cssPath = "apps/docs/src/docs.css";
const reportPath = "remove-examples-bottom-tail-reset-css-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const before = readText(cssPath);

const cssBlock = `
/* REMOVE_EXAMPLES_BOTTOM_TAIL_RESET_CSS_START */

/* Hide examples tab/button/anchor/section if any exists */
#examples,
[id="examples"],
[href="#examples"],
[aria-controls*="examples" i],
[data-section="examples"],
[data-panel="examples"],
[data-tab="examples"],
[data-value="examples"],
[value="examples"],
button[data-value="examples"],
button[value="examples"],
.nmx-examples,
.ncd-examples,
.ncd2-examples,
.ncd3-examples,
.ncu-examples,
.ncu-example-grid,
.ncu-example-card,
.ncd-example-grid,
.ncd-example-card,
.nmx-example-grid,
.nmx-example-card,
.ncd-docs-examples,
.ncd-page-examples {
  display: none !important;
}

/* Hide content after examples when a stable examples marker exists */
#examples ~ *,
[id="examples"] ~ *,
[data-section="examples"] ~ *,
[data-panel="examples"] ~ *,
.nmx-examples ~ *,
.ncd-examples ~ *,
.ncd2-examples ~ *,
.ncd3-examples ~ *,
.ncu-examples ~ *,
.ncd-docs-examples ~ *,
.ncd-page-examples ~ * {
  display: none !important;
}

/* Hide Previous / Next navigation */
.nmx-prev-next,
.ncd-prev-next,
.ncd2-prev-next,
.ncd3-prev-next,
.nd-prev-next,
.ncd-docs-prev-next,
.ncd-page-prev-next,
.nmx-previous-next,
.ncd-previous-next,
.ncd2-previous-next,
.ncd3-previous-next,
[class*="previous-next"],
[class*="prev-next"] {
  display: none !important;
}

/* Hide bottom duplicate divider leftovers */
.nmx-content > hr:last-child,
.nmx-content > hr:nth-last-child(2),
.nmx-static-content > hr:last-child,
.nmx-static-content > hr:nth-last-child(2),
.ncd-content > hr:last-child,
.ncd-content > hr:nth-last-child(2),
.ncd2-content > hr:last-child,
.ncd2-content > hr:nth-last-child(2),
.ncd3-content > hr:last-child,
.ncd3-content > hr:nth-last-child(2),
.ncd-docs-main > hr:last-child,
.ncd-docs-main > hr:nth-last-child(2),
.nmx-main > hr:last-child,
.nmx-main > hr:nth-last-child(2),
.nmx-main > .nmx-divider:last-child,
.nmx-main > .nmx-divider:nth-last-child(2),
.ncd-docs-main > .ncd-divider:last-child,
.ncd-docs-main > .ncd-divider:nth-last-child(2) {
  display: none !important;
}

/* Reduce bottom tail spacing */
.nmx-content,
.nmx-static-content,
.ncd-content,
.ncd2-content,
.ncd3-content,
.ncd-docs-main,
.nmx-main {
  padding-bottom: 32px !important;
}

/* REMOVE_EXAMPLES_BOTTOM_TAIL_RESET_CSS_END */
`;

const pattern = /\/\* REMOVE_EXAMPLES_BOTTOM_TAIL_RESET_CSS_START \*\/[\s\S]*?\/\* REMOVE_EXAMPLES_BOTTOM_TAIL_RESET_CSS_END \*\//;

const after = pattern.test(before)
  ? before.replace(pattern, cssBlock.trim())
  : `${before.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, after);

const problems = [];

for (const marker of [
  "REMOVE_EXAMPLES_BOTTOM_TAIL_RESET_CSS_START",
  "#examples ~ *",
  '[class*="prev-next"]',
  "nth-last-child(2)",
  "display: none !important"
]) {
  if (!after.includes(marker)) {
    problems.push(`Missing CSS marker: ${marker}`);
  }
}

const report = [
  "# Remove Examples Bottom Tail Reset CSS Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `docs.css changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Reset failed partial TSX/CSS tail patches from git HEAD.",
  "- Did not modify TSX structure.",
  "- Added CSS-only guard to hide Examples.",
  "- Added CSS-only guard to hide content after Examples when marker exists.",
  "- Added CSS-only guard to hide Previous / Next.",
  "- Added CSS-only guard to hide bottom duplicate dividers."
].join("\n");

writeText(reportPath, report);
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
