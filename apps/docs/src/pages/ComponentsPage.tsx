import { useMemo, useState } from "react";
import { DocCard, PageHero, TagList } from "../components/DocsChrome";
import { noctraDocsComponents, noctraDocsGroups } from "../generated/noctra-professional-docs.generated";

export function ComponentsPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");

  const filteredComponents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return noctraDocsComponents.filter((component) => {
      const matchesGroup = group === "All" || component.group === group;
      const matchesQuery = normalizedQuery.length === 0 || component.name.toLowerCase().includes(normalizedQuery) || component.kebab.toLowerCase().includes(normalizedQuery) || component.description.toLowerCase().includes(normalizedQuery);
      return matchesGroup && matchesQuery;
    });
  }, [group, query]);

  return (
    <div className="nd-page-stack">
      <PageHero
        eyebrow="Component catalog"
        title="Every Noctra component, generated from source."
        description="Browse the full component inventory with generated detail pages, curated examples, props metadata, tokens, anatomy, integration status, and related components."
      />

      <div className="nd-toolbar">
        <input className="nd-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search components..." aria-label="Search components" />
        <select className="nd-select" value={group} onChange={(event) => setGroup(event.target.value)} aria-label="Filter by group">
          <option value="All">All groups</option>
          {noctraDocsGroups.map((item) => <option key={item.group} value={item.group}>{item.group} ({item.count})</option>)}
        </select>
      </div>

      <div className="nd-component-grid">
        {filteredComponents.map((component) => (
          <a className="nd-component-card" key={component.name} href={`#/components/${component.kebab}`}>
            <div>
              <span>{component.group}</span>
              <h3>{component.name}</h3>
              <p>{component.description}</p>
            </div>
            <div className="nd-component-meta">
              <strong>{component.props.length}</strong><small>props</small>
              <strong>{component.tokens.length}</strong><small>tokens</small>
              <strong>{component.anatomy.length}</strong><small>slots</small>
            </div>
            <TagList items={component.variants.length > 0 ? component.variants : component.anatomy} limit={5} />
          </a>
        ))}
      </div>
    </div>
  );
}