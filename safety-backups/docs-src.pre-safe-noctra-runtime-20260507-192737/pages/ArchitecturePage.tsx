import { CodeBlock, DataTable, DocCard, PageHero, SectionTitle, StatCard } from "../components/DocsChrome";

const packageRows = [
  ["@noctra/react", "React components", "packages/react", "Public component API"],
  ["@noctra/styles", "CSS package", "packages/styles", "Base styles and component CSS"],
  ["@noctra/tokens", "Design tokens", "packages/tokens", "Shared system and component tokens"],
  ["@noctra/utils", "Utilities", "packages/utils", "Shared helpers and internal primitives"],
  ["@noctra/docs", "Documentation app", "apps/docs", "Professional generated docs site"]
];

const boundaryRows = [
  ["React", "Can consume tokens, styles, and utils", "Must not depend on docs"],
  ["Styles", "Can expose CSS entry points", "Must not depend on React runtime"],
  ["Tokens", "Can expose serializable token maps", "Must stay framework-safe"],
  ["Utils", "Can expose framework-neutral helpers", "Must avoid UI package coupling"],
  ["Docs", "Can consume every package", "Must not be imported by packages"]
];

export function ArchitecturePage() {
  return (
    <div className="nd-page-stack">
      <PageHero
        eyebrow="Architecture"
        title="A package architecture designed for long-lived UI systems."
        description="Noctra is organized as a multi-package workspace where React components, CSS, tokens, utilities, and documentation are validated independently before release."
      />

      <div className="nd-stats-grid">
        <StatCard label="Workspace packages" value="5" description="React, styles, tokens, utils, docs" />
        <StatCard label="Publishable packages" value="4" description="Docs app stays private" />
        <StatCard label="Component folders" value="119" description="Generated from source tree" />
        <StatCard label="Release gates" value="10+" description="Build, export, pack, and docs audits" />
      </div>

      <section className="nd-doc-section">
        <SectionTitle
          id="package-model"
          eyebrow="Package model"
          title="Workspace package responsibilities"
          description="Each package has a focused role. This keeps the system easier to build, publish, debug, and evolve."
        />

        <DocCard title="Package matrix" premium>
          <DataTable columns={["Package", "Role", "Path", "Responsibility"]} rows={packageRows} />
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="boundaries"
          eyebrow="Boundaries"
          title="Dependency boundary rules"
          description="The docs app can consume everything, but library packages must remain clean and publishable."
        />

        <DocCard title="Boundary matrix">
          <DataTable columns={["Package area", "Allowed", "Constraint"]} rows={boundaryRows} />
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="source-tree"
          eyebrow="Source tree"
          title="Recommended repository structure"
          description="Noctra keeps source, generated artifacts, reports, and docs in predictable locations."
        />

        <div className="nd-two-grid">
          <DocCard title="Library packages">
            <CodeBlock>{`packages/
  react/
    src/components/
    src/components/index.ts
    package.json
  styles/
    src/index.css
    src/components.css
    src/components/*.css
  tokens/
    src/index.ts
    src/components/*.ts
  utils/
    src/index.ts`}</CodeBlock>
          </DocCard>

          <DocCard title="Docs and gates">
            <CodeBlock>{`apps/
  docs/
    src/pages/
    src/components/
    src/generated/

scripts/
  generate-professional-docs-data.mjs
  audit-professional-docs.mjs
  final-quality-gate.mjs
  final-release-decision.mjs`}</CodeBlock>
          </DocCard>
        </div>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="export-strategy"
          eyebrow="Exports"
          title="Public API strategy"
          description="Noctra should support stable package-level imports and component-level entry points."
        />

        <div className="nd-two-grid">
          <DocCard title="Recommended import">
            <CodeBlock>{`import { Button, Card, Stack } from "@noctra/react";
import "@noctra/styles";`}</CodeBlock>
          </DocCard>

          <DocCard title="Component entry">
            <CodeBlock>{`import { Button } from "@noctra/react/button";
import "@noctra/styles/components/button.css";`}</CodeBlock>
          </DocCard>
        </div>
      </section>
    </div>
  );
}