import { Badge, Card, CardBody, CardDescription, CardHeader, CardTitle, Divider } from "./docs-system/NoctraRuntimeMock";

const qualityGroups = [
  {
    title: "Build gates",
    status: "ready",
    items: ["workspace build", "workspace typecheck", "docs build", "export smoke test"]
  },
  {
    title: "Component gates",
    status: "ready",
    items: ["12 MVP components", "anatomy slots", "data attributes", "component tokens"]
  },
  {
    title: "Theme gates",
    status: "ready",
    items: ["dark mode", "light mode", "accent mode", "density mode", "radius mode"]
  },
  {
    title: "Docs gates",
    status: "draft",
    items: ["docs shell", "button playground", "token inspector", "component metadata registry"]
  },
  {
    title: "Accessibility gates",
    status: "draft",
    items: ["native buttons", "icon labels", "input aria links", "modal focus trap", "tooltip describedby"]
  },
  {
    title: "Release gates",
    status: "draft",
    items: ["README baseline", "changelog baseline", "release checklist", "package exports"]
  }
] as const;

function getTone(status: "ready" | "draft") {
  return status === "ready" ? "success" : "warning";
}

export function FoundationQualityGate() {
  return (
    <div className="docs-quality-gate">
      <div className="docs-quality-gate__summary">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Foundation status</CardTitle>
            <CardDescription>
              Noctra now has a buildable MVP foundation with tokens, themes, components, docs, playground, exports, and smoke tests.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="docs-quality-score">
              <strong>Alpha foundation</strong>
              <Badge tone="success">passing</Badge>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next quality target</CardTitle>
            <CardDescription>
              The next pass should polish dark/light visuals, improve docs structure, and harden accessibility details.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="docs-quality-score">
              <strong>Polish pass</strong>
              <Badge tone="warning" variant="outline">next</Badge>
            </div>
          </CardBody>
        </Card>
      </div>

      <Divider label="Quality gate matrix" />

      <div className="docs-quality-grid">
        {qualityGroups.map((group) => (
          <Card key={group.title} variant="surface">
            <CardHeader>
              <div className="docs-quality-card__top">
                <CardTitle>{group.title}</CardTitle>
                <Badge tone={getTone(group.status)} variant="outline">{group.status}</Badge>
              </div>
            </CardHeader>

            <CardBody>
              <ul className="docs-quality-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
