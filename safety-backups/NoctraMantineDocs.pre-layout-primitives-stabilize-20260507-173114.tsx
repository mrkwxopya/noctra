import {
  useMemo,
  useState,
  type ElementType,
  type ReactNode
} from "react";
import * as NoctraReact from "@noctra/react";

type RuntimeComponent = ElementType<any>;
type AnyProps = Record<string, any>;

const runtime = NoctraReact as AnyProps;

const Box = (runtime.Box ?? "div") as RuntimeComponent;
const Stack = (runtime.Stack ?? "div") as RuntimeComponent;
const Group = (runtime.Group ?? "div") as RuntimeComponent;
const Card = (runtime.Card ?? "section") as RuntimeComponent;
const Button = (runtime.Button ?? "button") as RuntimeComponent;
const TextInput = (runtime.TextInput ?? "input") as RuntimeComponent;
const CodeBlockRuntime = (runtime.CodeBlock ?? "pre") as RuntimeComponent;
const InlineCodeRuntime = (runtime.InlineCode ?? "code") as RuntimeComponent;
const TableRuntime = (runtime.Table ?? "table") as RuntimeComponent;
const hasRuntimeTable = Boolean(runtime.Table);

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

export function NoctraDocsShell({
  children,
  toc
}: {
  children: ReactNode;
  toc?: readonly NoctraDocsTocItem[];
}) {
  return (
    <Box className="nd-detail-layout" data-noctra-docs-system="shell">
      <Box className="nd-detail-main">{children}</Box>
      {toc && toc.length > 0 ? (
        <aside className="nd-detail-aside">
          <NoctraDocsToc items={toc} />
        </aside>
      ) : null}
    </Box>
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
    <Card className="nd-card" data-noctra-docs-system="header">
      <Stack className="nd-stack">
        <Box className="nd-kicker">Component</Box>
        <h1>{title}</h1>
        <p>{description}</p>

        {links && links.length > 0 ? (
          <Box className="nd-related-grid">
            {links.map((link) => {
              const LinkWrapper = (link.href ? "a" : Card) as RuntimeComponent;

              return (
                <LinkWrapper key={`${link.label}-${link.value}`} className="nd-related-card" {...(link.href ? { href: link.href } : {})}>
                  <strong>{link.label}</strong>
                  <span>{link.value}</span>
                </LinkWrapper>
              );
            })}
          </Box>
        ) : null}
      </Stack>
    </Card>
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
    <Group className="nd-related-grid" data-noctra-docs-system="tabs" role="tablist">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={active === tab.value}
          variant={active === tab.value ? "filled" : "outline"}
          tone={active === tab.value ? "primary" : "neutral"}
          size="sm"
          radius="md"
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </Button>
      ))}
    </Group>
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
    <section id={id} className="nd-doc-section">
      {eyebrow ? <Box className="nd-kicker">{eyebrow}</Box> : null}
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
    <Card className="nd-card" data-noctra-docs-system="demo">
      <Stack className="nd-stack">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}

        <Box className="nd-two-grid">
          <Card className="nd-related-card">
            <strong>Preview</strong>
            <Box className="nd-related-grid">{preview}</Box>
          </Card>

          <Card className="nd-related-card">
            <strong>Code</strong>
            <NoctraCodeBlock code={code} />
          </Card>
        </Box>

        {controls ? <Box>{controls}</Box> : null}
      </Stack>
    </Card>
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
    <Card className="nd-related-card" data-noctra-docs-system="control-group">
      <strong>{label}</strong>
      <Group className="nd-related-grid">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={value === option ? "filled" : "subtle"}
            tone={value === option ? "primary" : "neutral"}
            size="sm"
            radius="md"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
          >
            {option}
          </Button>
        ))}
      </Group>
    </Card>
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
    <Card className="nd-related-card" data-noctra-docs-system="boolean-control">
      <strong>{label}</strong>
      <Group className="nd-related-grid">
        <Button
          type="button"
          variant={!checked ? "filled" : "subtle"}
          tone={!checked ? "primary" : "neutral"}
          size="sm"
          radius="md"
          onClick={() => onChange(false)}
          aria-pressed={!checked}
        >
          Off
        </Button>

        <Button
          type="button"
          variant={checked ? "filled" : "subtle"}
          tone={checked ? "primary" : "neutral"}
          size="sm"
          radius="md"
          onClick={() => onChange(true)}
          aria-pressed={checked}
        >
          On
        </Button>
      </Group>
    </Card>
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
    <Stack className="nd-stack" data-noctra-docs-system="props-panel">
      <TextInput
        value={query}
        placeholder="Search props"
        onChange={(event: { currentTarget: { value: string } }) => setQuery(event.currentTarget.value)}
      />

      <Card className="nd-card">
        <h2>{title}</h2>
        <NoctraDocsPropsTable rows={filteredRows} />
      </Card>
    </Stack>
  );
}

