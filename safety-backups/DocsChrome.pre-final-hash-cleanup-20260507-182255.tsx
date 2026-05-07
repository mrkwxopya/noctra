import { docsHref } from "../lib/docsRouting";
import { useMemo, useState, type ReactNode } from "react";
import { noctraDocsComponents, noctraDocsGroups, noctraDocsSummary } from "../generated/noctra-professional-docs.generated";

export type DocsRoute = "overview" | "components" | "component" | "architecture" | "theming" | "quality" | "release";

export interface DocsChromeProps {
  route: DocsRoute;
  children: ReactNode;
}

const navItems = [
  { id: "overview", label: "Overview", href: docsHref("/"), description: "Start here" },
  { id: "components", label: "Components", href: docsHref("/components"), description: "119 generated docs" },
  { id: "architecture", label: "Architecture", href: docsHref("/architecture"), description: "Packages & exports" },
  { id: "theming", label: "Theming", href: docsHref("/theming"), description: "Tokens & CSS variables" },
  { id: "quality", label: "Quality", href: docsHref("/quality"), description: "Audit gates" },
  { id: "release", label: "Release", href: docsHref("/release"), description: "Publish readiness" }
] as const;

export function DocsChrome({ route, children }: DocsChromeProps) {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return [];

    return noctraDocsComponents
      .filter((component) => component.name.toLowerCase().includes(value) || component.kebab.toLowerCase().includes(value) || component.group.toLowerCase().includes(value))
      .slice(0, 8);
  }, [query]);

  return (
    <div className="nd-shell">
      <aside className="nd-sidebar">
        <a className="nd-brand" href={docsHref("/")}>
          <span className="nd-brand-logo">N</span>
          <span>
            <strong>Noctra</strong>
            <small>React UI System</small>
          </span>
        </a>

        <div className="nd-search">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search components..." aria-label="Search documentation" />
          {searchResults.length > 0 ? (
            <div className="nd-search-results">
              {searchResults.map((component) => (
                <a key={component.name} href={`#/components/${component.kebab}`} onClick={() => setQuery("")}>
                  <strong>{component.name}</strong>
                  <small>{component.group}</small>
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <nav className="nd-nav" aria-label="Documentation navigation">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} className="nd-nav-link" data-active={item.id === route || undefined}>
              <span>{item.label}</span>
              <small>{item.description}</small>
            </a>
          ))}
        </nav>

        <div className="nd-sidebar-card">
          <strong>{noctraDocsSummary.componentCount} components</strong>
          <span>{noctraDocsSummary.propCount} props extracted</span>
          <span>{noctraDocsSummary.tokenCount} tokens mapped</span>
        </div>
      </aside>

      <main className="nd-main">
        <header className="nd-topbar">
          <div>
            <span className="nd-kicker">Noctra UI System</span>
            <strong>Professional component documentation</strong>
          </div>
          <div className="nd-topbar-actions">
            <a href={docsHref("/components")}>Browse components</a>
            <a href={docsHref("/release")} data-primary>Release gate</a>
          </div>
        </header>

        <div className="nd-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: ReactNode; children?: ReactNode }) {
  return (
    <section className="nd-hero">
      <div className="nd-hero-content">
        <span className="nd-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children ? <div className="nd-hero-panel">{children}</div> : null}
    </section>
  );
}

export function StatCard({ label, value, description }: { label: string; value: string | number; description?: ReactNode }) {
  return (
    <div className="nd-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {description ? <small>{description}</small> : null}
    </div>
  );
}

export function DocCard({ title, description, children, premium }: { title: ReactNode; description?: ReactNode; children?: ReactNode; premium?: boolean }) {
  return (
    <section className="nd-card" data-premium={premium || undefined}>
      <div className="nd-card-header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children ? <div className="nd-card-body">{children}</div> : null}
    </section>
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
    return <span className="nd-muted">No generated data yet</span>;
  }

  return (
    <div className="nd-tags">
      {visibleItems.map((item) => (
        <span key={item} className="nd-tag">{item}</span>
      ))}
    </div>
  );
}

export function DataTable({ columns, rows }: { columns: readonly string[]; rows: readonly (readonly ReactNode[])[] }) {
  return (
    <div className="nd-table-wrap">
      <table className="nd-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          )) : (
            <tr><td colSpan={columns.length}>No data available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
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

  return <button className="nd-copy-button" type="button" onClick={() => void handleCopy()}>{copied ? "Copied" : "Copy"}</button>;
}

function ExampleRuntimeNotice() {
  return (
    <div className="nd-example-runtime-notice">
      <span>Live preview</span>
      <small>Rendered inside the docs runtime with Noctra styles loaded.</small>
    </div>
  );
}

export function ExampleBlock({ title, description, code, preview }: { title: ReactNode; description?: ReactNode; code: string; preview: ReactNode }) {
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <section className="nd-example">
      <div className="nd-example-header">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>

        <div className="nd-example-actions">
          <button
            className="nd-example-tab"
            type="button"
            data-active={activeTab === "preview" || undefined}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
          <button
            className="nd-example-tab"
            type="button"
            data-active={activeTab === "code" || undefined}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
          <CopyButton value={code} />
        </div>
      </div>

      {activeTab === "preview" ? (
        <div className="nd-example-preview nd-noctra-runtime">
          <ExampleRuntimeNotice />
          <div className="nd-example-canvas">{preview}</div>
        </div>
      ) : (
        <div className="nd-example-code-panel">
          <CodeBlock>{code}</CodeBlock>
        </div>
      )}
    </section>
  );
}

export function SectionTitle({ id, eyebrow, title, description }: { id: string; eyebrow?: ReactNode; title: ReactNode; description?: ReactNode }) {
  return (
    <div className="nd-section-title" id={id}>
      {eyebrow ? <span className="nd-kicker">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function AnchorList({ items }: { items: readonly { href: string; label: string; description?: string }[] }) {
  function handleScroll(targetHref: string) {
    const targetId = targetHref.replace(/^#/, "");
    const target = document.getElementById(targetId);

    if (!target) return;

    const topbarOffset = 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - topbarOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth"
    });
  }

  return (
    <nav className="nd-anchor-list" aria-label="On this page">
      <strong>On this page</strong>
      {items.map((item) => (
        <button key={item.href} type="button" onClick={() => handleScroll(item.href)}>
          <span>{item.label}</span>
          {item.description ? <small>{item.description}</small> : null}
        </button>
      ))}
    </nav>
  );
}

export function GroupSummary() {
  return (
    <div className="nd-group-summary">
      {noctraDocsGroups.map((group) => (
        <a key={group.group} href={`#/components?group=${encodeURIComponent(group.group)}`}>
          <span>{group.group}</span>
          <strong>{group.count}</strong>
        </a>
      ))}
    </div>
  );
}

export function ProPreview({ componentName, group, description }: { componentName: string; group: string; description: string }) {
  return (
    <div className="nd-pro-preview">
      <div className="nd-pro-preview-top">
        <span className="nd-preview-icon">{componentName.slice(0, 1)}</span>
        <div>
          <strong>{componentName}</strong>
          <small>{group}</small>
        </div>
      </div>
      <p>{description}</p>
      <div className="nd-pro-preview-grid">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
