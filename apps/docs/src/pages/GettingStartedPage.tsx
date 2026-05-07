import { Grid, Stack } from "@noctra/react";
import { CodePanel, DocsSection, InfoCard, PageIntro } from "../components/DocsShell";

export function GettingStartedPage() {
  return (
    <Stack gap="1.5rem">
      <PageIntro
        eyebrow="Getting started"
        title="Install and render Noctra"
        description="Start with the React package, load the style package, then compose pages using Noctra primitives."
      />

      <DocsSection title="Install packages">
        <CodePanel>{`pnpm add @noctra/react @noctra/styles @noctra/tokens @noctra/utils`}</CodePanel>
      </DocsSection>

      <DocsSection title="Import styles and components">
        <CodePanel>{`import "@noctra/styles";
import { Button, Card, Stack } from "@noctra/react";

export function Example() {
  return (
    <Stack gap="1rem">
      <Card title="Noctra" description="Production-ready primitives." />
      <Button>Get started</Button>
    </Stack>
  );
}`}</CodePanel>
      </DocsSection>

      <DocsSection title="Package roles">
        <Grid columns={4} gap="1rem">
          <InfoCard title="@noctra/react" description="React component exports and public component entry points." />
          <InfoCard title="@noctra/styles" description="Base CSS, component CSS, and theme variables." />
          <InfoCard title="@noctra/tokens" description="Design token names and component token maps." />
          <InfoCard title="@noctra/utils" description="Shared utilities for future package-level helpers." />
        </Grid>
      </DocsSection>
    </Stack>
  );
}