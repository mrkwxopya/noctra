import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/components/InteractiveComponentDemo.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const before = text;

if (!text.includes("function getPreviewSizing")) {
  text = text.replace(
    /function cleanRuntimeProps\(props: Record<string, unknown>\) \{/,
    `function getPreviewSizing(component: NoctraDocsComponent) {
  const preset = getInteractiveDemoPreset(component);
  const width = typeof preset?.previewWidth === "number" ? preset.previewWidth : undefined;
  const height = typeof preset?.previewHeight === "number" ? preset.previewHeight : undefined;

  return {
    width,
    height
  };
}

function cleanRuntimeProps(props: Record<string, unknown>) {`
  );
}

if (!text.includes("const previewSizing = useMemo")) {
  text = text.replace(
    /const code = useMemo\(\(\) => \{\s*return getInteractiveDemoCode\(component, state\);\s*\}, \[component, state\]\);/,
    `const code = useMemo(() => {
    return getInteractiveDemoCode(component, state);
  }, [component, state]);

  const previewSizing = useMemo(() => getPreviewSizing(component), [component]);`
  );
}

text = text.replace(
  /\{activeTab === "preview" \? <PreviewFrame>\{preview\}<\/PreviewFrame> : null\}/,
  `{activeTab === "preview" ? (
          <PreviewFrame>
            <div
              style={{
                width: previewSizing.width ? \`\${previewSizing.width}px\` : "fit-content",
                maxWidth: "100%",
                minHeight: previewSizing.height ? \`\${previewSizing.height}px\` : undefined
              }}
            >
              {preview}
            </div>
          </PreviewFrame>
        ) : null}`
);

writeText(file, text);

const changed = before !== text;
const remainingProblems = [];

for (const snippet of ["getPreviewSizing", "previewSizing.width", "fit-content", "previewSizing.height"]) {
  if (!text.includes(snippet)) {
    remainingProblems.push(`Missing snippet: ${snippet}`);
  }
}

const report = [
  "# Interactive Demo Preview Sizing Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${changed ? "yes" : "no"}`,
  `Problems found: ${remainingProblems.length}`,
  "",
  "## Problems",
  "",
  ...(remainingProblems.length > 0 ? remainingProblems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("interactive-demo-preview-sizing-report.md", `${report}\n`, "utf8");

console.log(`Interactive demo preview sizing patched. Changed: ${changed}. Problems: ${remainingProblems.length}. Report: interactive-demo-preview-sizing-report.md`);

if (remainingProblems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo preview sizing patch failed.");
}