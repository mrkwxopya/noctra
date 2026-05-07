import { Grid, Stack } from "@noctra/react";
import { CodeBlock, DocCard, PageHero } from "../components/DocsChrome";

export function ReleasePage() {
  return (
    <Stack gap="1.5rem">
      <PageHero
        eyebrow="Release"
        title="GitHub and npm release readiness"
        description="This page documents the final publish flow. It should be used together with FINAL_RELEASE_DECISION.md, PUBLISH_CHECKLIST.md, and RELEASE_NOTES.md."
      />

      <Grid columns={2} gap="1rem">
        <DocCard title="GitHub publish">
          <CodeBlock>{`git status
git add .
git commit -m "Prepare Noctra docs and release gates"
git push -u origin main`}</CodeBlock>
        </DocCard>

        <DocCard title="npm publish">
          <CodeBlock>{`pnpm --filter @noctra/utils publish --access public --no-git-checks
pnpm --filter @noctra/tokens publish --access public --no-git-checks
pnpm --filter @noctra/styles publish --access public --no-git-checks
pnpm --filter @noctra/react publish --access public --no-git-checks`}</CodeBlock>
        </DocCard>
      </Grid>

      <DocCard title="Do not publish if">
        <CodeBlock>{`- TypeScript build fails
- Docs build fails
- Package entry audit reports missing files
- Dist artifact audit reports problems
- npm pack dry-run reports problems
- FINAL_RELEASE_DECISION is BLOCKED_FINAL_HARD_GATE
- professional-docs-audit-report.md reports problems`}</CodeBlock>
      </DocCard>
    </Stack>
  );
}