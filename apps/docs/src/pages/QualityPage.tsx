import { Grid, Stack } from "@noctra/react";
import { CodeBlock, DocCard, PageHero } from "../components/DocsChrome";

const gates = [
  "verify-json",
  "component export auto-heal",
  "component prop conflict auto-heal",
  "docs component registry generation",
  "react component smoke export",
  "token component smoke export",
  "style component smoke export",
  "component inventory audit",
  "package entry point audit",
  "dist artifact audit",
  "npm pack dry-run audit",
  "final release decision"
];

export function QualityPage() {
  return (
    <Stack gap="1.5rem">
      <PageHero
        eyebrow="Quality gates"
        title="Noctra release gates"
        description="Quality gates are part of the library, not an afterthought. Docs should explain what is checked and which report files must be inspected before publishing."
      />

      <Grid columns={2} gap="1rem">
        {gates.map((gate) => (
          <DocCard key={gate} title={gate} description="Tracked in scripts and generated reports." />
        ))}
      </Grid>

      <DocCard title="Core validation command sequence">
        <CodeBlock>{`node scripts/verify-json.mjs
pnpm --filter @noctra/react build
pnpm --filter @noctra/styles build
pnpm --filter @noctra/tokens build
pnpm --filter @noctra/docs build
node scripts/final-quality-gate.mjs
node scripts/final-release-decision.mjs`}</CodeBlock>
      </DocCard>
    </Stack>
  );
}