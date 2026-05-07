import { docsComponentLinks } from "../data/docsSidebarLinks";

export type NoctraStaticDocsPageProps = {
  title: string;
  description: string;
  activePath?: string;
  group?: string;
};

const docsLinks = [
  { label: "Overview", href: "/overview/" }
];

function withSlash(path: string) {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "") + "/";
}

function hrefFor(path: string) {
  if (/^https?:\/\//.test(path)) return path;

  const base = (import.meta.env.BASE_URL || "/noctra/").replace(/\/+$/, "");
  const clean = withSlash(path);

  return clean === "/" ? base + "/" : base + clean;
}

function isActive(activePath: string | undefined, href: string) {
  if (!activePath) return false;
  return withSlash(activePath) === withSlash(href);
}

export function NoctraStaticDocsPage({
  title,
  description,
  activePath = "/",
  group = "Docs"
}: NoctraStaticDocsPageProps) {
  return (
    <main className="nmx-static-page">
      <aside className="nmx-left-rail nmx-static-left">
        <div className="nmx-rail-title">Noctra</div>

        <nav className="nmx-nav-group" aria-label="Docs">
          <strong>Docs</strong>
          {docsLinks.map((item) => (
            <a key={item.href} href={hrefFor(item.href)} data-active={isActive(activePath, item.href) ? "true" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <nav className="nmx-nav-group" aria-label="Components">
          <strong>Components</strong>
          {docsComponentLinks.map((item) => (
            <a key={item.href} href={hrefFor(item.href)} data-active={isActive(activePath, item.href) ? "true" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <section className="nmx-static-content">
        <header className="nmx-hero">
          <span className="nmx-eyebrow">{group}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="nmx-meta">
            <span>Unified shell</span>
            <span>Clean routes</span>
            <span>Docs system</span>
          </div>
        </header>

        <div className="nmx-tabs" role="tablist" aria-label="Page sections">
          <button type="button" data-active="true">Documentation</button>
          <button type="button">Structure</button>
          <button type="button">Quality</button>
        </div>

        <section className="nmx-section-card">
          <h2>Documentation</h2>
          <p>
            This page uses the same documentation shell, sidebar rhythm, content width and surface treatment as component pages.
          </p>
        </section>

        <section className="nmx-section-card">
          <h2>System contract</h2>
          <p>
            Component pages remain the source of detailed previews, props and Styles API. General docs pages now share the same layout language.
          </p>
        </section>
      </section>

      <aside className="nmx-right-toc nmx-static-toc">
        <strong>On this page</strong>
        <a href="#documentation">Documentation</a>
        <a href="#structure">Structure</a>
        <a href="#quality">Quality</a>
      </aside>
    </main>
  );
}

export default NoctraStaticDocsPage;
