import {
  useMemo,
  useState,
  type ElementType,
  type ReactNode
} from "react";
import { docsComponentLinks, docsPrimaryLinks } from "../../data/docsSidebarLinks";

import { docsHref } from "../../lib/docsRouting";










export type NoctraDocsTabId = "documentation" | "props" | "styles";

export type NoctraDocsHeaderLink = {
  label: string;
  value: string;
  href?: string;
};

export type NoctraDocsTocItem = {
  href: string;
  label: string;
};

export type NoctraDocsPropRow = {
  name: string;
  type: ReactNode;
  required?: boolean;
  description: ReactNode;
  defaultValue?: ReactNode;
};

export type NoctraDocsStylesApiSelector = {
  selector: string;
  description: ReactNode;
};

export type NoctraDocsStylesApiVariable = {
  variable: string;
  description: ReactNode;
};

export type NoctraDocsStylesApiDataAttribute = {
  attribute: string;
  description: ReactNode;
};


export function NoctraDocsSidebar() {
  return (
    <nav className="ncd2-left-nav" data-noctra-docs-system="left-nav">
      <div className="ncd2-left-nav-section">
        <h3>Docs</h3>
        {docsPrimaryLinks.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>

      <div className="ncd2-left-nav-section">
        <h3>Components</h3>
        {docsComponentLinks.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function NoctraDocsShell({
  children,
  toc
}: {
  children: ReactNode;
  toc?: readonly NoctraDocsTocItem[];
}) {
  return (
    <div className="ncd2-shell" data-noctra-docs-system="shell">
      
      <aside className="ncd2-left-rail">
        <NoctraDocsSidebar />
      </aside>

      <main className="ncd2-main">{children}</main>

      {toc && toc.length > 0 ? (
        <aside className="ncd2-rail">
          <NoctraDocsToc items={toc} />
        </aside>
      ) : null}
    </div>
  );
}

export function NoctraDocsHeader({
  title,
  description,
  links
}: {
  title: string;
  description: ReactNode;
  links?: readonly NoctraDocsHeaderLink[];
}) {
  return (
    <header className="ncd2-header" data-noctra-docs-system="header">
      <div className="ncd2-eyebrow">Component</div>
      <h1>{title}</h1>
      <p>{description}</p>

      {links && links.length > 0 ? (
        <dl className="ncd2-meta">
          {links.map((link) => {
            return (
              <div key={`${link.label}-${link.value}`} className="ncd2-meta-row">
                <dt>{link.label}</dt>
                <dd>
                  <ValueWrapper {...(link.href ? { href: link.href } : {})}>
                    {link.value}
                  </ValueWrapper>
                </dd>
              </div>
            );
          })}
        </dl>
      ) : null}
    </header>
  );
}

export function NoctraDocsTabs({
  active,
  onChange
}: {
  active: NoctraDocsTabId;
  onChange: (tab: NoctraDocsTabId) => void;
}) {
  const tabs: Array<{ value: NoctraDocsTabId; label: string }> = [
    { value: "documentation", label: "Documentation" },
    { value: "props", label: "Props" },
    { value: "styles", label: "Styles API" }
  ];

  return (
    <nav className="ncd2-tabs" data-noctra-docs-system="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={active === tab.value}
          className={active === tab.value ? "ncd2-tab-button is-active" : "ncd2-tab-button"}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export function NoctraDocsPage({
  title,
  description,
  links,
  toc,
  documentation,
  props,
  styles
}: {
  title: string;
  description: ReactNode;
  links?: readonly NoctraDocsHeaderLink[];
  toc?: readonly NoctraDocsTocItem[];
  documentation: ReactNode;
  props: ReactNode;
  styles: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<NoctraDocsTabId>("documentation");

  const shellProps = activeTab === "documentation" && toc ? { toc } : {};
  const headerProps = links ? { links } : {};

  return (
    <NoctraDocsShell {...shellProps}>
      <NoctraDocsHeader title={title} description={description} {...headerProps} />
      <NoctraDocsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "documentation" ? documentation : null}
      {activeTab === "props" ? props : null}
      {activeTab === "styles" ? styles : null}
    </NoctraDocsShell>
  );
}

export function NoctraDocsSection({
  id,
  eyebrow,
  title,
  description,
  children
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="ncd2-section">
      {eyebrow ? <div className="ncd2-eyebrow">{eyebrow}</div> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      {children}
    </section>
  );
}

export function NoctraDocsDemo({
  title,
  description,
  preview,
  code,
  controls
}: {
  title: string;
  description?: ReactNode;
  preview: ReactNode;
  code: string;
  controls?: ReactNode;
}) {
  return (
    <div className="ncd2-demo" data-noctra-docs-system="demo">
      <div className="ncd2-demo-head">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>

      <div className="ncd2-demo-grid">
        <div className="ncd2-preview-panel">
          <strong>Preview</strong>
          <div className="ncd2-preview-content">{preview}</div>
        </div>

        <div className="ncd2-code-panel">
          <strong>Code</strong>
          <NoctraCodeBlock code={code} />
        </div>
      </div>

      {controls ? <div className="ncd2-controls-wrap">{controls}</div> : null}
    </div>
  );
}

export function NoctraDocsControlGroup<TValue extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: TValue;
  options: readonly TValue[];
  onChange: (value: TValue) => void;
}) {
  return (
    <div className="ncd2-control-card" data-noctra-docs-system="control-group">
      <strong>{label}</strong>
      <div className="ncd2-control-options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={value === option ? "ncd2-control-button is-active" : "ncd2-control-button"}
            onClick={() => onChange(option)}
            aria-pressed={value === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NoctraDocsBooleanControl({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="ncd2-control-card" data-noctra-docs-system="boolean-control">
      <strong>{label}</strong>
      <div className="ncd2-control-options">
        <button
          type="button"
          className={!checked ? "ncd2-control-button is-active" : "ncd2-control-button"}
          onClick={() => onChange(false)}
          aria-pressed={!checked}
        >
          Off
        </button>

        <button
          type="button"
          className={checked ? "ncd2-control-button is-active" : "ncd2-control-button"}
          onClick={() => onChange(true)}
          aria-pressed={checked}
        >
          On
        </button>
      </div>
    </div>
  );
}

export function NoctraDocsPropsPanel({
  title,
  rows
}: {
  title: string;
  rows: readonly NoctraDocsPropRow[];
}) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return rows;

    return rows.filter((row) => row.name.toLowerCase().includes(normalized));
  }, [query, rows]);

  return (
    <div className="ncd2-tab-panel" data-noctra-docs-system="props-panel">
      <input
        className="ncd2-search-input"
        value={query}
        placeholder="Search props"
        onChange={(event) => setQuery(event.currentTarget.value)}
      />

      <div className="ncd2-table-card">
        <h2>{title}</h2>
        <NoctraDocsPropsTable rows={filteredRows} />
      </div>
    </div>
  );
}

export function NoctraDocsPropsTable({ rows }: { rows: readonly NoctraDocsPropRow[] }) {
  const columns = ["Name", "Type", "Required", "Default", "Description"] as const;

  const tableRows = rows.map((row) => [
    <code key={`${row.name}-name`}>{row.name}</code>,
    row.type,
    row.required ? "Required" : "Optional",
    row.defaultValue ?? "—",
    row.description
  ]);

  return (
    <NoctraDocsSimpleNativeTable
      columns={columns}
      rows={tableRows}
      system="props-table"
    />
  );
}

export function NoctraDocsStylesApiPanel({
  selectors,
  variables,
  dataAttributes
}: {
  selectors: readonly NoctraDocsStylesApiSelector[];
  variables?: readonly NoctraDocsStylesApiVariable[];
  dataAttributes?: readonly NoctraDocsStylesApiDataAttribute[];
}) {
  return (
    <div className="ncd2-tab-panel" data-noctra-docs-system="styles-api-panel">
      <div className="ncd2-table-card">
        <h2>Styles API</h2>
        <p>Use selectors, CSS variables, and data attributes to customize Noctra components without reaching into unstable DOM structure.</p>
      </div>

      <NoctraDocsSimpleTable
        title="Selectors"
        columns={["Selector", "Description"]}
        rows={selectors.map((item) => [
          <code key={`${item.selector}-selector`}>{item.selector}</code>,
          item.description
        ])}
      />

      {variables && variables.length > 0 ? (
        <NoctraDocsSimpleTable
          title="CSS variables"
          columns={["Variable", "Description"]}
          rows={variables.map((item) => [
            <code key={`${item.variable}-variable`}>{item.variable}</code>,
            item.description
          ])}
        />
      ) : null}

      {dataAttributes && dataAttributes.length > 0 ? (
        <NoctraDocsSimpleTable
          title="Data attributes"
          columns={["Attribute", "Description"]}
          rows={dataAttributes.map((item) => [
            <code key={`${item.attribute}-attribute`}>{item.attribute}</code>,
            item.description
          ])}
        />
      ) : null}
    </div>
  );
}

export function NoctraDocsSimpleTable({
  title,
  columns,
  rows
}: {
  title: string;
  columns: readonly string[];
  rows: readonly ReactNode[][];
}) {
  return (
    <div className="ncd2-table-card">
      <h2>{title}</h2>
      <NoctraDocsSimpleNativeTable columns={columns} rows={rows} system="simple-table" />
    </div>
  );
}

function NoctraDocsSimpleNativeTable({
  columns,
  rows,
  system
}: {
  columns: readonly string[];
  rows: readonly ReactNode[][];
  system: string;
}) {
  return (
    <table className="ncd2-table" data-noctra-docs-system={system}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function NoctraCodeBlock({ code }: { code: string }) {
  return (
    <pre className="ncd2-code" data-noctra-docs-system="code-block">
      <code>{code}</code>
    </pre>
  );
}

export function NoctraDocsToc({ items }: { items: readonly NoctraDocsTocItem[] }) {
  return (
    <nav className="ncd2-toc" data-noctra-docs-system="toc">
      <h3>On this page</h3>
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function NoctraDocsExampleGrid({ children }: { children: ReactNode }) {
  return <div className="ncd2-example-list">{children}</div>;
}

export function NoctraDocsExampleCard({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="ncd2-example-row">
      <strong>{label}</strong>
      <span>{children}</span>
    </div>
  );
}

export function NoctraDocsPreviousNext({
  previous,
  next
}: {
  previous?: { label: string; href: string };
  next?: { label: string; href: string };
}) {
  return (
    <nav className="ncd2-prev-next">
      {previous ? (
        <a href={previous.href}>
          <span>Previous</span>
          <strong>{previous.label}</strong>
        </a>
      ) : (
        <span />
      )}

      {next ? (
        <a href={next.href}>
          <span>Next</span>
          <strong>{next.label}</strong>
        </a>
      ) : null}
    </nav>
  );
}
