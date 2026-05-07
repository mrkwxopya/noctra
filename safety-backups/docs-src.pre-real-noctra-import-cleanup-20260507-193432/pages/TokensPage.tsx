import { Grid, Stack } from "../components/docs-system/NoctraRuntimeMock";
import { CodePanel, DocsSection, InfoCard, PageIntro } from "../components/DocsShell";

export function TokensPage() {
  return (
    <Stack gap="1.5rem">
      <PageIntro
        eyebrow="Tokens"
        title="Token package"
        description="Noctra tokens expose stable names for component CSS variables and shared system values."
      />

      <DocsSection title="Token naming">
        <CodePanel>{`--nc-card-bg
--nc-card-border
--nc-card-text
--nc-card-shadow
--nc-card-radius
--nc-card-padding

--nc-section-bg
--nc-section-border
--nc-section-text
--nc-section-gap

--nc-layout-sidebar-width
--nc-layout-aside-width
--nc-layout-header-height`}</CodePanel>
      </DocsSection>

      <DocsSection title="Token usage rules">
        <Grid columns={3} gap="1rem">
          <InfoCard title="Stable names" description="Component tokens use nc + component + property naming." />
          <InfoCard title="CSS first" description="Styles should be configurable without requiring JavaScript runtime theme logic." />
          <InfoCard title="Public exports" description="Every component token file should be exported from @noctra/tokens." />
        </Grid>
      </DocsSection>
    </Stack>
  );
}
