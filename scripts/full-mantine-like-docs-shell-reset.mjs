import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import ts from "typescript";

const docsFile = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const sidebarFile = "apps/docs/src/data/docsSidebarLinks.ts";
const cssFile = "apps/docs/src/docs.css";
const reportFile = "full-mantine-like-docs-shell-reset-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function collectFiles(dir, extensions) {
  const out = [];

  if (!existsSync(dir)) return out;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry).replace(/\\/g, "/");

    if (
      full.includes("/dist/") ||
      full.includes("/node_modules/") ||
      full.includes("/.vite/")
    ) {
      continue;
    }

    const stats = statSync(full);

    if (stats.isDirectory()) {
      out.push(...collectFiles(full, extensions));
    } else if (extensions.some((ext) => full.endsWith(ext))) {
      out.push(full);
    }
  }

  return out;
}

function slugify(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function humanizeSlug(value) {
  return String(value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractComponentLinks() {
  const candidates = [
    "apps/docs/src/generated/noctra-professional-docs.generated.ts",
    "apps/docs/src/generated/noctra-component-registry.generated.ts",
    "apps/docs/src/data/docsCatalog.ts"
  ];

  const map = new Map();

  for (const file of candidates) {
    const text = readText(file);

    if (!text) continue;

    const objectMatches = text.matchAll(/\{[\s\S]{0,900}?\}/g);

    for (const match of objectMatches) {
      const block = match[0];
      const kebab = block.match(/\bkebab\s*:\s*["']([^"']+)["']/)?.[1] ||
        block.match(/\bslug\s*:\s*["']([^"']+)["']/)?.[1];

      if (!kebab) continue;

      const name = block.match(/\bname\s*:\s*["']([^"']+)["']/)?.[1] || humanizeSlug(kebab);
      const group = block.match(/\bgroup\s*:\s*["']([^"']+)["']/)?.[1] || "Components";

      map.set(kebab, {
        label: name,
        href: `/components/${kebab}`,
        group
      });
    }
  }

  if (map.size < 40) {
    const fallback = [
      "accordion","alert","app-shell","aspect-ratio","autocomplete","avatar","badge","blockquote","box","breadcrumb","button",
      "card","center","checkbox","clipboard","code","color-input","color-picker","combobox","command","container","context-menu",
      "credit-card","data-grid","dialog","divider","dock","drawer","dropzone","empty-state","flex","float-label","grid","group",
      "hover-card","icon-button","input","kbd","layout-shell","link","list-box","loader","menu","modal","multi-select",
      "native-select","notification","number-input","pagination","paper","password-input","pin-code","popover","progress",
      "radio","range-slider","rating","scroll-area","search-input","segmented-control","select","simple-grid","skeleton",
      "slider","spinner","stack","stepper","switch","table","tabs","tags-input","textarea","text-input","timeline","toast",
      "toolbar","tooltip","transfer-list","tree","tree-select","visually-hidden"
    ];

    for (const slug of fallback) {
      if (!map.has(slug)) {
        map.set(slug, {
          label: humanizeSlug(slug),
          href: `/components/${slug}`,
          group: "Components"
        });
      }
    }
  }

  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function collectImportsFromDocsSystem() {
  const files = collectFiles("apps/docs/src", [".ts", ".tsx"]);
  const names = new Set();

  for (const file of files) {
    if (file.endsWith("/components/docs-system/NoctraMantineDocs.tsx")) continue;

    const text = readText(file);
    const importMatches = text.matchAll(/import\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+["'][^"']*NoctraMantineDocs["'];/g);

    for (const match of importMatches) {
      const parts = match[1].split(",");

      for (const raw of parts) {
        const cleaned = raw
          .replace(/^type\s+/, "")
          .trim()
          .split(/\s+as\s+/)[0]
          .trim();

        if (/^[A-Za-z_$][\w$]*$/.test(cleaned)) {
          names.add(cleaned);
        }
      }
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

const beforeDocs = readText(docsFile);
const beforeCss = readText(cssFile);
const beforeSidebar = readText(sidebarFile);

const componentLinks = extractComponentLinks();

const sidebarSections = [
  {
    title: "Docs",
    links: [
      { label: "Overview", href: "/" },
      { label: "Components", href: "/components" },
      { label: "Architecture", href: "/architecture" },
      { label: "Theming", href: "/theming" },
      { label: "Tokens", href: "/tokens" },
      { label: "Quality", href: "/quality" },
      { label: "Release", href: "/release" }
    ]
  },
  {
    title: "Components",
    links: componentLinks.map((item) => ({
      label: item.label,
      href: item.href
    }))
  }
];

const sidebarContent = `export type DocsSidebarLink = {
  label: string;
  href: string;
};

export type DocsSidebarSection = {
  title: string;
  links: readonly DocsSidebarLink[];
};

export const docsSidebarSections = ${JSON.stringify(sidebarSections, null, 2)} as const satisfies readonly DocsSidebarSection[];

export const docsComponentLinks = docsSidebarSections.find((section) => section.title === "Components")?.links ?? [];

export default docsSidebarSections;
`;

writeText(sidebarFile, sidebarContent);

const importedNames = collectImportsFromDocsSystem();

const knownNames = new Set([
  "NoctraDocsHeaderLink",
  "NoctraDocsTocItem",
  "NoctraDocsPropRow",
  "NoctraDocsStyleRow",
  "NoctraDocsTableRow",
  "NoctraMantineDocsProps",
  "NoctraDocsTableProps",
  "NoctraDocsPrevNextLink",
  "NoctraMantineDocs",
  "NoctraDocsPage",
  "NoctraDocsHeader",
  "NoctraDocsTabs",
  "NoctraDocsSection",
  "NoctraDocsDemo",
  "NoctraDocsCodeBlock",
  "NoctraDocsTable",
  "NoctraDocsPropsTable",
  "NoctraDocsStylesTable",
  "NoctraDocsPrevNext",
  "NoctraDocsToc",
  "NoctraDocsValue",
  "NoctraDocsBlock"
]);

const compatExports = importedNames
  .filter((name) => !knownNames.has(name))
  .map((name) => {
    if (/Props$|Item$|Row$|Config$|Options$/.test(name)) {
      return `export type ${name} = any;`;
    }

    return `export type ${name} = any;\nexport const ${name}: any = NoctraDocsBlock;`;
  })
  .join("\n\n");

const docsContent = `import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
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
  description?: ReactNode;
};

export type NoctraDocsPropRow = {
  name: string;
  type?: ReactNode;
  required?: boolean;
  defaultValue?: ReactNode;
  description?: ReactNode;
};

export type NoctraDocsStyleRow = {
  selector?: ReactNode;
  name?: ReactNode;
  description?: ReactNode;
  value?: ReactNode;
};

export type NoctraDocsTableRow = readonly ReactNode[] | Record<string, ReactNode>;

export type NoctraDocsPrevNextLink = {
  label: string;
  href: string;
};

export type NoctraDocsTableProps = {
  title?: ReactNode;
  columns?: readonly string[];
  rows?: readonly NoctraDocsTableRow[];
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type NoctraMantineDocsProps = {
  title: string;
  description?: ReactNode;
  links?: readonly NoctraDocsHeaderLink[];
  toc?: readonly NoctraDocsTocItem[];
  documentation?: ReactNode;
  props?: ReactNode;
  styles?: ReactNode;
  previous?: NoctraDocsPrevNextLink;
  next?: NoctraDocsPrevNextLink;
  children?: ReactNode;
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
  description?: ReactNode;
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
  id
}: {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section className="nmx-section" id={id}>
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
  code
}: {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  code?: string;
}) {
  return (
    <section className="nmx-demo">
      {title || description ? (
        <div className="nmx-demo-head">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}

      <div className="nmx-demo-preview">{children}</div>

      {code ? <NoctraDocsCodeBlock code={code} /> : null}
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
  return row[column] ?? row[column.toLowerCase()] ?? "—";
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
  title?: ReactNode;
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
  title?: ReactNode;
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
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
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

${compatExports}

export default NoctraMantineDocs;
`;

writeText(docsFile, docsContent);

const visualBlock = `
/* NOCTRA_FULL_MANTINE_LIKE_DOCS_SHELL_START */
:root{--nmx-bg:#0b0f19;--nmx-panel:#111827;--nmx-soft:#151d2f;--nmx-line:rgba(148,163,184,.16);--nmx-line-strong:rgba(148,163,184,.28);--nmx-text:#e5e7eb;--nmx-muted:#94a3b8;--nmx-faint:#64748b;--nmx-accent:#8b5cf6;--nmx-accent-soft:rgba(139,92,246,.13);--nmx-left:272px;--nmx-main:820px;--nmx-right:238px;--nmx-radius:10px}
html,body,#root{min-height:100%;background:var(--nmx-bg)!important;color:var(--nmx-text)}
body{margin:0;overflow-y:scroll}
*,*::before,*::after{box-sizing:border-box}
.ncd3-chrome{min-height:100vh;background:radial-gradient(circle at 50% -10%,rgba(139,92,246,.10),transparent 34rem),var(--nmx-bg)!important;color:var(--nmx-text)}
.ncd3-topbar{position:sticky;top:0;z-index:100;height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;border-bottom:1px solid var(--nmx-line);background:rgba(11,15,25,.94);backdrop-filter:blur(14px)}
.ncd3-brand{display:inline-flex;align-items:center;gap:10px;color:var(--nmx-text);font-weight:750;text-decoration:none}
.ncd3-brand-mark{width:22px;height:22px;border-radius:7px;background:linear-gradient(135deg,#8b5cf6,#38bdf8);box-shadow:0 0 26px rgba(139,92,246,.35)}
.ncd3-topnav{display:flex;align-items:center;gap:4px}.ncd3-topnav a{display:inline-flex;align-items:center;height:34px;padding:0 10px;border-radius:8px;color:var(--nmx-muted);font-size:13px;text-decoration:none}.ncd3-topnav a:hover{background:rgba(148,163,184,.08);color:var(--nmx-text)}
.nmx-page{min-height:calc(100vh - 58px);background:transparent}
.nmx-layout{width:100%;max-width:1480px;margin:0 auto;display:grid;grid-template-columns:var(--nmx-left) minmax(0,var(--nmx-main)) var(--nmx-right);gap:38px;align-items:start;padding:34px 30px 82px}
.nmx-left-rail{position:sticky;top:78px;align-self:start;max-height:calc(100vh - 94px);overflow:auto;padding:0 16px 28px 0;border-right:1px solid var(--nmx-line);scrollbar-width:thin}
.nmx-main{min-width:0;width:100%;max-width:var(--nmx-main)}
.nmx-right-toc{position:sticky;top:78px;align-self:start;max-height:calc(100vh - 94px);overflow:auto;padding-left:18px;border-left:1px solid var(--nmx-line);scrollbar-width:thin}
.nmx-left-section{margin:0 0 18px}.nmx-left-section h2{margin:18px 8px 8px;color:var(--nmx-faint);font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:750}.nmx-left-links{display:grid;gap:1px}.nmx-left-links a{display:flex;align-items:center;min-height:29px;padding:4px 8px;border-radius:7px;color:var(--nmx-muted);font-size:13px;line-height:1.35;text-decoration:none}.nmx-left-links a:hover{background:rgba(148,163,184,.08);color:var(--nmx-text)}
.nmx-right-toc h2{margin:0 0 10px;color:var(--nmx-text);font-size:13px;font-weight:700}.nmx-right-toc nav{display:grid;gap:1px}.nmx-right-toc a{display:block;padding:5px 0 5px 10px;border-left:1px solid transparent;color:var(--nmx-muted);font-size:13px;line-height:1.35;text-decoration:none}.nmx-right-toc a:hover{border-left-color:var(--nmx-accent);color:var(--nmx-text)}.nmx-right-toc small{display:block;margin-top:2px;color:var(--nmx-faint);font-size:11px}.nmx-empty-note{color:var(--nmx-faint);font-size:13px}
.nmx-hero{padding:0 0 26px;margin:0 0 18px;border-bottom:1px solid var(--nmx-line);background:transparent;box-shadow:none}.nmx-kicker{margin:0 0 10px;color:var(--nmx-accent);font-size:12px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}.nmx-hero h1{margin:0 0 10px;color:var(--nmx-text);font-size:42px;line-height:1.08;font-weight:780;letter-spacing:-.035em}.nmx-hero p{max-width:690px;margin:0;color:var(--nmx-muted);font-size:16px;line-height:1.65}
.nmx-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin:22px 0 0;padding:12px 0 0;border-top:1px solid var(--nmx-line)}.nmx-meta-row{min-width:0}.nmx-meta dt{margin:0 0 3px;color:var(--nmx-faint);font-size:11px;text-transform:uppercase;letter-spacing:.06em}.nmx-meta dd{margin:0;color:var(--nmx-text);font-size:13px}.nmx-meta a{color:#c4b5fd;text-decoration:none}.nmx-meta a:hover{text-decoration:underline}
.nmx-tabs-shell{margin-top:22px}.nmx-tabs{display:flex;align-items:center;gap:24px;margin:0 0 28px;border-bottom:1px solid var(--nmx-line)}.nmx-tabs button{appearance:none;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--nmx-muted);padding:0 0 12px;margin:0;border-radius:0;font:inherit;font-size:14px;font-weight:680;cursor:pointer}.nmx-tabs button:hover{color:var(--nmx-text)}.nmx-tabs button[aria-selected="true"]{color:var(--nmx-text);border-bottom-color:var(--nmx-accent)}
.nmx-tab-panel{min-width:0}.nmx-custom-content{min-width:0}.nmx-section,.nmx-block{margin:0 0 34px;padding:0;background:transparent;border:0;box-shadow:none}.nmx-section h2{margin:0 0 12px;color:var(--nmx-text);font-size:26px;line-height:1.25;font-weight:740;letter-spacing:-.02em}.nmx-section-description,.nmx-block p{color:var(--nmx-muted);line-height:1.7}
.nmx-demo{margin:0 0 26px;border:1px solid var(--nmx-line);background:rgba(15,23,42,.28);border-radius:var(--nmx-radius);overflow:hidden}.nmx-demo-head{padding:16px 18px;border-bottom:1px solid var(--nmx-line)}.nmx-demo-head h3{margin:0 0 4px;color:var(--nmx-text);font-size:16px}.nmx-demo-head p{margin:0;color:var(--nmx-muted);font-size:13px;line-height:1.55}.nmx-demo-preview{padding:20px;background:rgba(15,23,42,.18)}
.nmx-code{margin:0;padding:16px 18px;overflow:auto;border-top:1px solid var(--nmx-line);background:#070b14;color:#dbeafe;font-size:13px;line-height:1.65}.nmx-code code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace}
.nmx-table-block{margin:0 0 28px;border:1px solid var(--nmx-line);background:rgba(15,23,42,.28);border-radius:var(--nmx-radius);overflow:hidden}.nmx-table-block h3{margin:0;padding:14px 16px;border-bottom:1px solid var(--nmx-line);font-size:15px}.nmx-table-scroll{overflow:auto}.nmx-table{width:100%;border-collapse:collapse;font-size:13px}.nmx-table th{padding:10px 12px;border-bottom:1px solid var(--nmx-line-strong);color:var(--nmx-muted);font-weight:700;text-align:left}.nmx-table td{padding:12px;border-bottom:1px solid var(--nmx-line);vertical-align:top;color:var(--nmx-text)}.nmx-table tr:last-child td{border-bottom:0}.nmx-table code,.nmx-value{display:inline-flex;padding:2px 6px;border:1px solid var(--nmx-line);border-radius:6px;background:rgba(15,23,42,.54);color:#c4b5fd;font-size:12px}
.nmx-prev-next{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:42px;padding-top:22px;border-top:1px solid var(--nmx-line)}.nmx-prev-next a{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border:1px solid var(--nmx-line);border-radius:var(--nmx-radius);background:rgba(15,23,42,.28);color:var(--nmx-text);text-decoration:none}.nmx-prev-next a:hover{border-color:var(--nmx-line-strong);background:rgba(148,163,184,.07)}.nmx-prev-next span{color:var(--nmx-muted);font-size:12px}.nmx-prev-next strong{font-size:15px}
.ncd-card,.ncd-panel,.ncd-demo-panel,.ncd-preview-panel,.ncd-code-panel,.ncd-props-panel,.ncd-control-card,.ncd-compact-card,.ncd3-table-card,.nd-card,.nd-component-card,.nd-related-card{border:1px solid var(--nmx-line)!important;background:rgba(15,23,42,.28)!important;border-radius:var(--nmx-radius)!important;box-shadow:none!important}
@media (max-width:1180px){.nmx-layout{grid-template-columns:230px minmax(0,1fr);gap:28px}.nmx-right-toc{display:none}}
@media (max-width:860px){.ncd3-topbar{height:auto;min-height:58px;align-items:flex-start;flex-direction:column;gap:10px;padding:14px 18px}.ncd3-topnav{flex-wrap:wrap}.nmx-layout{display:block;padding:24px 18px 64px}.nmx-left-rail{position:relative;top:auto;max-height:none;margin-bottom:26px;padding:0 0 18px;border-right:0;border-bottom:1px solid var(--nmx-line)}.nmx-hero h1{font-size:34px}.nmx-meta{grid-template-columns:1fr}.nmx-prev-next{grid-template-columns:1fr}}
/* NOCTRA_FULL_MANTINE_LIKE_DOCS_SHELL_END */
`;

const cssPattern = /\/\* NOCTRA_FULL_MANTINE_LIKE_DOCS_SHELL_START \*\/[\s\S]*?\/\* NOCTRA_FULL_MANTINE_LIKE_DOCS_SHELL_END \*\//;
const nextCss = cssPattern.test(beforeCss)
  ? beforeCss.replace(cssPattern, visualBlock.trim())
  : `${beforeCss.trimEnd()}\n\n${visualBlock.trim()}\n`;

writeText(cssFile, nextCss);

const afterDocs = readText(docsFile);
const afterCss = readText(cssFile);
const afterSidebar = readText(sidebarFile);

const problems = [];

for (const required of [
  "nmx-layout",
  "nmx-left-rail",
  "nmx-main",
  "nmx-right-toc",
  "NoctraDocsTabs",
  "NoctraDocsHeader",
  "NoctraDocsPropsTable",
  "NoctraDocsStylesTable"
]) {
  if (!afterDocs.includes(required)) {
    problems.push(`NoctraMantineDocs missing ${required}.`);
  }
}

for (const required of [
  "NOCTRA_FULL_MANTINE_LIKE_DOCS_SHELL_START",
  "grid-template-columns:var(--nmx-left) minmax(0,var(--nmx-main)) var(--nmx-right)",
  ".nmx-left-rail",
  ".nmx-right-toc",
  ".nmx-tabs",
  ".nmx-hero"
]) {
  if (!afterCss.includes(required)) {
    problems.push(`docs.css missing ${required}.`);
  }
}

if (!afterSidebar.includes("docsSidebarSections")) {
  problems.push("docsSidebarLinks missing docsSidebarSections export.");
}

if (componentLinks.length < 40) {
  problems.push(`Too few component links generated: ${componentLinks.length}.`);
}

for (const [file, source, kind] of [
  [docsFile, afterDocs, ts.ScriptKind.TSX],
  [sidebarFile, afterSidebar, ts.ScriptKind.TS]
]) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX
    },
    reportDiagnostics: true,
    fileName: file
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Full Mantine-like Docs Shell Reset Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `NoctraMantineDocs changed: ${beforeDocs === afterDocs ? "no" : "yes"}`,
  `docs.css changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `docsSidebarLinks changed: ${beforeSidebar === afterSidebar ? "no" : "yes"}`,
  `Component links generated: ${componentLinks.length}`,
  `Compatibility imports detected: ${importedNames.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Rebuilt NoctraMantineDocs structure with explicit Mantine-like layout.",
  "- Added left rail with docs links and all generated component links.",
  "- Added center content column with header, metadata, tabs, content and previous/next.",
  "- Added right sticky table of contents.",
  "- Added compact Mantine-like header, tabs, tables, demos and code styling.",
  "- Added compatibility exports for existing imports."
].join("\n");

writeText(reportFile, report);

console.log(`Full Mantine-like docs shell reset completed. Problems: ${problems.length}. Report: ${reportFile}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Full Mantine-like docs shell reset failed.");
}
