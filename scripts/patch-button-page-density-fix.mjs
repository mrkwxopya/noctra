import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/pages/ButtonReferencePage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceBetween(source, startMarker, endMarker, replacement) {
  const start = source.indexOf(startMarker);

  if (start === -1) {
    throw new Error(`Start marker not found: ${startMarker}`);
  }

  const end = source.indexOf(endMarker, start);

  if (end === -1) {
    throw new Error(`End marker not found: ${endMarker}`);
  }

  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

text = text.replace(
  /,\s*StatCard\s*/g,
  ""
);

text = text.replace(
  /,\s*StatCard/g,
  ""
);

text = text.replace(
  /StatCard,\s*/g,
  ""
);

text = text.replace(
`        <PageHero
          eyebrow="Core component"
          title="Button"
          description="Button is the primary action component in Noctra. This curated page is the visual and structural reference for the rest of the component documentation."
        >
          <div className="nd-stats-grid">
            <StatCard label="Package" value="react" />
            <StatCard label="Export" value="Button" />
            <StatCard label="API" value={\`\${component.props.length} props\`} />
            <StatCard label="Page" value="Curated" />
          </div>
        </PageHero>`,
`        <PageHero
          eyebrow="Core component"
          title="Button"
          description="Button is the primary action component in Noctra. This curated page is the visual and structural reference for the rest of the component documentation."
        />`
);

const usageStart = `        <section id="usage" className="nd-doc-section">`;

if (!text.includes("Reference summary")) {
  text = text.replace(
    usageStart,
`        <section className="nd-doc-section">
          <div className="nd-two-grid">
            <DocCard title="Reference summary">
              <p>Button is a compact action primitive with semantic tones, visual variants, predictable sizing, and clear interaction states.</p>
              <TagList items={["import: Button", "package: @noctra/react", \`\${component.props.length} props\`, "curated page"]} />
            </DocCard>

            <DocCard title="When to use">
              <ul>
                <li>Use for direct actions such as save, continue, submit, open, or delete.</li>
                <li>Use one primary button per decision area.</li>
                <li>Prefer secondary variants for supporting actions.</li>
              </ul>
            </DocCard>
          </div>
        </section>

${usageStart}`
  );
}

const playgroundOldStart = `        <section id="playground" className="nd-doc-section">`;
const playgroundOldEnd = `        <section id="variants" className="nd-doc-section">`;

const playgroundReplacement = `        <section id="playground" className="nd-doc-section">
          <SectionTitle
            id="playground-title"
            eyebrow="Playground"
            title="Configurator"
            description="Preview and code are generated from the same state. Default, empty, and unsupported props are omitted from the code output."
          />

          <div className="nd-two-grid">
            <DocCard title="Preview">
              <p>Current Button state.</p>
              <div className="nd-related-grid">
                <ButtonPreview state={state} />
              </div>
            </DocCard>

            <DocCard title="Code">
              <p>Updates when a control changes.</p>
              <CodeBlock>{code}</CodeBlock>
            </DocCard>
          </div>

          <section className="nd-doc-section">
            <SectionTitle
              id="playground-controls-title"
              eyebrow="Controls"
              title="Button-specific controls"
              description="Only Button-supported controls are shown. There is no generic Canvas, Density, or unrelated generated control."
            />

            <div className="nd-two-grid">
              <ControlGroup label="Variant" value={state.variant} options={variants} onChange={(variant) => setState((current) => ({ ...current, variant }))} />
              <ControlGroup label="Tone" value={state.tone} options={tones} onChange={(tone) => setState((current) => ({ ...current, tone }))} />
              <ControlGroup label="Size" value={state.size} options={sizes} onChange={(size) => setState((current) => ({ ...current, size }))} />
              <ControlGroup label="Radius" value={state.radius} options={radii} onChange={(radius) => setState((current) => ({ ...current, radius }))} />
              <ControlGroup label="Label" value={state.children} options={labels} onChange={(children) => setState((current) => ({ ...current, children }))} />
              <BooleanControl label="Disabled" checked={state.disabled} onChange={(disabled) => setState((current) => ({ ...current, disabled }))} />
              <BooleanControl label="Loading" checked={state.loading} onChange={(loading) => setState((current) => ({ ...current, loading }))} />
            </div>
          </section>
        </section>

`;

text = replaceBetween(text, playgroundOldStart, playgroundOldEnd, playgroundReplacement);

writeText(file, text);

console.log("Button page density fix patched.");