import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const detailPath = "apps/docs/src/pages/ComponentDetailPage.tsx";
const mantinePath = "apps/docs/src/components/MantineStyleComponentDocs.tsx";
const reportPath = "universal-component-named-export-restore-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const beforePage = readText(pagePath);
const beforeDetail = readText(detailPath);
const beforeMantine = readText(mantinePath);

let page = beforePage;

if (!page.includes("export function UniversalComponentDocPage")) {
  if (page.includes("function UniversalComponentDocPage")) {
    page = page.replace("function UniversalComponentDocPage", "export function UniversalComponentDocPage");
  } else {
    throw new Error("UniversalComponentDocPage function not found.");
  }
}

if (!page.includes("export default ComponentDetailPage")) {
  if (page.includes("export default UniversalComponentDocPage")) {
    page = page.replace("export default UniversalComponentDocPage", "export default ComponentDetailPage");
  } else if (!page.includes("export default")) {
    page = `${page.trimEnd()}\n\nexport default ComponentDetailPage;\n`;
  }
}

if (!page.includes("export function ComponentDetailPage")) {
  page = page.replace(
    /export default ComponentDetailPage;\s*$/m,
    `export function ComponentDetailPage(props: UniversalComponentDocPageProps) {
  return <UniversalComponentDocPage {...props} />;
}

export default ComponentDetailPage;`
  );
}

const detail = `import ComponentDetailPageDefault, { UniversalComponentDocPage } from "./UniversalComponentDocPage";

export { UniversalComponentDocPage };

export const ComponentDetailPage = ComponentDetailPageDefault;

export default ComponentDetailPageDefault;
`;

const mantine = `import { UniversalComponentDocPage } from "../pages/UniversalComponentDocPage";

export type MantineStyleComponentDocsProps = {
  slug?: string;
  componentSlug?: string;
  component?: {
    slug?: string;
    kebab?: string;
    name?: string;
    description?: string;
    group?: string;
  };
  [key: string]: unknown;
};

export function MantineStyleComponentDocs(props: MantineStyleComponentDocsProps) {
  return <UniversalComponentDocPage {...props} />;
}

export default MantineStyleComponentDocs;
`;

writeText(pagePath, page);
writeText(detailPath, detail);
writeText(mantinePath, mantine);

const afterPage = readText(pagePath);
const afterDetail = readText(detailPath);
const afterMantine = readText(mantinePath);

const problems = [];

if (!afterPage.includes("export function UniversalComponentDocPage")) {
  problems.push("UniversalComponentDocPage named export missing.");
}

if (!afterPage.includes("export function ComponentDetailPage")) {
  problems.push("ComponentDetailPage named export missing in UniversalComponentDocPage.tsx.");
}

if (!afterPage.includes("export default ComponentDetailPage")) {
  problems.push("Default ComponentDetailPage export missing in UniversalComponentDocPage.tsx.");
}

if (!afterDetail.includes("import ComponentDetailPageDefault, { UniversalComponentDocPage }")) {
  problems.push("ComponentDetailPage wrapper import not restored.");
}

if (!afterMantine.includes("import { UniversalComponentDocPage }")) {
  problems.push("MantineStyleComponentDocs named import not restored.");
}

for (const [file, source] of [
  [pagePath, afterPage],
  [detailPath, afterDetail],
  [mantinePath, afterMantine]
]) {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Universal Component Named Export Restore Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `UniversalComponentDocPage changed: ${beforePage === afterPage ? "no" : "yes"}`,
  `ComponentDetailPage changed: ${beforeDetail === afterDetail ? "no" : "yes"}`,
  `MantineStyleComponentDocs changed: ${beforeMantine === afterMantine ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Restored UniversalComponentDocPage named export.",
  "- Restored ComponentDetailPage named export and default export compatibility.",
  "- Rebuilt ComponentDetailPage wrapper.",
  "- Rebuilt MantineStyleComponentDocs wrapper.",
  "- Preserved category-aware props/styles foundation from STEP 307B."
].join("\n");

writeText(reportPath, report);

console.log(`Universal component named export restore completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Universal component named export restore failed.");
}
