import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const foundationPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const buttonPath = "apps/docs/src/pages/ButtonReferencePage.tsx";
const cssPath = "apps/docs/src/docs.css";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let foundation = readText(foundationPath);
let button = readText(buttonPath);
let css = readText(cssPath);

if (!foundation) throw new Error(`Missing or empty ${foundationPath}`);
if (!button) throw new Error(`Missing or empty ${buttonPath}`);
if (!css) throw new Error(`Missing or empty ${cssPath}`);

const beforeFoundation = foundation;
const beforeButton = button;
const beforeCss = css;

foundation = foundation.replace(
`      {links && links.length > 0 ? (
        <DocsGrid>
          {links.map((link) => {
            const Wrapper = (link.href ? "a" : "div") as RuntimeComponent;

            return (
              <DocsBox
                key={\`\${link.label}-\${link.value}\`}
                as={Wrapper}
                className="ncd-card ncd-related-card"
                {...(link.href ? { href: link.href } : {})}
              >
                <strong>{link.label}</strong>
                <span>{link.value}</span>
              </DocsBox>
            );
          })}
        </DocsGrid>
      ) : null}`,
`      {links && links.length > 0 ? (
        <dl className="ncd-meta-list">
          {links.map((link) => {
            const ValueWrapper = (link.href ? "a" : "span") as RuntimeComponent;

            return (
              <div key={\`\${link.label}-\${link.value}\`} className="ncd-meta-row">
                <dt>{link.label}</dt>
                <dd>
                  <DocsBox as={ValueWrapper} {...(link.href ? { href: link.href } : {})}>
                    {link.value}
                  </DocsBox>
                </dd>
              </div>
            );
          })}
        </dl>
      ) : null}`
);

foundation = foundation.replace(
`  return (
    <DocsBox className="ncd-section" data-noctra-docs-system="tabs">
      <DocsGrid>
        {tabs.map((tab) => (
          <ButtonRuntime
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active === tab.value}
            variant={active === tab.value ? "filled" : "outline"}
            tone={active === tab.value ? "primary" : "neutral"}
            size="sm"
            radius="md"
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </ButtonRuntime>
        ))}
      </DocsGrid>
    </DocsBox>
  );`,
`  return (
    <DocsBox className="ncd-tabs" data-noctra-docs-system="tabs">
      {tabs.map((tab) => (
        <ButtonRuntime
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={active === tab.value}
          variant={active === tab.value ? "filled" : "outline"}
          tone={active === tab.value ? "primary" : "neutral"}
          size="sm"
          radius="md"
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </ButtonRuntime>
      ))}
    </DocsBox>
  );`
);

foundation = foundation.replace(
`          <DocsBox className="ncd-card ncd-related-card">
            <strong>Preview</strong>
            <DocsBox className="ncd-grid">{preview}</DocsBox>
          </DocsBox>

          <DocsBox className="ncd-card ncd-related-card">
            <strong>Code</strong>
            <NoctraCodeBlock code={code} />
          </DocsBox>`,
`          <DocsBox className="ncd-preview-panel">
            <strong>Preview</strong>
            <DocsBox className="ncd-preview-content">{preview}</DocsBox>
          </DocsBox>

          <DocsBox className="ncd-code-panel">
            <strong>Code</strong>
            <NoctraCodeBlock code={code} />
          </DocsBox>`
);

foundation = foundation.replace(
`    <DocsBox className="ncd-card ncd-related-card" data-noctra-docs-system="control-group">`,
`    <DocsBox className="ncd-control-card" data-noctra-docs-system="control-group">`
);

foundation = foundation.replace(
`    <DocsBox className="ncd-card ncd-related-card" data-noctra-docs-system="boolean-control">`,
`    <DocsBox className="ncd-control-card" data-noctra-docs-system="boolean-control">`
);

foundation = foundation.replace(
`    <DocsBox className="ncd-card ncd-related-card">
      <strong>{label}</strong>
      <span>{children}</span>
    </DocsBox>`,
`    <DocsBox className="ncd-example-line">
      <strong>{label}</strong>
      <span>{children}</span>
    </DocsBox>`
);

foundation = foundation.replace(
`  return (
    <DocsTwoGrid>
      {previous ? (
        <a className="ncd-card ncd-related-card" href={previous.href}>
          <span>Previous</span>
          <strong>{previous.label}</strong>
        </a>
      ) : (
        <DocsBox />
      )}

      {next ? (
        <a className="ncd-card ncd-related-card" href={next.href}>
          <span>Next</span>
          <strong>{next.label}</strong>
        </a>
      ) : null}
    </DocsTwoGrid>
  );`,
`  return (
    <nav className="ncd-prev-next">
      {previous ? (
        <a href={previous.href}>
          <span>Previous</span>
          <strong>{previous.label}</strong>
        </a>
      ) : (
        <span />
      )}

      {next ? (
        <a href={next.href}>
          <span>Next</span>
          <strong>{next.label}</strong>
        </a>
      ) : null}
    </nav>
  );`
);

