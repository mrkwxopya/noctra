import { Grid, Stack } from "@noctra/react";
import { CodeBlock, DocCard, PageHero, TagList } from "../components/DocsChrome";

const variants = ["surface", "soft", "outline", "filled", "ghost", "elevated", "subtle", "interactive"];
const tones = ["primary", "neutral", "success", "danger", "warning", "info"];
const radius = ["none", "sm", "md", "lg", "xl", "full"];
const density = ["compact", "default", "comfortable"];

export function ThemingPage() {
  return (
    <Stack gap="1.5rem">
      <PageHero
        eyebrow="Theming & tokens"
        title="Token-driven theming"
        description="Noctra components should be configurable through CSS variables and shared system props. The goal is long-lived styling without runtime-heavy theme logic."
      />

      <Grid columns={2} gap="1rem">
        <DocCard title="Variants"><TagList items={variants} /></DocCard>
        <DocCard title="Tones"><TagList items={tones} /></DocCard>
        <DocCard title="Radius"><TagList items={radius} /></DocCard>
        <DocCard title="Density"><TagList items={density} /></DocCard>
      </Grid>

      <DocCard title="Theme override example">
        <CodeBlock>{`:root {
  --nc-bg-page: #050a12;
  --nc-bg-surface: #08111f;
  --nc-text-primary: #f8fafc;
  --nc-text-muted: #94a3b8;
  --nc-accent-rgb: 139, 92, 246;
  --nc-radius-lg: 1rem;
}`}</CodeBlock>
      </DocCard>
    </Stack>
  );
}