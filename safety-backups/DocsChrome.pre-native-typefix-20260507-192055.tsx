import {
  isValidElement,
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode
} from "react";
import { docsHref } from "../lib/docsRouting";

type LooseProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
};

type ChromeLink = {
  label: string;
  href: string;
  external?: boolean;
};

const chromeLinks: readonly ChromeLink[] = [
  { label: "Docs", href: docsHref("/") },
  { label: "Components", href: docsHref("/components") },
  { label: "Architecture", href: docsHref("/architecture") },
  { label: "Tokens", href: docsHref("/tokens") },
  { label: "GitHub", href: "https://github.com/mrkwxopya/noctra", external: true }
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function renderUnknown(value: unknown): ReactNode {
  if (value === null || value === undefined) return "—";
  if (isValidElement(value)) return value;
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <span key={index}>{renderUnknown(item)}</span>
    ));
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export type DocsChromeProps = LooseProps;

export function DocsChrome({ children, className, style }: DocsChromeProps) {
  return (
    <div className={cx("ncd3-chrome", className)} style={style} data-noctra-docs-system="chrome">
      <header className="ncd3-topbar">
        <a className="ncd3-brand" href={docsHref("/")}>
          <span className="ncd3-brand-mark" aria-hidden="true" />
          <span>Noctra</span>
        </a>

        <nav className="ncd3-topnav" aria-label="Main docs navigation">
          {chromeLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="ncd3-content">{children}</div>
    </div>
  );
}

export type DocsRouteProps = LooseProps & {
  element?: ReactNode;
  component?: ComponentType<Record<string, never>>;
};

export function DocsRoute({ children, element, component: Component }: DocsRouteProps) {
  const content = children ?? element ?? (Component ? <Component /> : null);

  return <DocsChrome>{content}</DocsChrome>;
}

export type PageHeroProps = LooseProps & {
  eyebrow?: ReactNode;
  kicker?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  stats?: readonly unknown[];
  links?: readonly unknown[];
};

export function PageHero({
  eyebrow,
  kicker,
  title,
  description,
  subtitle,
  actions,
  stats,
  links,
  children,
  className,
  style
}: PageHeroProps) {
  return (
    <header className={cx("ncd3-page-hero", className)} style={style}>
      {eyebrow || kicker ? <div className="ncd3-eyebrow">{eyebrow ?? kicker}</div> : null}
      {title ? <h1>{title}</h1> : null}
      {description || subtitle ? <p>{description ?? subtitle}</p> : null}

      {actions ? <div className="ncd3-actions">{actions}</div> : null}

      {stats && stats.length > 0 ? (
        <div className="ncd3-stat-grid">
          {stats.map((stat, index) => (
            <StatCard key={index} {...(typeof stat === "object" && stat !== null ? stat as Record<string, unknown> : { value: stat })} />
          ))}
        </div>
      ) : null}

      {links && links.length > 0 ? (
        <div className="ncd3-link-grid">
          {links.map((link, index) => {
            const item = typeof link === "object" && link !== null ? link as Record<string, unknown> : { label: link };
            const href = typeof item.href === "string" ? item.href : undefined;

            return href ? (
              <a key={index} href={href}>{renderUnknown(item.label ?? item.title ?? href)}</a>
            ) : (
              <span key={index}>{renderUnknown(item.label ?? item.title ?? link)}</span>
            );
          })}
        </div>
      ) : null}

      {children}
    </header>
  );
}

export type SectionTitleProps = LooseProps & {
  eyebrow?: ReactNode;
  kicker?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
};

export function SectionTitle({
  eyebrow,
  kicker,
  title,
  description,
  subtitle,
  children,
  className,
  style
}: SectionTitleProps) {
  return (
    <div className={cx("ncd3-section-title", className)} style={style}>
      {eyebrow || kicker ? <div className="ncd3-eyebrow">{eyebrow ?? kicker}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {description || subtitle ? <p>{description ?? subtitle}</p> : null}
      {children}
    </div>
  );
}

export type DocCardProps = LooseProps & {
  title?: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  tone?: string;
};

export function DocCard({
  title,
  description,
  subtitle,
  href,
  children,
  className,
  style
}: DocCardProps) {
  const content = (
    <>
      {title ? <h3>{title}</h3> : null}
      {description || subtitle ? <p>{description ?? subtitle}</p> : null}
      {children}
    </>
  );

  if (href) {
    return (
      <a className={cx("ncd3-card", "ncd3-card-link", className)} style={style} href={href}>
        {content}
      </a>
    );
  }

  return (
    <article className={cx("ncd3-card", className)} style={style}>
      {content}
    </article>
  );
}

export type StatCardProps = LooseProps & {
  label?: ReactNode;
  value?: ReactNode;
  description?: ReactNode;
};

export function StatCard({ label, value, description, children, className, style }: StatCardProps) {
  return (
    <div className={cx("ncd3-stat-card", className)} style={style}>
      {label ? <span>{label}</span> : null}
      {value ? <strong>{value}</strong> : null}
      {description ? <p>{description}</p> : null}
      {children}
    </div>
  );
}

export type CodeBlockProps = LooseProps & {
  code?: string;
  value?: string;
  language?: string;
};

export function CodeBlock({ code, value, children, className, style }: CodeBlockProps) {
  const content = code ?? value ?? (typeof children === "string" ? children : "");

  return (
    <pre className={cx("ncd3-code-block", className)} style={style}>
      <code>{content || children}</code>
    </pre>
  );
}

export type CopyButtonProps = Omit<LooseProps, "children"> & {
  value?: string;
  text?: string;
  code?: string;
  label?: ReactNode;
  children?: ReactNode | ((props: { copied: boolean; copy: () => void }) => ReactNode);
};

export function CopyButton({ value, text, code, label, children, className, style }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copyValue = value ?? text ?? code ?? "";

  const copy = () => {
    void navigator.clipboard?.writeText(copyValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  if (typeof children === "function") {
    return <>{children({ copied, copy })}</>;
  }

  return (
    <button type="button" className={cx("ncd3-copy-button", className)} style={style} onClick={copy}>
      {children ?? label ?? (copied ? "Copied" : "Copy")}
    </button>
  );
}

type TableColumn =
  | string
  | {
      key?: string;
      accessor?: string;
      label?: ReactNode;
      title?: ReactNode;
      header?: ReactNode;
    };

export type DataTableProps = LooseProps & {
  title?: ReactNode;
  columns?: readonly TableColumn[];
  rows?: readonly unknown[];
  data?: readonly unknown[];
  items?: readonly unknown[];
};

function columnKey(column: TableColumn, index: number) {
  if (typeof column === "string") return column;
  return column.key ?? column.accessor ?? String(index);
}

function columnLabel(column: TableColumn) {
  if (typeof column === "string") return column;
  return column.label ?? column.title ?? column.header ?? column.key ?? column.accessor ?? "";
}

function rowCells(row: unknown, columns: readonly TableColumn[]) {
  if (Array.isArray(row)) return row;

  if (typeof row === "object" && row !== null) {
    const record = row as Record<string, unknown>;

    if (columns.length > 0) {
      return columns.map((column, index) => record[columnKey(column, index)]);
    }

    return Object.values(record);
  }

  return [row];
}

export function DataTable({
  title,
  columns = [],
  rows,
  data,
  items,
  children,
  className,
  style
}: DataTableProps) {
  const tableRows = rows ?? data ?? items ?? [];

  return (
    <div className={cx("ncd3-table-card", className)} style={style}>
      {title ? <h3>{title}</h3> : null}

      <table className="ncd3-table">
        {columns.length > 0 ? (
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{columnLabel(column)}</th>
              ))}
            </tr>
          </thead>
        ) : null}

        <tbody>
          {tableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {rowCells(row, columns).map((cell, cellIndex) => (
                <td key={cellIndex}>{renderUnknown(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {children}
    </div>
  );
}

export type TagListProps = LooseProps & {
  tags?: readonly unknown[];
  items?: readonly unknown[];
};

export function TagList({ tags, items, children, className, style }: TagListProps) {
  const values = tags ?? items ?? [];

  return (
    <div className={cx("ncd3-tag-list", className)} style={style}>
      {values.map((item, index) => (
        <span key={index}>{renderUnknown(item)}</span>
      ))}
      {children}
    </div>
  );
}

export type AnchorListProps = LooseProps & {
  items?: readonly unknown[];
  links?: readonly unknown[];
};

export function AnchorList({ items, links, children, className, style }: AnchorListProps) {
  const values = items ?? links ?? [];

  return (
    <nav className={cx("ncd3-anchor-list", className)} style={style}>
      {values.map((item, index) => {
        const record = typeof item === "object" && item !== null ? item as Record<string, unknown> : { label: item };
        const href = typeof record.href === "string" ? record.href : "#";
        return (
          <a key={index} href={href}>
            {renderUnknown(record.label ?? record.title ?? href)}
          </a>
        );
      })}
      {children}
    </nav>
  );
}

export type GroupSummaryProps = LooseProps & {
  groups?: readonly unknown[];
  items?: readonly unknown[];
};

export function GroupSummary({ groups, items, children, className, style }: GroupSummaryProps) {
  const values = groups ?? items ?? [];

  return (
    <div className={cx("ncd3-group-summary", className)} style={style}>
      {values.map((item, index) => {
        const record = typeof item === "object" && item !== null ? item as Record<string, unknown> : { title: item };

        return (
          <DocCard
            key={index}
            title={renderUnknown(record.title ?? record.label ?? item)}
            description={renderUnknown(record.description ?? record.summary ?? "")}
            href={typeof record.href === "string" ? record.href : undefined}
          />
        );
      })}
      {children}
    </div>
  );
}

export default DocsChrome;
