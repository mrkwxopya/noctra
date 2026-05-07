import { AnchorList, CodeBlock, CoverageMeter, DataTable, DocCard, ExampleBlock, PageHero, ProPreview, SectionTitle, StatCard, TagList } from "../components/DocsChrome";
import { getComponentExamples } from "../data/componentExamples";
import { getCategoryLabel, getPropDescription } from "../data/propDescriptions";
import { noctraDocsComponents, type NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";

const componentPageAnchors = [
  { href: "#overview", label: "Overview", description: "Summary and score" },
  { href: "#imports", label: "Imports", description: "Usage patterns" },
  { href: "#showcase", label: "Showcase", description: "Examples" },
  { href: "#api", label: "Props API", description: "Typed API" },
  { href: "#tokens", label: "Tokens", description: "Design hooks" },
  { href: "#integration", label: "Integration", description: "Package status" },
  { href: "#related", label: "Related", description: "Same group" }
] as const;

function GeneratedExample({ component }: { component: NoctraDocsComponent }) {
  const code = `import { ${component.name} } from "@noctra/react";

export function Example() {
  return (
    <${component.name}>
      ${component.name} content
    </${component.name}>
  );
}`;

  return (
    <ExampleBlock
      title="Generated usage preview"
      description="This generated example documents the stable import and baseline JSX pattern. Curated demos can be added for richer behavior-specific examples."
      code={code}
      preview={<ProPreview componentName={component.name} group={component.group} description={component.description} />}
    />
  );
}

export function ComponentDetailPage({ component }: { component: NoctraDocsComponent }) {
  const examples = getComponentExamples(component.name);
  const relatedComponents = noctraDocsComponents.filter((item) => item.group === component.group && item.name !== component.name).slice(0, 8);

  const propRows = component.props.map((prop) => {
    const metadata = getPropDescription(component.name, prop.name);
    return [<code>{prop.name}</code>, getCategoryLabel(metadata.category), metadata.description, <code>{prop.type}</code>, prop.required ? "Required" : "Optional", prop.source];
  });

  const integrationRows = [
    ["React index", component.hasIndex ? "OK" : "Missing"],
    ["Types", component.hasTypes ? "OK" : "Missing"],
    ["Anatomy", component.hasAnatomy ? "OK" : "Missing"],
    ["Component CSS", component.hasStyle ? "OK" : "Missing"],
    ["Component tokens", component.hasTokens ? "OK" : "Missing"],
    ["Primary package", component.importPath],
    ["Component entry", component.packageEntry],
    ["Style entry", component.styleEntry],
    ["Token entry", component.tokenEntry]
  ];

  const apiCoverageMax = 5;
  const apiCoverageValue = [component.hasTypes, component.hasAnatomy, component.hasStyle, component.hasTokens, component.props.length > 0].filter(Boolean).length;

  return (
    <div className="nd-detail-layout">
      <div className="nd-detail-main">
        <PageHero eyebrow={component.group} title={component.name} description={component.description} />

        <section id="overview" className="nd-doc-section">
          <SectionTitle id="overview-title" eyebrow="Overview" title="Component summary" description="Generated from the React, style, token, and anatomy files." />
          <div className="nd-stats-grid">
            <StatCard label="Props" value={component.props.length} />
            <StatCard label="Variants" value={component.variants.length} />
            <StatCard label="Slots" value={component.anatomy.length} />
            <StatCard label="Tokens" value={component.tokens.length} />
          </div>
          <DocCard title="Documentation coverage" description="Source-backed docs readiness for this component." premium>
            <CoverageMeter label="Coverage" value={apiCoverageValue} max={apiCoverageMax} />
            <div className="nd-mini-grid">
              <span data-ok={component.hasTypes || undefined}>Types</span>
              <span data-ok={component.hasAnatomy || undefined}>Anatomy</span>
              <span data-ok={component.hasStyle || undefined}>CSS</span>
              <span data-ok={component.hasTokens || undefined}>Tokens</span>
              <span data-ok={component.props.length > 0 || undefined}>Props</span>
            </div>
          </DocCard>
        </section>

        <section id="imports" className="nd-doc-section">
          <SectionTitle id="imports-title" eyebrow="Imports" title="Import patterns" description="Use the named package import for normal application code." />
          <div className="nd-two-grid">
            <DocCard title="Primary import"><CodeBlock>{`import { ${component.name} } from "${component.importPath}";`}</CodeBlock></DocCard>
            <DocCard title="Component entry"><CodeBlock>{`import { ${component.name} } from "${component.packageEntry}";`}</CodeBlock></DocCard>
          </div>
        </section>

        <section id="showcase" className="nd-doc-section">
          <SectionTitle id="showcase-title" eyebrow="Showcase" title="Examples" description="Curated examples are shown when available. All components receive a polished generated usage preview." />
          <div className="nd-example-stack">
            {examples.length > 0 ? examples.map((example) => <ExampleBlock key={example.id} title={example.title} description={example.description} code={example.code} preview={example.preview} />) : <GeneratedExample component={component} />}
          </div>
        </section>

        <section id="api" className="nd-doc-section">
          <SectionTitle id="api-title" eyebrow="API" title="Props API" description="Professional prop table with category, description, TypeScript type, required state, and source interface." />
          <DocCard title="Props"><DataTable columns={["Prop", "Category", "Description", "Type", "Required", "Source"]} rows={propRows} /></DocCard>
        </section>

        <section id="tokens" className="nd-doc-section">
          <SectionTitle id="tokens-title" eyebrow="Tokens" title="Variants, anatomy, and tokens" description="Generated design hooks for styling and customization." />
          <div className="nd-two-grid">
            <DocCard title="Variants"><TagList items={component.variants} /></DocCard>
            <DocCard title="Anatomy"><TagList items={component.anatomy} /></DocCard>
            <DocCard title="Exported types"><TagList items={component.exportedTypes} /></DocCard>
            <DocCard title="Component tokens"><TagList items={component.tokens} /></DocCard>
          </div>
        </section>

        <section id="integration" className="nd-doc-section">
          <SectionTitle id="integration-title" eyebrow="Integration" title="Source and package integration" description="Confirms whether this component has the expected React, CSS, and token files." />
          <DocCard title="Integration status"><DataTable columns={["Area", "Status"]} rows={integrationRows} /></DocCard>
        </section>

        <section id="related" className="nd-doc-section">
          <SectionTitle id="related-title" eyebrow="Related" title={`More ${component.group} components`} description="Quick links to related generated docs." />
          <div className="nd-related-grid">
            {relatedComponents.map((item) => (
              <a key={item.name} className="nd-related-card" href={`#/components/${item.kebab}`}>
                <strong>{item.name}</strong>
                <span>{item.description}</span>
              </a>
            ))}
          </div>
        </section>
      </div>

      <aside className="nd-detail-aside">
        <AnchorList items={componentPageAnchors} />
      </aside>
    </div>
  );
}