foundation = foundation.replace(
`    <DocsCard data-noctra-docs-system="toc">
      <h3>Table of contents</h3>
      <DocsStack>
        {items.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </DocsStack>
    </DocsCard>`,
`    <nav className="ncd-toc" data-noctra-docs-system="toc">
      <h3>Table of contents</h3>
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>`
);

button = button.replace(
`      <NoctraDocsExampleGrid>
        {examples.map((example) => (
          <NoctraDocsExampleCard key={example.label} label={example.label}>
            <ButtonPreview state={example.state}>{example.state.children}</ButtonPreview>
          </NoctraDocsExampleCard>
        ))}
      </NoctraDocsExampleGrid>`,
`      <div className="ncd-example-list">
        {examples.map((example) => (
          <NoctraDocsExampleCard key={example.label} label={example.label}>
            <ButtonPreview state={example.state}>{example.state.children}</ButtonPreview>
          </NoctraDocsExampleCard>
        ))}
      </div>`
);

button = button.replace(
`        <NoctraDocsExampleGrid>
          {buttonStateExamples.map((example) => (
            <NoctraDocsExampleCard key={example.label} label={example.label}>
              <ButtonPreview state={example.state}>{example.state.children}</ButtonPreview>
            </NoctraDocsExampleCard>
          ))}
        </NoctraDocsExampleGrid>`,
`        <div className="ncd-example-list">
          {buttonStateExamples.map((example) => (
            <NoctraDocsExampleCard key={example.label} label={example.label}>
              <ButtonPreview state={example.state}>{example.state.children}</ButtonPreview>
            </NoctraDocsExampleCard>
          ))}
        </div>`
);

const cssBlock = '/* NOCTRA_MANTINE_LIKE_VISUAL_START */.ncd-layout{display:grid;grid-template-columns:minmax(0,720px) 210px;gap:38px;align-items:start;max-width:990px;margin:0 auto;padding:42px 24px 96px}.ncd-main{min-width:0}.ncd-aside{position:sticky;top:88px}.ncd-section{margin:0 0 34px}.ncd-section h1{font-size:42px;line-height:1.08;margin:7px 0 10px;letter-spacing:-.045em}.ncd-section h2{font-size:22px;line-height:1.22;margin:0 0 8px;letter-spacing:-.025em}.ncd-section h3{font-size:15px;margin:0 0 8px}.ncd-section p,.ncd-card p{font-size:14px;line-height:1.65;color:var(--nc-text-muted,#a7b2c3);max-width:680px}.ncd-kicker{font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--nc-color-primary-300,#9b7cff);font-weight:800;margin:0 0 8px}.ncd-meta-list{display:grid;grid-template-columns:120px minmax(0,1fr);gap:9px 14px;margin:24px 0 4px;max-width:520px}.ncd-meta-row{display:contents}.ncd-meta-row dt{color:var(--nc-text-muted,#a7b2c3);font-size:13px}.ncd-meta-row dd{margin:0;font-size:13px;color:var(--nc-text,#f8fafc)}.ncd-meta-row a{color:var(--nc-text,#f8fafc);text-decoration:none}.ncd-tabs{display:flex;gap:8px;align-items:center;margin:28px 0 34px;padding-bottom:16px;border-bottom:1px solid rgba(148,163,184,.18)}.ncd-card{border:1px solid rgba(148,163,184,.16);background:rgba(15,23,42,.42);border-radius:12px;padding:18px}.ncd-stack{display:flex;flex-direction:column;gap:14px}.ncd-grid{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.ncd-two-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start}.ncd-preview-panel,.ncd-code-panel{border:1px solid rgba(148,163,184,.14);border-radius:10px;padding:16px;min-height:150px;background:rgba(2,6,23,.18)}.ncd-preview-content{display:flex;gap:10px;align-items:center;justify-content:center;min-height:92px;flex-wrap:wrap}.ncd-code{display:block;overflow:auto;margin:10px 0 0;padding:14px;border-radius:10px;background:rgba(2,6,23,.78);border:1px solid rgba(148,163,184,.13);font-size:12px;line-height:1.58;color:#dbeafe}.ncd-control-card{border:1px solid rgba(148,163,184,.13);background:rgba(2,6,23,.22);border-radius:10px;padding:12px}.ncd-control-card>strong{display:block;margin-bottom:10px;font-size:12px}.ncd-control-card .ncd-grid{display:flex;gap:7px;flex-wrap:wrap}.ncd-control-card button{width:auto!important;min-width:auto!important;white-space:nowrap}.ncd-example-list{display:flex;flex-direction:column;border:1px solid rgba(148,163,184,.14);border-radius:12px;overflow:hidden;background:rgba(2,6,23,.16)}.ncd-example-line{display:grid;grid-template-columns:130px minmax(0,1fr);gap:16px;align-items:center;min-height:50px;padding:10px 14px;border-bottom:1px solid rgba(148,163,184,.12)}.ncd-example-line:last-child{border-bottom:0}.ncd-example-line strong{font-size:13px}.ncd-example-line span{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.ncd-table{width:100%;border-collapse:collapse;font-size:13px}.ncd-table th{text-align:left;font-weight:700;color:var(--nc-text,#f5f7fb);padding:11px;border-bottom:1px solid rgba(148,163,184,.18)}.ncd-table td{vertical-align:top;padding:11px;border-bottom:1px solid rgba(148,163,184,.11);color:var(--nc-text-muted,#a7b2c3)}.ncd-toc{border-left:1px solid rgba(148,163,184,.16);padding-left:16px;font-size:13px}.ncd-toc h3{font-size:13px;margin:0 0 10px;color:var(--nc-text,#fff)}.ncd-toc a{display:block;padding:6px 0;color:var(--nc-text-muted,#a7b2c3);text-decoration:none}.ncd-toc a:hover{color:var(--nc-text,#fff)}.ncd-prev-next{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:36px}.ncd-prev-next a{display:flex;flex-direction:column;gap:6px;border:1px solid rgba(148,163,184,.14);border-radius:10px;padding:14px;color:inherit;text-decoration:none;background:rgba(15,23,42,.38)}.ncd-prev-next span{color:var(--nc-text-muted,#a7b2c3);font-size:12px}@media (max-width:1180px){.ncd-layout{grid-template-columns:minmax(0,720px);max-width:760px}.ncd-aside{display:none}}@media (max-width:760px){.ncd-layout{padding:26px 14px}.ncd-two-grid{grid-template-columns:1fr}.ncd-section h1{font-size:34px}.ncd-meta-list{grid-template-columns:1fr}.ncd-example-line{grid-template-columns:1fr}}/* NOCTRA_MANTINE_LIKE_VISUAL_END */';

