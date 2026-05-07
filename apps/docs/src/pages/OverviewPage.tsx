import { Grid, Stack } from "@noctra/react";
import { GroupSummary, PageHero, StatCard, DocCard, CodeBlock } from "../components/DocsChrome";
import { noctraDocsSummary } from "../generated/noctra-professional-docs.generated";

export function OverviewPage() {
  return (
    <Stack gap="1.5rem">
      <PageHero
        eyebrow="Professional documentation"
        title="Noctra is documented as a real component library, not a starter template."
        description="This docs app is generated from the package source tree and rendered with Noctra primitives. It validates components, props, anatomy, tokens, package exports, release gates, and publish readiness before GitHub release."
      >
        <GroupSummary />
      </PageHero>

      <Grid columns={4} gap="1rem">
        <StatCard label="Components" value={noctraDocsSummary.componentCount} description="React component directories" />
        <StatCard label="Props" value={noctraDocsSummary.propCount} description="Extracted from type files" />
        <StatCard label="Tokens" value={noctraDocsSummary.tokenCount} description="Component CSS variables" />
        <StatCard label="Groups" value={noctraDocsSummary.groupCount} description="Documentation categories" />
      </Grid>

      <Grid columns={2} gap="1rem">
        <DocCard
          title="Docs are source-aware"
          description="Component pages are generated from packages/react, packages/styles, and packages/tokens."
        >
          <CodeBlock>{`packages/react/src/components/Button/Button.types.ts
packages/react/src/components/Button/Button.anatomy.ts
packages/styles/src/components/button.css
packages/tokens/src/components/button.ts`}</CodeBlock>
        </DocCard>

        <DocCard
          title="Docs are package-aware"
          description="Each component page documents public imports and package entry conventions."
        >
          <CodeBlock>{`import { Button } from "@noctra/react";
import "@noctra/styles/components/button.css";

// Optional package entry:
import { Button } from "@noctra/react/button";`}</CodeBlock>
        </DocCard>
      </Grid>
    </Stack>
  );
}