function NoctraDocsRuntimeTable({
  columns,
  rows,
  system
}: {
  columns: readonly string[];
  rows: readonly ReactNode[][];
  system: string;
}) {
  if (hasRuntimeTable) {
    return (
      <TableRuntime
        className="nd-table"
        data-noctra-docs-system={system}
        columns={columns}
        rows={rows}
        data={rows}
      />
    );
  }

  return (
    <table className="nd-table" data-noctra-docs-system={system}>
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

export function NoctraDocsPropsTable({ rows }: { rows: readonly NoctraDocsPropRow[] }) {
  const columns = ["Name", "Type", "Required", "Default", "Description"] as const;

  const tableRows = rows.map((row) => [
    <InlineCodeRuntime key={`${row.name}-name`}>{row.name}</InlineCodeRuntime>,
    row.type,
    row.required ? "Required" : "Optional",
    row.defaultValue ?? "—",
    row.description
  ]);

  return (
    <NoctraDocsRuntimeTable
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
    <Stack className="nd-stack" data-noctra-docs-system="styles-api-panel">
      <Card className="nd-card">
        <h2>Styles API</h2>
        <p>Use selectors, CSS variables, and data attributes to customize Noctra components without reaching into unstable DOM structure.</p>
      </Card>

      <NoctraDocsSimpleTable
        title="Selectors"
        columns={["Selector", "Description"]}
        rows={selectors.map((item) => [
          <InlineCodeRuntime key={`${item.selector}-selector`}>{item.selector}</InlineCodeRuntime>,
          item.description
        ])}
      />

      {variables && variables.length > 0 ? (
        <NoctraDocsSimpleTable
          title="CSS variables"
          columns={["Variable", "Description"]}
          rows={variables.map((item) => [
            <InlineCodeRuntime key={`${item.variable}-variable`}>{item.variable}</InlineCodeRuntime>,
            item.description
          ])}
        />
      ) : null}

      {dataAttributes && dataAttributes.length > 0 ? (
        <NoctraDocsSimpleTable
          title="Data attributes"
          columns={["Attribute", "Description"]}
          rows={dataAttributes.map((item) => [
            <InlineCodeRuntime key={`${item.attribute}-attribute`}>{item.attribute}</InlineCodeRuntime>,
            item.description
          ])}
        />
      ) : null}
    </Stack>
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
    <Card className="nd-card">
      <h2>{title}</h2>
      <NoctraDocsRuntimeTable
        columns={columns}
        rows={rows}
        system="simple-table"
      />
    </Card>
  );
}

export function NoctraCodeBlock({ code }: { code: string }) {
  return (
    <CodeBlockRuntime code={code} value={code}>
      {code}
    </CodeBlockRuntime>
  );
}

export function NoctraDocsToc({ items }: { items: readonly NoctraDocsTocItem[] }) {
  return (
    <Card className="nd-card" data-noctra-docs-system="toc">
      <h3>Table of contents</h3>
      <Stack className="nd-stack">
        {items.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </Stack>
    </Card>
  );
}

export function NoctraDocsExampleGrid({ children }: { children: ReactNode }) {
  return <Box className="nd-related-grid">{children}</Box>;
}

export function NoctraDocsExampleCard({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Card className="nd-related-card">
      <strong>{label}</strong>
      <span>{children}</span>
    </Card>
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
    <Box className="nd-two-grid" data-noctra-docs-system="previous-next">
      {previous ? (
        <a className="nd-related-card" href={previous.href}>
          <span>Previous</span>
          <strong>{previous.label}</strong>
        </a>
      ) : (
        <Box />
      )}

      {next ? (
        <a className="nd-related-card" href={next.href}>
          <span>Next</span>
          <strong>{next.label}</strong>
        </a>
      ) : null}
    </Box>
  );
}