const blockPattern = /\/\* NOCTRA_MANTINE_LIKE_VISUAL_START \*\/[\s\S]*?\/\* NOCTRA_MANTINE_LIKE_VISUAL_END \*\//;
const previousBlockPattern = /\/\* NOCTRA_DOCS_SYSTEM_LAYOUT_START \*\/[\s\S]*?\/\* NOCTRA_DOCS_SYSTEM_LAYOUT_END \*\//;

if (blockPattern.test(css)) {
  css = css.replace(blockPattern, cssBlock);
} else if (previousBlockPattern.test(css)) {
  css = css.replace(previousBlockPattern, cssBlock);
} else {
  css = `${css.trimEnd()}\n${cssBlock}\n`;
}

writeText(foundationPath, foundation);
writeText(buttonPath, button);
writeText(cssPath, css);

const problems = [];

for (const snippet of [
  "ncd-meta-list",
  "ncd-tabs",
  "ncd-preview-panel",
  "ncd-code-panel",
  "ncd-control-card",
  "ncd-example-line",
  "ncd-prev-next",
  "ncd-toc"
]) {
  if (!foundation.includes(snippet) && !button.includes(snippet) && !css.includes(`.${snippet}`)) {
    problems.push(`Missing Mantine-like visual snippet: ${snippet}`);
  }
}

for (const snippet of [
  "className=\"ncd-card ncd-related-card\"",
  "className=\"ncd-card ncd-related-card\" href",
  "ncd-card ncd-related-card"
]) {
  if (foundation.includes(snippet) || button.includes(snippet)) {
    problems.push(`Old card-heavy snippet remains: ${snippet}`);
  }
}

for (const [file, source] of [
  [foundationPath, foundation],
  [buttonPath, button]
]) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX
    },
    reportDiagnostics: true,
    fileName: file
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Mantine-Like Docs Visual Structure Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Foundation changed: ${beforeFoundation === foundation ? "no" : "yes"}`,
  `Button page changed: ${beforeButton === button ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === css ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Fixed",
  "",
  "- Header metadata is now compact like Mantine docs.",
  "- Tabs are flatter and separated with a divider.",
  "- Demo preview/code panels are less card-heavy.",
  "- Examples are compact rows instead of oversized cards.",
  "- Right table of contents is styled like docs navigation.",
  "- Previous/next navigation is flatter."
].join("\n");

writeFileSync("mantine-like-docs-visual-structure-report.md", `${report}\n`, "utf8");

console.log(`Mantine-like docs visual structure patched. Problems: ${problems.length}. Report: mantine-like-docs-visual-structure-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Mantine-like docs visual structure patch failed.");
}