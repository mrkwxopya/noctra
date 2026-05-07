import {
  createElement,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode
} from "react";
import * as NoctraReact from "@noctra/react";

type AnyProps = Record<string, unknown>;
type AnyComponent = ComponentType<AnyProps> | keyof JSX.IntrinsicElements;

const Box = ((NoctraReact as AnyProps).Box ?? "div") as AnyComponent;
const Stack = ((NoctraReact as AnyProps).Stack ?? "div") as AnyComponent;
const Group = ((NoctraReact as AnyProps).Group ?? "div") as AnyComponent;
const Card = ((NoctraReact as AnyProps).Card ?? "section") as AnyComponent;
const Button = ((NoctraReact as AnyProps).Button ?? "button") as AnyComponent;
const Badge = ((NoctraReact as AnyProps).Badge ?? "span") as AnyComponent;
const TextInput = ((NoctraReact as AnyProps).TextInput ?? "input") as AnyComponent;
const CodeBlockRuntime = ((NoctraReact as AnyProps).CodeBlock ?? "pre") as AnyComponent;
const InlineCodeRuntime = ((NoctraReact as AnyProps).InlineCode ?? "code") as AnyComponent;
const TableRuntime = ((NoctraReact as AnyProps).Table ?? "table") as AnyComponent;

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

function nc(type: AnyComponent, props: AnyProps, children?: ReactNode) {
  return createElement(type, props, children);
}

