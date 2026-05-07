import { Badge, Card, CardBody, CardDescription, CardHeader, CardTitle, Divider } from "@noctra/react";

const accessibilityChecks = [
  {
    group: "Actions",
    status: "done",
    items: ["Button uses native button behavior.", "IconButton requires label prop.", "Loading buttons expose aria-busy."]
  },
  {
    group: "Forms",
    status: "done",
    items: ["Input connects label with htmlFor.", "Description and error are linked through aria-describedby.", "Invalid state exposes aria-invalid."]
  },
  {
    group: "Overlays",
    status: "done",
    items: ["Modal uses role dialog and aria-modal.", "Title and description IDs are connected.", "Escape closes when enabled.", "Focus is trapped and restored."]
  },
  {
    group: "Feedback",
    status: "done",
    items: ["Alert uses alert/status roles by tone.", "Spinner can expose status when label is provided.", "Skeleton remains decorative by default."]
  },
  {
    group: "Helpers",
    status: "done",
    items: ["Tooltip uses role tooltip.", "Trigger receives aria-describedby.", "Divider exposes separator orientation."]
  },
  {
    group: "Interactive surfaces",
    status: "done",
    items: ["Interactive Card receives role button.", "Interactive Card becomes keyboard focusable.", "Enter and Space activate interactive cards."]
  }
] as const;

export function AccessibilityAudit() {
  return (
    <div className="docs-a11y-audit">
      <div className="docs-a11y-grid">
        {accessibilityChecks.map((check) => (
          <Card key={check.group} variant="surface">
            <CardHeader>
              <div className="docs-a11y-card__top">
                <CardTitle>{check.group}</CardTitle>
                <Badge tone="success" variant="outline">{check.status}</Badge>
              </div>
              <CardDescription>Accessibility baseline checks for the current MVP foundation.</CardDescription>
            </CardHeader>

            <CardBody>
              <ul className="docs-a11y-list">
                {check.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>

      <Divider label="Remaining accessibility hardening" />

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Next accessibility pass</CardTitle>
          <CardDescription>
            The MVP baseline is ready. Future advanced components should add roving tabindex, composite widget keyboard maps, and screen reader examples.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}