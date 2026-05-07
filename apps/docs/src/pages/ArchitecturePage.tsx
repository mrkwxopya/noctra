import { Grid, Stack } from "@noctra/react";
import { CodeBlock, DocCard, PageHero } from "../components/DocsChrome";

export function ArchitecturePage() {
  return (
    <Stack gap="1.5rem">
      <PageHero
        eyebrow="Architecture"
        title="Package boundaries and public API shape"
        description="Noctra is split into React components, styles, tokens, and utilities. The docs verify that public exports, component entry points, and generated artifacts remain aligned."
      />

      <Grid columns={2} gap="1rem">
        <DocCard title="@noctra/react" description="React component package.">
          <CodeBlock>{`packages/react/src/components
packages/react/src/components/index.ts
packages/react/package.json exports
packages/react/dist`}</CodeBlock>
        </DocCard>

        <DocCard title="@noctra/styles" description="CSS package and component style entry points.">
          <CodeBlock>{`packages/styles/src/index.css
packages/styles/src/components.css
packages/styles/src/components/*.css
packages/styles/package.json exports`}</CodeBlock>
        </DocCard>

        <DocCard title="@noctra/tokens" description="Token package with generated smoke checks.">
          <CodeBlock>{`packages/tokens/src/index.ts
packages/tokens/src/components/*.ts
packages/tokens/src/generated/component-token-smoke.generated.ts`}</CodeBlock>
        </DocCard>

        <DocCard title="@noctra/utils" description="Shared utility package for future stable helpers.">
          <CodeBlock>{`packages/utils/src
packages/utils/dist
pnpm --filter @noctra/utils build`}</CodeBlock>
        </DocCard>
      </Grid>
    </Stack>
  );
}