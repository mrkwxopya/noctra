import { Grid, Stack } from "../components/docs-system/NoctraRuntimeMock";
import { DocsSection, HeroCard, InfoCard, PageIntro } from "../components/DocsShell";

export function HomePage() {
  return (
    <Stack gap="1.5rem">
      <PageIntro
        eyebrow="Overview"
        title="Noctra documentation"
        description="Noctra is a React component, hooks, token, and CSS utility system with production-hardening gates, export audits, package checks, and docs generated from real package usage."
      />

      <HeroCard />

      <DocsSection
        title="What this docs site must prove"
        description="The docs app is not just marketing. It should validate package exports, real component imports, token naming, style loading, and release readiness before GitHub publishing."
      >
        <Grid columns={3} gap="1rem">
          <InfoCard
            title="Use Noctra primitives"
            description="Pages are built with Layout, Page, Section, Card, Stack, Grid, Group, Divider, and related Noctra components."
          />
          <InfoCard
            title="Explain package usage"
            description="Install, imports, styles, tokens, accessibility, component groups, and release gates are documented in one place."
          />
          <InfoCard
            title="Prepare for publish"
            description="Release reports and checklist pages make GitHub and npm publishing easier to verify."
          />
        </Grid>
      </DocsSection>
    </Stack>
  );
}
