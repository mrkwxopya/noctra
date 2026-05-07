import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { docsHref } from "../../lib/docsRouting";
import { docsSidebarSections, type DocsSidebarSection } from "../../data/docsSidebarLinks";

export type NoctraDocsHeaderLink = {
  label: string;
  value?: ReactNode;
  href?: string;
};

export type NoctraDocsTocItem = {
  href: string;
  label: string;
  description?: ReactNode | undefined;
};

export type NoctraDocsPropRow = {
  name: string;
  type?: ReactNode;
  required?: boolean;
  defaultValue?: ReactNode;
  description?: ReactNode | undefined;
};

export type NoctraDocsStyleRow = {
  selector?: ReactNode;
  name?: ReactNode;
  description?: ReactNode | undefined;
  value?: ReactNode;
};

export type NoctraDocsTableRow = readonly ReactNode[] | Record<string, ReactNode>;

export type NoctraDocsPrevNextLink = {
  label: string;
  href: string;
};

export type NoctraDocsTableProps = {
  title?: ReactNode | undefined;
  columns?: readonly string[];
  rows?: readonly NoctraDocsTableRow[];
  children?: ReactNode | undefined;
  className?: string;
  style?: CSSProperties;
};

export type NoctraMantineDocsProps = {
  title: string;
  description?: ReactNode | undefined;
  links?: readonly NoctraDocsHeaderLink[];
  toc?: readonly NoctraDocsTocItem[];
  documentation?: ReactNode;
  props?: ReactNode;
  styles?: ReactNode;
  previous?: NoctraDocsPrevNextLink;
  next?: NoctraDocsPrevNextLink;
  children?: ReactNode | undefined;
  className?: string;
  style?: CSSProperties;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function hasNode(value: ReactNode): boolean {
  return value !== null && value !== undefined && value !== false;
}

function normalizeAnchorHref(href: string) {
  if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }

  return docsHref(href);
}