export function NoctraDocsShell({
  children,
  toc
}: {
  children: ReactNode;
  toc?: readonly NoctraDocsTocItem[];
}) {
  return nc(
    Box,
    { className: "nd-detail-layout", "data-noctra-docs-system": "shell" },
    <>
      {nc(Box, { className: "nd-detail-main" }, children)}
      {toc && toc.length > 0
        ? nc(
            "aside",
            { className: "nd-detail-aside" },
            nc(NoctraDocsToc, { items: toc })
          )
        : null}
    </>
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
  return nc(
    Card,
    { className: "nd-card", "data-noctra-docs-system": "header" },
    nc(
      Stack,
      { className: "nd-stack" },
      <>
        {nc(
          Box,
          { className: "nd-kicker" },
          "Component"
        )}
        {nc("h1", {}, title)}
        {nc("p", {}, description)}
        {links && links.length > 0
          ? nc(
              Box,
              { className: "nd-related-grid" },
              links.map((link) =>
                nc(
                  link.href ? "a" : Card,
                  {
                    key: `${link.label}-${link.value}`,
                    className: "nd-related-card",
                    href: link.href
                  },
                  <>
                    {nc("strong", {}, link.label)}
                    {nc("span", {}, link.value)}
                  </>
                )
              )
            )
          : null}
      </>
    )
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

  return nc(
    Group,
    { className: "nd-related-grid", "data-noctra-docs-system": "tabs", role: "tablist" },
    tabs.map((tab) =>
      nc(
        Button,
        {
          key: tab.value,
          type: "button",
          role: "tab",
          "aria-selected": active === tab.value,
          variant: active === tab.value ? "filled" : "outline",
          tone: active === tab.value ? "primary" : "neutral",
          size: "sm",
          radius: "md",
          onClick: () => onChange(tab.value)
        },
        tab.label
      )
    )
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

  return (
    <NoctraDocsShell toc={activeTab === "documentation" ? toc : undefined}>
      <NoctraDocsHeader title={title} description={description} links={links} />
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
  return nc(
    "section",
    { id, className: "nd-doc-section" },
    <>
      {eyebrow ? nc(Box, { className: "nd-kicker" }, eyebrow) : null}
      {nc("h2", {}, title)}
      {description ? nc("p", {}, description) : null}
      {children}
    </>
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
  return nc(
    Card,
    { className: "nd-card", "data-noctra-docs-system": "demo" },
    nc(
      Stack,
      { className: "nd-stack" },
      <>
        {nc("h3", {}, title)}
        {description ? nc("p", {}, description) : null}
        {nc(
          Box,
          { className: "nd-two-grid" },
          <>
            {nc(
              Card,
              { className: "nd-related-card" },
              <>
                {nc("strong", {}, "Preview")}
                {nc(Box, { className: "nd-related-grid" }, preview)}
              </>
            )}
            {nc(
              Card,
              { className: "nd-related-card" },
              <>
                {nc("strong", {}, "Code")}
                {nc(NoctraCodeBlock, { code })}
              </>
            )}
          </>
        )}
        {controls ? nc(Box, {}, controls) : null}
      </>
    )
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
  return nc(
    Card,
    { className: "nd-related-card", "data-noctra-docs-system": "control-group" },
    <>
      {nc("strong", {}, label)}
      {nc(
        Group,
        { className: "nd-related-grid" },
        options.map((option) =>
          nc(
            Button,
            {
              key: option,
              type: "button",
              variant: value === option ? "filled" : "subtle",
              tone: value === option ? "primary" : "neutral",
              size: "sm",
              radius: "md",
              onClick: () => onChange(option),
              "aria-pressed": value === option
            },
            option
          )
        )
      )}
    </>
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
  return nc(
    Card,
    { className: "nd-related-card", "data-noctra-docs-system": "boolean-control" },
    <>
      {nc("strong", {}, label)}
      {nc(
        Group,
        { className: "nd-related-grid" },
        <>
          {nc(
            Button,
            {
              type: "button",
              variant: !checked ? "filled" : "subtle",
              tone: !checked ? "primary" : "neutral",
              size: "sm",
              radius: "md",
              onClick: () => onChange(false)
            },
            "Off"
          )}
          {nc(
            Button,
            {
              type: "button",
              variant: checked ? "filled" : "subtle",
              tone: checked ? "primary" : "neutral",
              size: "sm",
              radius: "md",
              onClick: () => onChange(true)
            },
            "On"
          )}
        </>
      )}
    </>
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

    return rows.filter((row) => {
      return row.name.toLowerCase().includes(normalized);
    });
  }, [query, rows]);

  return nc(
    Stack,
    { className: "nd-stack", "data-noctra-docs-system": "props-panel" },
    <>
      {nc(
        TextInput,
        {
          value: query,
          placeholder: "Search props",
          onChange: (event: { currentTarget: { value: string } }) => setQuery(event.currentTarget.value)
        }
      )}
      {nc(
        Card,
        { className: "nd-card" },
        <>
          {nc("h2", {}, title)}
          {nc(NoctraDocsPropsTable, { rows: filteredRows })}
        </>
      )}
    </>
  );
}

export function NoctraDocsPropsTable({ rows }: { rows: readonly NoctraDocsPropRow[] }) {
  return nc(
    TableRuntime,
    { className: "nd-table", "data-noctra-docs-system": "props-table" },
    <>
      {nc(
        "thead",
        {},
        nc(
          "tr",
          {},
          <>
            {nc("th", {}, "Name")}
            {nc("th", {}, "Type")}
            {nc("th", {}, "Required")}
            {nc("th", {}, "Default")}
            {nc("th", {}, "Description")}
          </>
        )
      )}
      {nc(
        "tbody",
        {},
        rows.map((row) =>
          nc(
            "tr",
            { key: row.name },
            <>
              {nc("td", {}, nc(InlineCodeRuntime, {}, row.name))}
              {nc("td", {}, row.type)}
              {nc("td", {}, row.required ? "Required" : "Optional")}
              {nc("td", {}, row.defaultValue ?? "—")}
              {nc("td", {}, row.description)}
            </>
          )
        )
      )}
    </>
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
  return nc(
    Stack,
    { className: "nd-stack", "data-noctra-docs-system": "styles-api-panel" },
    <>
      {nc(
        Card,
        { className: "nd-card" },
        <>
          {nc("h2", {}, "Styles API")}
          {nc("p", {}, "Use selectors, CSS variables, and data attributes to customize Noctra components without reaching into unstable DOM structure.")}
        </>
      )}

      {nc(NoctraDocsSimpleTable, {
        title: "Selectors",
        columns: ["Selector", "Description"],
        rows: selectors.map((item) => [nc(InlineCodeRuntime, {}, item.selector), item.description])
      })}

      {variables && variables.length > 0
        ? nc(NoctraDocsSimpleTable, {
            title: "CSS variables",
            columns: ["Variable", "Description"],
            rows: variables.map((item) => [nc(InlineCodeRuntime, {}, item.variable), item.description])
          })
        : null}

      {dataAttributes && dataAttributes.length > 0
        ? nc(NoctraDocsSimpleTable, {
            title: "Data attributes",
            columns: ["Attribute", "Description"],
            rows: dataAttributes.map((item) => [nc(InlineCodeRuntime, {}, item.attribute), item.description])
          })
        : null}
    </>
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
  return nc(
    Card,
    { className: "nd-card" },
    <>
      {nc("h2", {}, title)}
      {nc(
        TableRuntime,
        { className: "nd-table" },
        <>
          {nc(
            "thead",
            {},
            nc(
              "tr",
              {},
              columns.map((column) => nc("th", { key: column }, column))
            )
          )}
          {nc(
            "tbody",
            {},
            rows.map((row, rowIndex) =>
              nc(
                "tr",
                { key: rowIndex },
                row.map((cell, cellIndex) => nc("td", { key: cellIndex }, cell))
              )
            )
          )}
        </>
      )}
    </>
  );
}

export function NoctraCodeBlock({ code }: { code: string }) {
  return nc(CodeBlockRuntime, {}, code);
}

export function NoctraDocsToc({ items }: { items: readonly NoctraDocsTocItem[] }) {
  return nc(
    Card,
    { className: "nd-card", "data-noctra-docs-system": "toc" },
    <>
      {nc("h3", {}, "Table of contents")}
      {nc(
        Stack,
        { className: "nd-stack" },
        items.map((item) =>
          nc(
            "a",
            {
              key: item.href,
              href: item.href
            },
            item.label
          )
        )
      )}
    </>
  );
}

export function NoctraDocsExampleGrid({
  children
}: {
  children: ReactNode;
}) {
  return nc(Box, { className: "nd-related-grid" }, children);
}

export function NoctraDocsExampleCard({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return nc(
    Card,
    { className: "nd-related-card" },
    <>
      {nc("strong", {}, label)}
      {nc("span", {}, children)}
    </>
  );
}

export function NoctraDocsPreviousNext({
  previous,
  next
}: {
  previous?: { label: string; href: string };
  next?: { label: string; href: string };
}) {
  return nc(
    Box,
    { className: "nd-two-grid", "data-noctra-docs-system": "previous-next" },
    <>
      {previous
        ? nc(
            "a",
            { className: "nd-related-card", href: previous.href },
            <>
              {nc("span", {}, "Previous")}
              {nc("strong", {}, previous.label)}
            </>
          )
        : nc(Box, {}, null)}
      {next
        ? nc(
            "a",
            { className: "nd-related-card", href: next.href },
            <>
              {nc("span", {}, "Next")}
              {nc("strong", {}, next.label)}
            </>
          )
        : null}
    </>
  );
}