import type { ReactNode } from "react";
import { docsHref } from "../lib/docsRouting";

export type NoctraStaticDocsPageProps = {
  page?: string;
  route?: string;
  title?: ReactNode;
  description?: ReactNode;
  activePath?: string;
};

const docsLinks = [
  { label: "Overview", href: "/overview/" }
];

const overviewCards = [
  {
    title: "Components",
    description: "Production-ready React components with predictable props, states, slots and styling hooks."
  },
  {
    title: "Design tokens",
    description: "Dark-first semantic tokens for surfaces, borders, text, focus, feedback and component states."
  },
  {
    title: "Styles API",
    description: "Each component exposes stable selectors, CSS variables and data attributes for controlled customization."
  },
  {
    title: "Configurator",
    description: "Component pages include interactive controls that update preview state and generated usage examples."
  }
];

const overviewStats = [
  { label: "Component pages", value: "100+" },
  { label: "Docs shell", value: "Unified" },
  { label: "Routing", value: "Stable" },
  { label: "Theme", value: "Dark-first" }
];

function getPageTitle(page?: string, title?: ReactNode) {
  if (title) return title;

  if (page === "overview" || !page) return "Overview";

  return page
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPageDescription(page?: string, description?: ReactNode) {
  if (description) return description;

  if (page === "overview" || !page) {
    return "Noctra is a dark-first React component system focused on clean APIs, premium surfaces, stable styling hooks and production documentation.";
  }

  return "Noctra documentation page.";
}

export function NoctraStaticDocsPage({
  page = "overview",
  title,
  description,
  activePath = "/overview/"
}: NoctraStaticDocsPageProps) {
  const pageTitle = getPageTitle(page, title);
  const pageDescription = getPageDescription(page, description);
  const normalizedActivePath = activePath.endsWith("/") ? activePath : `${activePath}/`;

  return (
    <div className="nmx-static-page nmx-overview-page">
      <aside className="nmx-left-rail" aria-label="Docs navigation">
        <div className="nmx-rail-section">
          <div className="nmx-rail-title">Docs</div>
          <nav className="nmx-rail-links">
            {docsLinks.map((item) => (
              <a
                key={item.href}
                href={docsHref(item.href)}
                className="nmx-rail-link"
                data-active={item.href === normalizedActivePath ? "true" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <main className="nmx-static-content">
        <header className="nmx-hero nmx-overview-hero">
          <div>
            <p className="nmx-eyebrow">Noctra Docs</p>
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>

          <div className="nmx-overview-actions" aria-label="Overview actions">
            <a href={docsHref("/components/button/")}>View components</a>
            <a href={docsHref("/components/card/")}>Open Card docs</a>
          </div>
        </header>

        <section className="nmx-overview-stats" aria-label="Overview stats">
          {overviewStats.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="nmx-section-card nmx-overview-section" id="overview">
          <div className="nmx-section-heading">
            <p className="nmx-eyebrow">Foundation</p>
            <h2>Built like the component pages</h2>
            <p>
              This overview now uses the same spacing, dark surface language, left rail behavior and content rhythm as the component documentation pages.
            </p>
          </div>

          <div className="nmx-overview-grid">
            {overviewCards.map((card) => (
              <article key={card.title} className="nmx-overview-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="nmx-section-card nmx-overview-section">
          <div className="nmx-section-heading">
            <p className="nmx-eyebrow">Workflow</p>
            <h2>Recommended next path</h2>
            <p>
              Continue from component pages first. They now carry the registry-driven props, Styles API and preview polish work.
            </p>
          </div>

          <div className="nmx-overview-flow">
            <a href={docsHref("/components/button/")}>Button</a>
            <a href={docsHref("/components/input/")}>Input</a>
            <a href={docsHref("/components/select/")}>Select</a>
            <a href={docsHref("/components/modal/")}>Modal</a>
            <a href={docsHref("/components/table/")}>Table</a>
          </div>
        </section>
      </main>

      <aside className="nmx-right-toc" aria-label="Table of contents">
        <div className="nmx-toc-title">On this page</div>
        <a href="#overview">Overview</a>
        <a href="#overview">Foundation</a>
      </aside>
    </div>
  );
}

export default NoctraStaticDocsPage;
