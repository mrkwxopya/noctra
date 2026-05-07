import { useState, type ReactNode } from "react";
import { Layout, Page, Stack, Group, Card, CardBody, CardDescription, CardHeader, CardTitle, Divider } from "@noctra/react";
import { noctraDocsGroups, noctraDocsSummary } from "../generated/noctra-professional-docs.generated";

export type DocsRoute = "overview" | "components" | "component" | "architecture" | "theming" | "quality" | "release";

export interface DocsChromeProps {
  route: DocsRoute;
  children: ReactNode;
}

const navItems = [
  { id: "overview", label: "Overview", href: "#/", description: "Project, packages, and design direction." },
  { id: "components", label: "Components", href: "#/components", description: "Full component inventory and generated docs." },
  { id: "architecture", label: "Architecture", href: "#/architecture", description: "Package boundaries and public exports." },
  { id: "theming", label: "Theming & Tokens", href: "#/theming", description: "CSS variables, variants, tones, and tokens." },
  { id: "quality", label: "Quality Gates", href: "#/quality", description: "Audits, reports, smoke files, and hard gates." },
  { id: "release", label: "Release", href: "#/release", description: "Publish checklist and final decision flow." }
] as const;

export function DocsChrome({ route, children }: DocsChromeProps) {
  const sidebar = (
    <aside className="nd-sidebar">
      <a className="nd-brand" href="#/">
        <span className="nd-brand-mark">N</span>
        <span>
          <strong>Noctra</strong>
          <small>Professional UI Docs</small>
        </span>
      </a>

      <Divider />

      <nav className="nd-nav" aria-label="Main documentation">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="nd-nav-item"
            data-active={item.id === route || undefined}
          >
            <strong>{item.label}</strong>
            <small>{item.description}</small>
          </a>
        ))}
      </nav>

      <Divider />

      <div className="nd-sidebar-meta">
        <strong>{noctraDocsSummary.componentCount} components</strong>
        <span>{noctraDocsSummary.propCount} props extracted</span>
        <span>{noctraDocsSummary.tokenCount} component tokens</span>
      </div>
    </aside>
  );

  const header = (
    <Group justify="between" align="center" fullWidth>
      <div>
        <div className="nd-eyebrow">Noctra UI System</div>
        <div className="nd-header-title">Component library documentation</div>
      </div>

      <Group gap="0.5rem" inline>
        <a className="nd-action" href="#/components">Browse components</a>
        <a className="nd-action nd-action-primary" href="#/release">Release status</a>
      </Group>
    </Group>
  );

  return (
    <Layout
      className="nd-app"
      sidebar={sidebar}
      header={header}
      mode="sidebar"
      stickyHeader
      stickySidebar
      padded={false}
      fullWidth
      minHeight="100vh"
      variant="ghost"
    >
      <Page className="nd-page" maxWidth="1280px" fullWidth padded variant="ghost">
        {children}
      </Page>
    </Layout>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="nd-hero">
      <div>
        <div className="nd-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children ? <div className="nd-hero-aside">{children}</div> : null}
    </section>
  );
}

export function StatCard({ label, value, description }: { label: string; value: string | number; description?: ReactNode }) {
  return (
    <Card variant="surface" shadow="sm" fullWidth>
      <CardBody>
        <div className="nd-stat">
          <span>{label}</span>
          <strong>{value}</strong>
          {description ? <small>{description}</small> : null}
        </div>
      </CardBody>
    </Card>
  );
}

export function DocCard({
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

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="nd-code">
      <code>{children}</code>
    </pre>
  );
}

export function TagList({ items, limit }: { items: readonly string[]; limit?: number }) {
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;

  if (visibleItems.length === 0) {
    return <span className="nd-muted">None</span>;
  }

  return (
    <div className="nd-tags">
      {visibleItems.map((item) => (
        <span key={item} className="nd-tag">
          {item}
        </span>
      ))}
    </div>
  );
}

export function DataTable({
  columns,
  rows
}: {
  columns: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}) {
  return (
    <div className="nd-table-wrap">
      <table className="nd-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function GroupSummary() {
  return (
    <Stack gap="0.5rem">
      {noctraDocsGroups.map((group) => (
        <div className="nd-group-row" key={group.group}>
          <span>{group.group}</span>
          <strong>{group.count}</strong>
        </div>
      ))}
    </Stack>
  );
}
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="nd-copy-button" type="button" onClick={() => void handleCopy()}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ExampleBlock({
  title,
  description,
  code,
  preview
}: {
  title: ReactNode;
  description?: ReactNode;
  code: string;
  preview: ReactNode;
}) {
  return (
    <Card variant="surface" shadow="sm" fullWidth>
      <CardHeader>
        <Group justify="between" align="start" fullWidth>
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          <CopyButton value={code} />
        </Group>
      </CardHeader>

      <CardBody>
        <Stack gap="1rem">
          <div className="nd-preview">{preview}</div>
          <CodeBlock>{code}</CodeBlock>
        </Stack>
      </CardBody>
    </Card>
  );
}
export function SectionTitle({
  id,
  eyebrow,
  title,
  description
}: {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="nd-section-title" id={id}>
      {eyebrow ? <div className="nd-eyebrow">{eyebrow}</div> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function AnchorList({
  items
}: {
  items: readonly { href: string; label: string; description?: string }[];
}) {
  return (
    <nav className="nd-anchor-list" aria-label="On this page">
      <strong>On this page</strong>
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          <span>{item.label}</span>
          {item.description ? <small>{item.description}</small> : null}
        </a>
      ))}
    </nav>
  );
}

export function CoverageMeter({
  label,
  value,
  max
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percent = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="nd-coverage">
      <div className="nd-coverage-row">
        <span>{label}</span>
        <strong>{value}/{max}</strong>
      </div>
      <div className="nd-coverage-track" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
