import { Grid, Stack } from "@noctra/react";
import { DocsSection, InfoCard, PageIntro } from "../components/DocsShell";

export function AccessibilityPage() {
  return (
    <Stack gap="1.5rem">
      <PageIntro
        eyebrow="Accessibility"
        title="Accessibility expectations"
        description="Noctra components should preserve semantic HTML, keyboard access, focus visibility, disabled states, and reduced-motion compatibility."
      />

      <DocsSection title="Baseline checklist">
        <Grid columns={2} gap="1rem">
          <InfoCard title="Keyboard" description="Interactive controls must remain reachable and usable with keyboard navigation." />
          <InfoCard title="Focus" description="Focusable elements must expose visible focus states through tokens." />
          <InfoCard title="ARIA" description="Use aria only when native semantics are not enough." />
          <InfoCard title="Reduced motion" description="Animations should respect prefers-reduced-motion." />
          <InfoCard title="Disabled state" description="Disabled controls should expose semantic disabled or aria-disabled where appropriate." />
          <InfoCard title="Contrast" description="Theme tokens should maintain usable contrast in dark and light themes." />
        </Grid>
      </DocsSection>
    </Stack>
  );
}