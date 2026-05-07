import type { ReactNode } from "react";
import { Layout, Page, Section, Stack, Group, Card, CardBody, CardDescription, CardHeader, CardTitle, Divider } from "@noctra/react";
import { docsRoutes, type DocsRouteId } from "../data/docsCatalog";

export interface DocsShellProps {
  activeRoute: DocsRouteId;
  children: ReactNode;
}

export function DocsShell({ activeRoute, children }: DocsShellProps) {
  const sidebar = (
    <nav className="docs-sidebar" aria-label="Documentation navigation">
      <a className="docs-brand" href="#/" aria-label="Noctra documentation home">
        <span className="docs-brand__mark">N</span>
        <span>
          <strong>Noctra</strong>
          <small>UI System Docs</small>
        </span>
      </a>

      <Divider />

      <div className="docs-nav-list">
        {docsRoutes.map((route) => (
          <a
            key={route.id}
            className="docs-nav-link"
            data-active={route.id === activeRoute || undefined}
            href={route.href}
          >
            <span>{route.label}</span>
            <small>{route.description}</small>
          </a>
        ))}
      </div>
    </nav>
  );

  const header = (
    <Group justify="between" align="center" fullWidth>
      <div>
        <div className="docs-kicker">Noctra Documentation</div>
        <div className="docs-header-title">Production-ready component, token, and style system</div>
      </div>

      <Group gap="0.5rem" inline>
        <a className="docs-pill" href="#/components">Components</a>
        <a className="docs-pill" href="#/release">Release</a>
      </Group>
    </Group>
  );

  return (
    <Layout
      className="docs-app"
      sidebar={sidebar}
      header={header}
      mode="sidebar"
      stickyHeader
      stickySidebar
      fullWidth
      minHeight="100vh"
      variant="ghost"
      padded={false}
    >
      <Page className="docs-page" fullWidth maxWidth="1180px" variant="ghost" padded>
        {children}
      </Page>
    </Layout>
  );
}

export function HeroCard() {
  return (
    <Card
      variant="interactive"
      shadow="lg"
      title="Noctra"
      subtitle="Component library, token layer, style package, docs, and release gates."
      description="This documentation is built with Noctra primitives so the docs app validates real package usage before GitHub publishing."
      footer="Docs-first release pass"
      fullWidth
    >
      <CardBody>
        <div className="docs-hero-grid">
          <Metric label="Components tracked" value="119+" />
          <Metric label="Package gates" value="10+" />
          <Metric label="Release blockers" value="0" />
        </div>
      </CardBody>
    </Card>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="docs-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function DocsSection({
  title,
  description,
  children
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Section title={title} description={description} variant="ghost" padded={false}>
      {children}
    </Section>
  );
}

export function InfoCard({
  title,
  description,
  children
}: {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card variant="surface" shadow="sm" fullWidth>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      {children ? <CardBody>{children}</CardBody> : null}
    </Card>
  );
}

export function CodePanel({ children }: { children: string }) {
  return <pre className="docs-code"><code>{children}</code></pre>;
}

export function PillList({ items }: { items: string[] }) {
  return (
    <div className="docs-pill-list">
      {items.map((item) => (
        <span key={item} className="docs-tag">
          {item}
        </span>
      ))}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Stack gap="0.75rem">
      <div className="docs-kicker">{eyebrow}</div>
      <h1 className="docs-title">{title}</h1>
      <p className="docs-lead">{description}</p>
    </Stack>
  );
}