function SectionList({ sections }: { sections: readonly DocsSidebarSection[] }) {
  return (
    <nav className="nmx-left-nav" aria-label="Documentation navigation">
      {sections.map((section) => (
        <section className="nmx-left-section" key={section.title}>
          <h2>{section.title}</h2>
          <div className="nmx-left-links">
            {section.links.map((link) => (
              <a href={normalizeAnchorHref(link.href)} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}

export function NoctraDocsToc({ items = [] }: { items?: readonly NoctraDocsTocItem[] }) {
  return (
    <aside className="nmx-right-toc" aria-label="Table of contents">
      <h2>Table of contents</h2>
      <nav>
        {items.length > 0 ? (
          items.map((item) => (
            <a href={item.href} key={item.href}>
              <span>{item.label}</span>
              {item.description ? <small>{item.description}</small> : null}
            </a>
          ))
        ) : (
          <span className="nmx-empty-note">No sections</span>
        )}
      </nav>
    </aside>
  );
}

export function NoctraDocsHeader({
  title,
  description,
  links = []
}: {
  title: string;
  description?: ReactNode | undefined;
  links?: readonly NoctraDocsHeaderLink[];
}) {
  return (
    <header className="nmx-hero">
      <div className="nmx-kicker">Noctra UI</div>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}

      {links.length > 0 ? (
        <dl className="nmx-meta">
          {links.map((link) => (
            <div className="nmx-meta-row" key={link.label}>
              <dt>{link.label}</dt>
              <dd>
                {link.href ? (
                  <a href={normalizeAnchorHref(link.href)}>{link.value ?? link.href}</a>
                ) : (
                  link.value ?? "—"
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  );
}

export function NoctraDocsTabs({
  documentation,
  props,
  styles
}: {
  documentation?: ReactNode;
  props?: ReactNode;
  styles?: ReactNode;
}) {
  const tabs = useMemo(
    () => [
      { id: "documentation", label: "Documentation", node: documentation },
      { id: "props", label: "Props", node: props },
      { id: "styles", label: "Styles API", node: styles }
    ].filter((tab) => hasNode(tab.node)),
    [documentation, props, styles]
  );

  const [active, setActive] = useState(() => tabs[0]?.id ?? "documentation");
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  if (!current) {
    return null;
  }

  return (
    <div className="nmx-tabs-shell">
      <div className="nmx-tabs" role="tablist" aria-label="Docs sections">
        {tabs.map((tab) => (
          <button
            aria-selected={tab.id === current.id}
            key={tab.id}
            onClick={() => setActive(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="nmx-tab-panel" role="tabpanel">
        {current.node}
      </div>
    </div>
  );
}

export function NoctraDocsSection({
  title,
  description,
  children,
  id,
  eyebrow
}: {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  children?: ReactNode | undefined;
  id?: string;
  eyebrow?: ReactNode;
}) {
  return (
    <section className="nmx-section" id={id}>
      {eyebrow ? <div className="nmx-section-eyebrow">{eyebrow}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {description ? <p className="nmx-section-description">{description}</p> : null}
      {children}
    </section>
  );
}


export function NoctraDocsDemo({
  title,
  description,
  children,
  code,
  preview,
  controls
}: {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  children?: ReactNode | undefined;
  code?: string | undefined;
  preview?: ReactNode | undefined;
  controls?: ReactNode | undefined;
}) {
  const previewNode = preview ?? children;

  return (
    <section className="nmx-demo">
      {title || description ? (
        <div className="nmx-demo-head">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}

      {controls ? <div className="nmx-demo-controls">{controls}</div> : null}
      <div className="nmx-demo-preview">{previewNode}</div>

      {code !== undefined ? <NoctraDocsCodeBlock code={code} /> : null}
    </section>
  );
}

export function NoctraDocsCodeBlock({ code = "" }: { code?: string }) {
  return (
    <pre className="nmx-code">
      <code>{code}</code>
    </pre>
  );
}

function tableCellValue(row: NoctraDocsTableRow, column: string, index: number): ReactNode {
  if (Array.isArray(row)) return row[index] ?? "—";

  const record = row as Record<string, ReactNode>;
  return record[column] ?? record[column.toLowerCase()] ?? "—";
}

export function NoctraDocsTable({
  title,
  columns = [],
  rows = [],
  children,
  className,
  style
}: NoctraDocsTableProps) {
  const resolvedColumns = columns.length > 0
    ? columns
    : rows.length > 0 && !Array.isArray(rows[0])
      ? Object.keys(rows[0] as Record<string, ReactNode>)
      : [];

  return (
    <section className={cx("nmx-table-block", className)} style={style}>
      {title ? <h3>{title}</h3> : null}

      {children ?? (
        <div className="nmx-table-scroll">
          <table className="nmx-table">
            <thead>
              <tr>
                {resolvedColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {resolvedColumns.map((column, columnIndex) => (
                    <td key={column}>{tableCellValue(row, column, columnIndex)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function NoctraDocsPropsTable({
  title = "Props",
  rows = []
}: {
  title?: ReactNode | undefined;
  rows?: readonly NoctraDocsPropRow[];
}) {
  return (
    <NoctraDocsTable
      title={title}
      columns={["Prop", "Type", "Default", "Description"]}
      rows={rows.map((row) => [
        <code>{row.name}</code>,
        row.type ?? "—",
        row.defaultValue ?? "—",
        row.description ?? "—"
      ])}
    />
  );
}

export function NoctraDocsStylesTable({
  title = "Styles API",
  rows = []
}: {
  title?: ReactNode | undefined;
  rows?: readonly NoctraDocsStyleRow[];
}) {
  return (
    <NoctraDocsTable
      title={title}
      columns={["Selector", "Description", "Value"]}
      rows={rows.map((row) => [
        row.selector ?? row.name ?? "—",
        row.description ?? "—",
        row.value ?? "—"
      ])}
    />
  );
}

export function NoctraDocsPrevNext({
  previous,
  next
}: {
  previous?: NoctraDocsPrevNextLink;
  next?: NoctraDocsPrevNextLink;
}) {
  if (!previous && !next) return null;

  return (
    <nav className="nmx-prev-next" aria-label="Previous and next pages">
      {previous ? (
        <a href={normalizeAnchorHref(previous.href)}>
          <span>Previous</span>
          <strong>{previous.label}</strong>
        </a>
      ) : <span />}

      {next ? (
        <a href={normalizeAnchorHref(next.href)}>
          <span>Next</span>
          <strong>{next.label}</strong>
        </a>
      ) : <span />}
    </nav>
  );
}

export function NoctraDocsValue({ value }: { value: ReactNode }) {
  return <span className="nmx-value">{value}</span>;
}

export function NoctraDocsBlock({
  title,
  description,
  children
}: {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <section className="nmx-block">
      {title ? <h3>{title}</h3> : null}
      {description ? <p>{description}</p> : null}
      {children}
    </section>
  );
}

export function NoctraMantineDocs({
  title,
  description,
  links = [],
  toc = [],
  documentation,
  props,
  styles,
  previous,
  next,
  children,
  className,
  style
}: NoctraMantineDocsProps) {
  return (
    <div className={cx("nmx-page", className)} style={style}>
      <div className="nmx-layout">
        <aside className="nmx-left-rail">
          <SectionList sections={docsSidebarSections} />
        </aside>

        <main className="nmx-main">
          <NoctraDocsHeader title={title} description={description} links={links} />

          {children ? (
            <div className="nmx-custom-content">{children}</div>
          ) : (
            <NoctraDocsTabs documentation={documentation} props={props} styles={styles} />
          )}

          {(previous || next) ? (
            <NoctraDocsPrevNext
              {...(previous ? { previous } : {})}
              {...(next ? { next } : {})}
            />
          ) : null}
        </main>

        <NoctraDocsToc items={toc} />
      </div>
    </div>
  );
}

export const NoctraDocsPage = NoctraMantineDocs;




/* FULL_MANTINE_COMPAT_COMPONENTS_START */
export const NoctraCodeBlock = NoctraDocsCodeBlock;
export const NoctraDocsPreviousNext = NoctraDocsPrevNext;
export const NoctraDocsSimpleTable = NoctraDocsTable;

export type NoctraDocsControlOption<T extends string = string> =
  | T
  | {
      label?: ReactNode;
      value: T;
    };

function controlOptionValue<T extends string>(option: NoctraDocsControlOption<T>): T {
  return typeof option === "string" ? option : option.value;
}

function controlOptionLabel<T extends string>(option: NoctraDocsControlOption<T>): ReactNode {
  return typeof option === "string" ? option : option.label ?? option.value;
}

export function NoctraDocsControlGroup<T extends string = string>({
  label,
  value,
  options = [],
  onChange,
  children
}: {
  label?: ReactNode;
  value?: T;
  options?: readonly NoctraDocsControlOption<T>[];
  onChange?: (value: T) => void;
  children?: ReactNode | undefined;
}) {
  return (
    <div className="nmx-control-group">
      {label ? <label>{label}</label> : null}

      {children ?? (
        <div className="nmx-control-options">
          {options.map((option) => {
            const optionValue = controlOptionValue(option);
            const selected = value === optionValue;

            return (
              <button
                aria-pressed={selected}
                key={optionValue}
                onClick={() => onChange?.(optionValue)}
                type="button"
              >
                {controlOptionLabel(option)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function NoctraDocsBooleanControl({
  label,
  checked,
  value,
  onChange
}: {
  label?: ReactNode;
  checked?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const resolved = Boolean(checked ?? value);

  return (
    <label className="nmx-boolean-control">
      <input
        checked={resolved}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

export function NoctraDocsExampleGrid({
  children
}: {
  children?: ReactNode | undefined;
}) {
  return <div className="nmx-example-grid">{children}</div>;
}


export function NoctraDocsExampleCard({
  title,
  label,
  description,
  children,
  preview,
  code,
  controls
}: {
  title?: ReactNode | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  children?: ReactNode | undefined;
  preview?: ReactNode | undefined;
  code?: string | undefined;
  controls?: ReactNode | undefined;
}) {
  const demoProps: {
    title?: ReactNode | undefined;
    description?: ReactNode | undefined;
    preview?: ReactNode | undefined;
    code?: string | undefined;
    controls?: ReactNode | undefined;
  } = {
    title: title ?? label,
    description,
    preview: preview ?? children,
    controls
  };

  if (code !== undefined) {
    demoProps.code = code;
  }

  return <NoctraDocsDemo {...demoProps} />;
}

export function NoctraDocsPropsPanel({
  title = "Props",
  rows = [],
  children
}: {
  title?: ReactNode | undefined;
  rows?: readonly NoctraDocsPropRow[];
  children?: ReactNode | undefined;
}) {
  return children ? (
    <section className="nmx-table-block">
      <h3>{title}</h3>
      {children}
    </section>
  ) : (
    <NoctraDocsPropsTable rows={rows} title={title} />
  );
}


export function NoctraDocsStylesApiPanel({
  title = "Styles API",
  rows = [],
  selectors = [],
  variables = [],
  dataAttributes = [],
  children
}: {
  title?: ReactNode | undefined;
  rows?: readonly NoctraDocsStyleRow[];
  selectors?: readonly { selector?: ReactNode; description?: ReactNode }[];
  variables?: readonly { variable?: ReactNode; name?: ReactNode; description?: ReactNode }[];
  dataAttributes?: readonly { attribute?: ReactNode; name?: ReactNode; description?: ReactNode }[];
  children?: ReactNode | undefined;
}) {
  const mergedRows: NoctraDocsStyleRow[] = [
    ...rows,
    ...selectors.map((item) => ({
      selector: item.selector ?? "—",
      description: item.description ?? "—",
      value: "Selector"
    })),
    ...variables.map((item) => ({
      selector: item.variable ?? item.name ?? "—",
      description: item.description ?? "—",
      value: "CSS variable"
    })),
    ...dataAttributes.map((item) => ({
      selector: item.attribute ?? item.name ?? "—",
      description: item.description ?? "—",
      value: "Data attribute"
    }))
  ];

  return children ? (
    <section className="nmx-table-block">
      <h3>{title}</h3>
      {children}
    </section>
  ) : (
    <NoctraDocsStylesTable rows={mergedRows} title={title} />
  );
}

export default NoctraMantineDocs;
