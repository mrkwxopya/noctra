import { Card, Grid, Group, Stack, Divider, Paper, Box, Flex, Spacer } from "@noctra/react";
import { CodePanel, DocsSection, InfoCard, PageIntro } from "../components/DocsShell";

export function LayoutPage() {
  return (
    <Stack gap="1.5rem">
      <PageIntro
        eyebrow="Layout"
        title="Layout primitives"
        description="The layout layer is the foundation of Noctra docs and app screens. These primitives are intentionally composable and token-driven."
      />

      <DocsSection title="Live layout composition">
        <Paper variant="surface" shadow="md" fullWidth>
          <Stack gap="1rem">
            <Group justify="between" align="center">
              <strong>Dashboard header</strong>
              <Group gap="0.5rem" inline>
                <span className="docs-tag">Page</span>
                <span className="docs-tag">Section</span>
                <span className="docs-tag">Card</span>
              </Group>
            </Group>

            <Divider />

            <Grid columns={3} gap="1rem">
              <Card title="Stack" description="Vertical composition with gap control." />
              <Card title="Group" description="Horizontal composition with alignment and wrapping." />
              <Card title="Grid" description="Responsive grid layout for content sections." />
            </Grid>

            <Flex wrap="wrap" gap="0.75rem">
              <Box variant="soft" padding="0.75rem" radius="lg">Box</Box>
              <Spacer axis="horizontal" space="1rem" />
              <Box variant="outline" padding="0.75rem" radius="lg">Spacer</Box>
            </Flex>
          </Stack>
        </Paper>
      </DocsSection>

      <DocsSection title="Recommended layout imports">
        <CodePanel>{`import {
  Layout,
  Page,
  Section,
  Container,
  Stack,
  Group,
  Grid,
  SimpleGrid,
  Flex,
  Box,
  Paper,
  Card,
  Divider,
  Spacer
} from "@noctra/react";`}</CodePanel>
      </DocsSection>

      <DocsSection title="Layout guidance">
        <Grid columns={3} gap="1rem">
          <InfoCard title="Page" description="Use for full documentation or app pages with title, description, actions, sidebar, and content." />
          <InfoCard title="Section" description="Use inside pages to separate meaningful content regions." />
          <InfoCard title="Card/Paper" description="Use for bounded surfaces, examples, feature panels, and content previews." />
        </Grid>
      </DocsSection>
    </Stack>
  );
}