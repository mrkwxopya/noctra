import { DocCard, GroupSummary, PageHero, StatCard, CodeBlock } from "../components/DocsChrome";
import { noctraDocsSummary } from "../generated/noctra-professional-docs.generated";

export function OverviewPage() {
  return (
    <div className="nd-page-stack">
      <PageHero
        eyebrow="Professional React UI library"
        title="Build production interfaces with Noctra."
        description="Noctra combines React components, CSS variables, design tokens, professional docs generation, package audits, and release gates into a single long-lived UI system."
      >
        <GroupSummary />
      </PageHero>

      <div className="nd-stats-grid">
        <StatCard label="Components" value={noctraDocsSummary.componentCount} description="Generated from source" />
        <StatCard label="Props" value={noctraDocsSummary.propCount} description="Extracted from types" />
        <StatCard label="Tokens" value={noctraDocsSummary.tokenCount} description="Mapped from token files" />
        <StatCard label="Groups" value={noctraDocsSummary.groupCount} description="Navigation categories" />
      </div>

      <div className="nd-two-grid">
        <DocCard title="Source-driven documentation" description="Component docs are generated from the actual React, style, and token package source." premium>
          <CodeBlock>{`packages/react/src/components
packages/styles/src/components
packages/tokens/src/components
apps/docs/src/generated/noctra-professional-docs.generated.ts`}</CodeBlock>
        </DocCard>

        <DocCard title="Release-grade quality gates" description="Noctra does not rely on manual confidence before publish. It ships with audit reports and final release decisions." premium>
          <CodeBlock>{`node scripts/audit-professional-docs.mjs
node scripts/final-quality-gate.mjs
node scripts/final-release-decision.mjs
node scripts/final-professional-docs-release-decision.mjs`}</CodeBlock>
        </DocCard>
      </div>

      <div className="nd-feature-grid">
        <DocCard title="Composable primitives" description="Layout, content, inputs, overlays, feedback, navigation, and data display components." />
        <DocCard title="Token-first styling" description="CSS variables, component tokens, variants, tones, radius, and density primitives." />
        <DocCard title="Documentation system" description="Generated component pages with props, imports, examples, anatomy, tokens, and related components." />
      </div>
    </div>
  );
}