import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const chromePath = "apps/docs/src/components/DocsChrome.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "docschrome-native-exports-restore-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const beforeChrome = readText(chromePath);
const beforeCss = readText(cssPath);

if (!beforeChrome) {
  throw new Error(`${chromePath} missing or empty.`);
}

if (!beforeCss) {
  throw new Error(`${cssPath} missing or empty.`);
}

const chrome = `import {
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
`;

writeText(chromePath, chrome);

let css = beforeCss;

const cssBlock = `
/* NOCTRA_DOCSCHROME_NATIVE_EXPORTS_START */
.ncd3-chrome{min-height:100vh;background:var(--nc-page-bg,#050812);color:var(--nc-text,#f8fafc)}
.ncd3-topbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:58px;padding:0 24px;border-bottom:1px solid rgba(148,163,184,.14);background:rgba(5,8,18,.86);backdrop-filter:blur(14px)}
.ncd3-brand{display:inline-flex;align-items:center;gap:10px;color:inherit;text-decoration:none;font-weight:800;letter-spacing:-.02em}
.ncd3-brand-mark{width:18px;height:18px;border-radius:6px;background:linear-gradient(135deg,#8b5cf6,#06b6d4);box-shadow:0 0 24px rgba(139,92,246,.35)}
.ncd3-topnav{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.ncd3-topnav a{display:inline-flex;align-items:center;min-height:32px;padding:0 10px;border-radius:8px;color:var(--nc-text-muted,#a7b2c3);text-decoration:none;font-size:13px}
.ncd3-topnav a:hover{background:rgba(148,163,184,.1);color:var(--nc-text,#f8fafc)}
.ncd3-content{min-width:0}
.ncd3-page-hero{padding:42px 24px 24px;max-width:1120px;margin:0 auto;border-bottom:1px solid rgba(148,163,184,.12)}
.ncd3-page-hero h1{font-size:42px;line-height:1.08;letter-spacing:-.045em;margin:8px 0 10px}
.ncd3-page-hero p,.ncd3-section-title p,.ncd3-card p,.ncd3-stat-card p{color:var(--nc-text-muted,#a7b2c3);line-height:1.65}
.ncd3-eyebrow{font-size:10px;line-height:1;letter-spacing:.13em;text-transform:uppercase;color:var(--nc-color-primary-300,#9b7cff);font-weight:800;margin:0 0 9px}
.ncd3-actions,.ncd3-link-grid,.ncd3-stat-grid,.ncd3-group-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:16px}
.ncd3-section-title{margin:0 0 16px}
.ncd3-section-title h2{font-size:24px;line-height:1.2;margin:0 0 8px}
.ncd3-card,.ncd3-stat-card,.ncd3-table-card{display:block;border:1px solid rgba(148,163,184,.16);background:rgba(15,23,42,.42);border-radius:12px;padding:16px;color:inherit;text-decoration:none}
.ncd3-card h3,.ncd3-table-card h3{font-size:16px;margin:0 0 8px}
.ncd3-card-link:hover{border-color:rgba(139,92,246,.42);background:rgba(15,23,42,.58)}
.ncd3-stat-card span{font-size:12px;color:var(--nc-text-muted,#a7b2c3)}
.ncd3-stat-card strong{display:block;font-size:22px;margin-top:4px}
.ncd3-code-block{display:block;overflow:auto;margin:12px 0;padding:14px;border-radius:10px;background:rgba(2,6,23,.78);border:1px solid rgba(148,163,184,.13);font-size:12px;line-height:1.58;color:#dbeafe}
.ncd3-copy-button{appearance:none;border:1px solid rgba(148,163,184,.2);background:rgba(15,23,42,.46);color:var(--nc-text,#f8fafc);border-radius:8px;min-height:30px;padding:0 12px;font:inherit;font-size:13px;cursor:pointer}
.ncd3-copy-button:hover{background:rgba(148,163,184,.12)}
.ncd3-table{width:100%;border-collapse:collapse;font-size:13px}
.ncd3-table th{text-align:left;font-weight:700;color:var(--nc-text,#f5f7fb);padding:11px 12px;border-bottom:1px solid rgba(148,163,184,.18)}
.ncd3-table td{vertical-align:top;padding:11px 12px;border-bottom:1px solid rgba(148,163,184,.11);color:var(--nc-text-muted,#a7b2c3)}
.ncd3-tag-list{display:flex;gap:8px;flex-wrap:wrap}
.ncd3-tag-list span{display:inline-flex;align-items:center;min-height:24px;padding:0 8px;border-radius:999px;border:1px solid rgba(148,163,184,.16);background:rgba(2,6,23,.3);font-size:12px;color:var(--nc-text-muted,#a7b2c3)}
.ncd3-anchor-list{display:flex;flex-direction:column;gap:6px}
.ncd3-anchor-list a{color:var(--nc-text-muted,#a7b2c3);text-decoration:none;font-size:13px}
.ncd3-anchor-list a:hover{color:var(--nc-text,#fff)}
@media (max-width:760px){.ncd3-topbar{padding:12px 14px;align-items:flex-start;flex-direction:column;height:auto}.ncd3-topnav{width:100%}.ncd3-page-hero{padding:28px 14px 20px}.ncd3-page-hero h1{font-size:34px}}
/* NOCTRA_DOCSCHROME_NATIVE_EXPORTS_END */
`;

const blockPattern = /\/\* NOCTRA_DOCSCHROME_NATIVE_EXPORTS_START \*\/[\s\S]*?\/\* NOCTRA_DOCSCHROME_NATIVE_EXPORTS_END \*\//;

if (blockPattern.test(css)) {
  css = css.replace(blockPattern, cssBlock.trim());
} else {
  css = `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;
}

writeText(cssPath, css);

const afterChrome = readText(chromePath);
const afterCss = readText(cssPath);
const requiredExports = [
  "DocsChrome",
  "DocsRoute",
  "PageHero",
  "SectionTitle",
  "DocCard",
  "StatCard",
  "CodeBlock",
  "CopyButton",
  "DataTable",
  "TagList",
  "AnchorList",
  "GroupSummary"
];

const problems = [];

for (const exportName of requiredExports) {
  if (!new RegExp(`export function ${exportName}\\b`).test(afterChrome)) {
    problems.push(`Missing export function ${exportName}.`);
  }
}

if (afterChrome.includes("@noctra/react")) {
  problems.push("DocsChrome still imports @noctra/react.");
}

if (afterChrome.includes("#/")) {
  problems.push("DocsChrome still contains #/ hash route fragment.");
}

if (!afterCss.includes(".ncd3-card")) {
  problems.push("docs.css missing native DocsChrome card styles.");
}

const syntaxResult = ts.transpileModule(afterChrome, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: chromePath
});

for (const diagnostic of syntaxResult.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# DocsChrome Native Exports Restore Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Chrome changed: ${beforeChrome === afterChrome ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Required exports: ${requiredExports.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Required exports",
  "",
  ...requiredExports.map((item) => `- ${item}`),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Restored previous DocsChrome helper export API.",
  "- Kept DocsChrome native and decoupled from @noctra/react.",
  "- Fixed chromeLinks external typing.",
  "- Added native styles for cards, tables, code blocks, tags, anchors and hero sections."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`DocsChrome native exports restore completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("DocsChrome native exports restore failed.");
}
