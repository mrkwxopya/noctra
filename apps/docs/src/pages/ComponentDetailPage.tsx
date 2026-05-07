import { Grid, Stack } from "@noctra/react";
import {
  AnchorList,
  CodeBlock,
  CoverageMeter,
  DataTable,
  DocCard,
  ExampleBlock,
  PageHero,
  SectionTitle,
  StatCard,
  TagList
} from "../components/DocsChrome";
import { getComponentExamples, getFallbackExample } from "../data/componentExamples";
import { getCategoryLabel, getPropDescription } from "../data/propDescriptions";
import { noctraDocsComponents } from "../generated/noctra-professional-docs.generated";
import type { NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";

const componentPageAnchors = [
  {
    href: "#overview",
    label: "Overview",
    description: "Component summary and API score"
  },
  {
    href: "#imports",
    label: "Imports",
    description: "Package import patterns"
  },
  {
    href: "#showcase",
    label: "Showcase",
    description: "Preview and copyable code"
  },
  {
    href: "#api",
    label: "Props API",
    description: "Typed props and descriptions"
  },
  {
    href: "#tokens",
    label: "Tokens",
    description: "CSS variables and anatomy"
  },
  {
    href: "#integration",
    label: "Integration",
    description: "Source and package status"
  },
  {
    href: "#related",
    label: "Related",
    description: "Same-group components"
  }
] as const;

export function ComponentDetailPage({ component }: { component: NoctraDocsComponent }) {
  const examples = getComponentExamples(component.name);
  const renderedExamples = examples.length > 0 ? examples : [getFallbackExample(component.name)];
  const relatedComponents = noctraDocsComponents
    .filter((item) => item.group === component.group && item.name !== component.name)
    .slice(0, 8);

  const propRows = component.props.map((prop) => {
    const metadata = getPropDescription(component.name, prop.name);

    return [
      <code>{prop.name}</code>,
      getCategoryLabel(metadata.category),
      metadata.description,
      <code>{prop.type}</code>,
      prop.required ? "Required" : "Optional",
      prop.source
    ];
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
  const apiCoverageValue = [
    component.hasTypes,
    component.hasAnatomy,
    component.hasStyle,
    component.hasTokens,
    component.props.length > 0
  ].filter(Boolean).length;

  return (
    <div className="nd-detail-layout">
      <aside className="nd-detail-aside">
        <AnchorList items={componentPageAnchors} />
      </aside>

      <Stack gap="1.5rem">
        <PageHero
          eyebrow={component.group}
          title={component.name}
          description={component.description}
        />

        <section id="overview" className="nd-doc-section">
          <SectionTitle
            id="overview-title"
            eyebrow="Overview"
            title="Component summary"
            description="High-level component facts generated from the React, style, and token packages."
          />

          <Grid columns={4} gap="1rem">
            <StatCard label="Props" value={component.props.length} />
            <StatCard label="Variants" value={component.variants.length} />
            <StatCard label="Anatomy slots" value={component.anatomy.length} />
            <StatCard label="Tokens" value={component.tokens.length} />
          </Grid>

          <DocCard title="API coverage" description="Generated quality snapshot for this component documentation page.">
            <Stack gap="0.75rem">
              <CoverageMeter label="Documentation coverage" value={apiCoverageValue} max={apiCoverageMax} />
              <div className="nd-mini-grid">
                <span data-ok={component.hasTypes || undefined}>Types</span>
                <span data-ok={component.hasAnatomy || undefined}>Anatomy</span>
                <span data-ok={component.hasStyle || undefined}>CSS</span>
                <span data-ok={component.hasTokens || undefined}>Tokens</span>
                <span data-ok={component.props.length > 0 || undefined}>Props</span>
              </div>
            </Stack>
          </DocCard>
        </section>

        <section id="imports" className="nd-doc-section">
          <SectionTitle
            id="imports-title"
            eyebrow="Imports"
            title="Import patterns"
            description="Use named imports for normal app development. Component entries are available for package-level workflows."
          />

          <Grid columns={2} gap="1rem">
            <DocCard title="Primary import" description="Recommended public package import.">
              <CodeBlock>{`import { ${component.name} } from "${component.importPath}";`}</CodeBlock>
            </DocCard>

            <DocCard title="Component entry" description="Optional per-component package entry.">
              <CodeBlock>{`import { ${component.name} } from "${component.packageEntry}";`}</CodeBlock>
            </DocCard>
          </Grid>
        </section>

        <section id="showcase" className="nd-doc-section">
          <SectionTitle
            id="showcase-title"
            eyebrow="Showcase"
            title="Live examples"
            description="Curated examples are rendered as live previews with copyable source code."
          />

          <Stack gap="1rem">
            {renderedExamples.map((example) => (
              <ExampleBlock
                key={example.id}
                title={example.title}
                description={example.description}
                code={example.code}
                preview={example.preview}
              />
            ))}
          </Stack>
        </section>

        <section id="api" className="nd-doc-section">
          <SectionTitle
            id="api-title"
            eyebrow="API"
            title="Props API"
            description="Professional prop table with category, description, TypeScript type, required state, and source interface."
          />

          <DocCard title="Props">
            <DataTable columns={["Prop", "Category", "Description", "Type", "Required", "Source"]} rows={propRows} />
          </DocCard>
        </section>

        <section id="tokens" className="nd-doc-section">
          <SectionTitle
            id="tokens-title"
            eyebrow="Tokens"
            title="Variants, anatomy, and component tokens"
            description="Generated from component type, anatomy, and token files."
          />

          <Grid columns={2} gap="1rem">
            <DocCard title="Variants">
              <TagList items={component.variants} />
            </DocCard>

            <DocCard title="Anatomy">
              <TagList items={component.anatomy} />
            </DocCard>

            <DocCard title="Exported types">
              <TagList items={component.exportedTypes} />
            </DocCard>

            <DocCard title="Component tokens">
              <TagList items={component.tokens} />
            </DocCard>
          </Grid>
        </section>

        <section id="integration" className="nd-doc-section">
          <SectionTitle
            id="integration-title"
            eyebrow="Integration"
            title="Source and package integration"
            description="Confirms whether this component has the expected React, CSS, and token files."
          />

          <DocCard title="Integration status">
            <DataTable columns={["Area", "Status"]} rows={integrationRows} />
          </DocCard>
        </section>

        <section id="related" className="nd-doc-section">
          <SectionTitle
            id="related-title"
            eyebrow="Related"
            title={`More ${component.group} components`}
            description="Quick links to other components from the same documentation group."
          />

          <Grid columns={4} gap="1rem">
            {relatedComponents.length > 0 ? (
              relatedComponents.map((item) => (
                <a key={item.name} className="nd-related-card" href={`#/components/${item.kebab}`}>
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </a>
              ))
            ) : (
              <DocCard title="No related components" description="This component is currently the only item in its group." />
            )}
          </Grid>
        </section>
      </Stack>
    </div>
  );
}