import { Badge, Card, CardBody, CardDescription, CardHeader, CardTitle, Divider } from "./docs-system/NoctraRuntimeMock";
import { componentDocs } from "../registry/component.docs";

const categories = ["Core", "Feedback", "Overlay", "Utility", "Identity"] as const;

export function ComponentDocsOverview() {
  return (
    <div className="docs-component-docs">
      <div className="docs-component-summary-grid">
        {categories.map((category) => {
          const count = componentDocs.filter((component) => component.category === category).length;

          return (
            <Card key={category} variant="surface" density="compact">
              <CardBody>
                <div className="docs-component-summary-card">
                  <span>{category}</span>
                  <strong>{count}</strong>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Divider label="Component documentation contracts" />

      <div className="docs-component-docs-grid">
        {componentDocs.map((component) => (
          <Card key={component.name} variant="surface">
            <CardHeader>
              <div className="docs-component-docs-card__top">
                <CardTitle>{component.name}</CardTitle>
                <Badge tone={component.status === "stable-draft" ? "success" : "primary"} variant="outline">
                  {component.status}
                </Badge>
              </div>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>

            <CardBody>
              <div className="docs-component-docs-card__section">
                <span className="docs-component-docs-card__label">Category</span>
                <Badge variant="surface">{component.category}</Badge>
              </div>

              <div className="docs-component-docs-card__section">
                <span className="docs-component-docs-card__label">Anatomy</span>
                <div className="docs-mini-list">
                  {component.anatomy.map((item) => (
                    <code key={item}>{item}</code>
                  ))}
                </div>
              </div>

              <div className="docs-component-docs-card__section">
                <span className="docs-component-docs-card__label">Variants</span>
                <div className="docs-mini-list">
                  {component.variants.map((item) => (
                    <code key={item}>{item}</code>
                  ))}
                </div>
              </div>

              <div className="docs-component-docs-card__section">
                <span className="docs-component-docs-card__label">Key tokens</span>
                <div className="docs-mini-list docs-mini-list--tokens">
                  {component.keyTokens.map((item) => (
                    <code key={item}>{item}</code>
                  ))}
                </div>
              </div>

              <div className="docs-component-docs-card__section">
                <span className="docs-component-docs-card__label">Accessibility baseline</span>
                <ul className="docs-component-a11y-list">
                  {component.accessibility.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
