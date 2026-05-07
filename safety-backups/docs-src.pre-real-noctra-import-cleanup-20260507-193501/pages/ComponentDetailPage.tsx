import {
  AnchorList,
  CodeBlock,
  DataTable,
  DocCard,
  PageHero,
  SectionTitle,
  StatCard,
  TagList
} from "../components/DocsChrome";
import { InteractiveComponentDemo } from "../components/InteractiveComponentDemo";
import { MantineStyleComponentDocs } from "../components/MantineStyleComponentDocs";
import { getCategoryLabel, getPropDescription } from "../data/propDescriptions";
import { noctraDocsComponents, type NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";
import { docsHref } from "../lib/docsRouting";
import { ButtonReferencePage } from "./ButtonReferencePage";

const componentPageAnchors = [
  { href: "#usage", label: "Usage", description: "Import and basic usage" },
  { href: "#playground", label: "Playground", description: "Interactive controls" },
  { href: "#examples", label: "Examples", description: "Variants, tones, sizes, states" },
  { href: "#controlled", label: "Controlled", description: "State-driven examples" },
  { href: "#compound", label: "Compound", description: "Composition patterns" },
  { href: "#props", label: "Props", description: "Component API" },
  { href: "#accessibility", label: "Accessibility", description: "Keyboard and ARIA notes" },
  { href: "#related", label: "Related", description: "Similar components" }
] as const;

const controlledComponents = new Set([
  "Accordion",
  "Autocomplete",
  "Checkbox",
  "Combobox",
  "ListBox",
  "Menu",
  "Modal",
  "Drawer",
  "Dialog",
  "MultiSelect",
  "NumberInput",
  "Pagination",
  "Radio",
  "SearchInput",
  "Select",
  "Slider",
  "Switch",
  "Tabs",
  "TagsInput",
  "TextInput",
  "Textarea",
  "Tree",
  "TreeSelect",
  "TransferList"
]);

const compoundComponents = new Set([
  "Accordion",
  "Breadcrumbs",
  "Command",
  "DataTable",
  "Dialog",
  "Drawer",
  "Menu",
  "Modal",
  "Popover",
  "Radio",
  "Select",
  "Tabs",
  "Table",
  "Tree",
  "Toolbar"
]);

function hasProp(component: NoctraDocsComponent, propName: string) {
  return component.props.some((prop) => prop.name === propName);
}

function getImportCode(component: NoctraDocsComponent) {
  return `import { ${component.name} } from "${component.importPath}";`;
}

function getUsageCode(component: NoctraDocsComponent) {
  return `import { ${component.name} } from "${component.importPath}";

export function Demo() {
  return (
    <${component.name}>
      ${component.name} content
    </${component.name}>
  );
}`;
}

function getControlledCode(component: NoctraDocsComponent) {
  if (hasProp(component, "checked") || hasProp(component, "defaultChecked")) {
    return `import { useState } from "react";
import { ${component.name} } from "${component.importPath}";

export function Demo() {
  const [checked, setChecked] = useState(true);

  return (
    <${component.name}
      checked={checked}
      onChange={setChecked}
    />
  );
}`;
  }

  if (hasProp(component, "open") || hasProp(component, "defaultOpen")) {
    return `import { useState } from "react";
import { ${component.name} } from "${component.importPath}";

export function Demo() {
  const [open, setOpen] = useState(true);

  return (
    <${component.name}
      open={open}
      onOpenChange={setOpen}
    />
  );
}`;
  }

  if (hasProp(component, "value") || hasProp(component, "defaultValue")) {
    return `import { useState } from "react";
import { ${component.name} } from "${component.importPath}";

export function Demo() {
  const [value, setValue] = useState("");

  return (
    <${component.name}
      value={value}
      onChange={setValue}
    />
  );
}`;
  }

  return `import { ${component.name} } from "${component.importPath}";

export function Demo() {
  return <${component.name} />;
}`;
}

function getCompoundCode(component: NoctraDocsComponent) {
  if (component.name === "Tabs") {
    return `import { Tabs } from "${component.importPath}";

export function Demo() {
  return (
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="usage">Usage</Tabs.Tab>
        <Tabs.Tab value="api">API</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="usage">Usage content</Tabs.Panel>
      <Tabs.Panel value="api">API content</Tabs.Panel>
    </Tabs>
  );
}`;
  }

  if (component.name === "Accordion") {
    return `import { Accordion } from "${component.importPath}";

export function Demo() {
  return (
    <Accordion defaultValue="usage">
      <Accordion.Item value="usage">
        <Accordion.Control>Usage</Accordion.Control>
        <Accordion.Panel>Use the component from @noctra/react.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}`;
  }

  if (component.name === "Menu") {
    return `import { Menu } from "${component.importPath}";

export function Demo() {
  return (
    <Menu>
      <Menu.Target>Actions</Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item>Archive</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}`;
  }

  return `import { ${component.name} } from "${component.importPath}";

export function Demo() {
  return (
    <${component.name}>
      <${component.name}.Header>${component.name} header</${component.name}.Header>
      <${component.name}.Body>${component.name} body</${component.name}.Body>
    </${component.name}>
  );
}`;
}

function getAccessibilityNotes(component: NoctraDocsComponent) {
  const notes: string[] = [];

  if (hasProp(component, "aria-label")) {
    notes.push("Supports accessible naming through aria-label.");
  }

  if (hasProp(component, "disabled")) {
    notes.push("Disabled state should remove the component from normal interaction.");
  }

  if (hasProp(component, "checked") || hasProp(component, "defaultChecked")) {
    notes.push("Checked state should be announced by assistive technologies.");
  }

  if (hasProp(component, "open") || hasProp(component, "defaultOpen")) {
    notes.push("Open state should preserve focus management and escape-key behavior where applicable.");
  }

  if (["Menu", "Tabs", "Accordion", "Select", "Combobox", "Tree", "TreeSelect"].includes(component.name)) {
    notes.push("Keyboard navigation must be documented and tested for this interactive pattern.");
  }

  if (notes.length === 0) {
    notes.push("Use semantic markup, visible focus states, and meaningful labels when composing this component.");
  }

  return notes;
}

export function ComponentDetailPage({ component }: { component: NoctraDocsComponent }) {
  if (component.name === "Button") {
    return <ButtonReferencePage component={component} />;
  }

  const relatedComponents = noctraDocsComponents
    .filter((item) => item.group === component.group && item.name !== component.name)
    .slice(0, 8);

  const propRows = component.props.map((prop) => {
    const metadata = getPropDescription(component.name, prop.name);

    return [
      <code>{prop.name}</code>,
      <code>{prop.type}</code>,
      prop.required ? "Required" : "Optional",
      getCategoryLabel(metadata.category),
      metadata.description
    ];
  });

  const importCode = getImportCode(component);
  const usageCode = getUsageCode(component);
  const supportsControlled = controlledComponents.has(component.name) || hasProp(component, "value") || hasProp(component, "checked") || hasProp(component, "open");
  const supportsCompound = compoundComponents.has(component.name);
  const accessibilityNotes = getAccessibilityNotes(component);

  return (
    <div className="nd-detail-layout">
      <div className="nd-detail-main">
        <PageHero
          eyebrow={component.group}
          title={component.name}
          description={component.description}
        >
          <div className="nd-stats-grid">
            <StatCard label="Package" value={component.importPath} />
            <StatCard label="Props" value={component.props.length} />
            <StatCard label="Variants" value={component.variants.length} />
            <StatCard label="Tokens" value={component.tokens.length} />
          </div>
        </PageHero>

        <section id="usage" className="nd-doc-section">
          <SectionTitle
            id="usage-title"
            eyebrow="Usage"
            title="Import and basic usage"
            description="Use the public React package import in application code."
          />

          <div className="nd-two-grid">
            <DocCard title="Import">
              <CodeBlock>{importCode}</CodeBlock>
            </DocCard>

            <DocCard title="Basic example">
              <CodeBlock>{usageCode}</CodeBlock>
            </DocCard>
          </div>
        </section>

        <section id="playground" className="nd-doc-section">
          <InteractiveComponentDemo component={component} />
        </section>

        <section id="examples" className="nd-doc-section">
          <SectionTitle
            id="examples-title"
            eyebrow="Examples"
            title="Variants, tones, sizes, radius, density, and states"
            description="Examples are generated from component metadata and component-specific safe presets."
          />

          <MantineStyleComponentDocs component={component} />
        </section>

        {supportsControlled ? (
          <section id="controlled" className="nd-doc-section">
            <SectionTitle
              id="controlled-title"
              eyebrow="Controlled"
              title="Controlled usage"
              description="Interactive components should expose a predictable state-driven API."
            />

            <DocCard title="Controlled example">
              <CodeBlock>{getControlledCode(component)}</CodeBlock>
            </DocCard>
          </section>
        ) : null}

        {supportsCompound ? (
          <section id="compound" className="nd-doc-section">
            <SectionTitle
              id="compound-title"
              eyebrow="Compound"
              title="Compound usage"
              description="Compound components should document their expected composition pattern."
            />

            <DocCard title="Composition example">
              <CodeBlock>{getCompoundCode(component)}</CodeBlock>
            </DocCard>
          </section>
        ) : null}

        <section id="props" className="nd-doc-section">
          <SectionTitle
            id="props-title"
            eyebrow="Props"
            title="Props API"
            description="Prop metadata is extracted from the component source and enhanced with documentation descriptions."
          />

          <DocCard title="Props">
            <DataTable columns={["Prop", "Type", "Required", "Category", "Description"]} rows={propRows} />
          </DocCard>
        </section>

        <section id="accessibility" className="nd-doc-section">
          <SectionTitle
            id="accessibility-title"
            eyebrow="Accessibility"
            title="Accessibility"
            description="Use these notes as the baseline for accessible implementation and examples."
          />

          <DocCard title="Accessibility notes">
            <ul>
              {accessibilityNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </DocCard>
        </section>

        <section id="related" className="nd-doc-section">
          <SectionTitle
            id="related-title"
            eyebrow="Related"
            title={`More ${component.group} components`}
            description="Related components use the same clean /noctra route base."
          />

          <div className="nd-related-grid">
            {relatedComponents.map((item) => (
              <a key={item.name} className="nd-related-card" href={docsHref(`/components/${item.kebab}`)}>
                <strong>{item.name}</strong>
                <span>{item.description}</span>
              </a>
            ))}
          </div>

          <div className="nd-two-grid">
            <DocCard title="Anatomy">
              <TagList items={component.anatomy} />
            </DocCard>

            <DocCard title="Tokens">
              <TagList items={component.tokens} />
            </DocCard>
          </div>
        </section>
      </div>

      <aside className="nd-detail-aside">
        <AnchorList items={componentPageAnchors} />
      </aside>
    </div>
  );
}
