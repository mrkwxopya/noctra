import { useMemo, useState } from "react";
import { Grid, Stack, Group } from "@noctra/react";
import { DocCard, PageHero, TagList } from "../components/DocsChrome";
import { noctraDocsComponents, noctraDocsGroups } from "../generated/noctra-professional-docs.generated";

export function ComponentsPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");

  const filteredComponents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return noctraDocsComponents.filter((component) => {
      const matchesGroup = group === "All" || component.group === group;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        component.name.toLowerCase().includes(normalizedQuery) ||
        component.kebab.toLowerCase().includes(normalizedQuery) ||
        component.description.toLowerCase().includes(normalizedQuery);

      return matchesGroup && matchesQuery;
    });
  }, [group, query]);

  return (
    <Stack gap="1.5rem">
      <div className="nd-docs-status-strip"><strong>Professional docs coverage</strong><span>Generated component pages, searchable inventory, curated examples, props metadata, tokens, anatomy, and release gates.</span></div>

      <PageHero
        eyebrow="Component inventory"
        title="Generated component documentation"
        description="Browse every public component, inspect package integration status, and open generated detail pages with props, anatomy, variants, tokens, and import examples."
      />

      <div className="nd-toolbar">
        <input
          className="nd-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components..."
          aria-label="Search components"
        />

        <select className="nd-select" value={group} onChange={(event) => setGroup(event.target.value)} aria-label="Filter by group">
          <option value="All">All groups</option>
          {noctraDocsGroups.map((item) => (
            <option key={item.group} value={item.group}>
              {item.group} ({item.count})
            </option>
          ))}
        </select>
      </div>

      <Grid columns={3} gap="1rem">
        {filteredComponents.map((component) => (
          <a className="nd-card-link" key={component.name} href={`#/components/${component.kebab}`}>
            <DocCard title={component.name} description={component.description}>
              <Stack gap="0.75rem">
                <Group gap="0.5rem" wrap="wrap">
                  <span className="nd-badge">{component.group}</span>
                  <span className="nd-badge" data-ok={component.hasTypes || undefined}>types</span>
                  <span className="nd-badge" data-ok={component.hasStyle || undefined}>css</span>
                  <span className="nd-badge" data-ok={component.hasTokens || undefined}>tokens</span>
                </Group>

                <TagList items={component.variants.length > 0 ? component.variants : component.anatomy} limit={8} />
              </Stack>
            </DocCard>
          </a>
        ))}
      </Grid>
    </Stack>
  );
}