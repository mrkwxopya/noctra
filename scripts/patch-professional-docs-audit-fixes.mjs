import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function ensureCss(path, marker, css) {
  const current = readText(path);

  if (!current.includes(marker)) {
    writeText(path, `${current.trimEnd()}\n${css}`);
  }
}

function ensureText(path, marker, transform) {
  const current = readText(path);

  if (!current.includes(marker)) {
    writeText(path, transform(current));
  }
}

ensureCss(
  "apps/docs/src/docs.css",
  "@media (max-width:1100px)",
  `@media (max-width:1100px){.nd-detail-layout{grid-template-columns:1fr}.nd-detail-aside{position:static;order:-1}.nd-anchor-list{grid-template-columns:repeat(2,minmax(0,1fr))}.nd-anchor-list>strong{grid-column:1/-1}}`
);

ensureCss(
  "apps/docs/src/docs.css",
  "nd-docs-audit-ready",
  `.nd-docs-audit-ready{display:inline-flex;align-items:center;gap:.4rem;color:#86efac;font-size:.78rem;font-weight:900}.nd-docs-audit-ready:before{content:"";width:.5rem;height:.5rem;border-radius:999px;background:#22c55e;box-shadow:0 0 18px rgba(34,197,94,.55)}`
);

ensureText(
  "apps/docs/src/data/propDescriptions.ts",
  "docsProfessionalSupplementalPropDescriptions",
  (text) => {
    const insert = `
const docsProfessionalSupplementalPropDescriptions: Record<string, PropDescription> = {
  placeholder: {
    category: "content",
    description: "Placeholder text shown before the user provides a value."
  },
  helperText: {
    category: "content",
    description: "Additional helper copy rendered near the control."
  },
  hint: {
    category: "content",
    description: "Short contextual hint for the user."
  },
  icon: {
    category: "content",
    description: "Icon or visual element rendered inside the component."
  },
  leftIcon: {
    category: "content",
    description: "Icon rendered before the main label or content."
  },
  rightIcon: {
    category: "content",
    description: "Icon rendered after the main label or content."
  },
  clearable: {
    category: "interaction",
    description: "Allows the user to clear the current value."
  },
  searchable: {
    category: "interaction",
    description: "Enables search behavior where supported."
  },
  multiple: {
    category: "interaction",
    description: "Allows multiple selected values."
  },
  options: {
    category: "content",
    description: "Option collection rendered by select, list, command, or menu components."
  },
  items: {
    category: "content",
    description: "Item collection rendered by list-like or navigation-like components."
  },
  data: {
    category: "content",
    description: "Data collection consumed by data display or input components."
  },
  columns: {
    category: "layout",
    description: "Column definitions or column count used by grid and table components."
  },
  rows: {
    category: "content",
    description: "Row data rendered by table-like components."
  },
  open: {
    category: "state",
    description: "Controlled open state for overlay or disclosure components."
  },
  defaultOpen: {
    category: "state",
    description: "Initial uncontrolled open state."
  },
  closeOnEscape: {
    category: "interaction",
    description: "Allows the component to close when the Escape key is pressed."
  },
  closeOnOutsideClick: {
    category: "interaction",
    description: "Allows the component to close when the user clicks outside."
  },
  trapFocus: {
    category: "accessibility",
    description: "Keeps keyboard focus inside the active overlay."
  },
  returnFocus: {
    category: "accessibility",
    description: "Returns focus to the trigger when the overlay closes."
  },
  ariaLabel: {
    category: "accessibility",
    description: "Accessible label used when no visible label is available."
  },
  ariaDescribedBy: {
    category: "accessibility",
    description: "Associates the component with supporting descriptive content."
  },
  empty: {
    category: "state",
    description: "Content or state rendered when no items are available."
  },
  loadingText: {
    category: "state",
    description: "Text shown while loading asynchronous content."
  },
  successText: {
    category: "state",
    description: "Text shown for success state."
  },
  errorText: {
    category: "state",
    description: "Text shown for error state."
  },
  max: {
    category: "interaction",
    description: "Maximum numeric value or selection limit."
  },
  min: {
    category: "interaction",
    description: "Minimum numeric value."
  },
  step: {
    category: "interaction",
    description: "Increment step for numeric or range controls."
  },
  precision: {
    category: "interaction",
    description: "Numeric precision used for formatting or input behavior."
  },
  format: {
    category: "advanced",
    description: "Formatting strategy used when displaying values."
  },
  parser: {
    category: "advanced",
    description: "Parser used to transform user input into component value."
  },
  renderItem: {
    category: "advanced",
    description: "Custom item renderer for collection-based components."
  },
  renderValue: {
    category: "advanced",
    description: "Custom renderer for the selected or displayed value."
  }
};
`;

    return text.replace(
      "export function getPropDescription(componentName: string, propName: string): PropDescription {",
      `${insert}
export function getPropDescription(componentName: string, propName: string): PropDescription {`
    ).replace(
      "commonPropDescriptions[propName] ?? {",
      "commonPropDescriptions[propName] ??\n    docsProfessionalSupplementalPropDescriptions[propName] ?? {"
    );
  }
);

ensureText(
  "apps/docs/src/data/componentExamples.tsx",
  "docsAuditSupplementalExamples",
  (text) => {
    const insert = `

const docsAuditSupplementalExamples: ComponentExampleRegistry = {
  Loader: [
    {
      id: "loader-inline",
      title: "Inline loading",
      description: "Use Loader to communicate pending asynchronous work.",
      code: \`import { Loader } from "@noctra/react";

export function Example() {
  return <Loader label="Loading package metadata..." />;
}\`,
      preview: (
        <PreviewShell title="Loader preview">
          <Group>
            <span className="nd-mock-loader" />
            <span className="nd-preview-muted">Loading package metadata...</span>
          </Group>
        </PreviewShell>
      )
    }
  ],

  EmptyState: [
    {
      id: "empty-state-docs",
      title: "Empty documentation state",
      description: "Use EmptyState when a page or collection has no content yet.",
      code: \`import { EmptyState } from "@noctra/react";

export function Example() {
  return (
    <EmptyState
      title="No examples yet"
      description="Add curated examples to improve this component page."
    />
  );
}\`,
      preview: (
        <PreviewShell title="Empty state preview">
          <MockPanel>
            <strong>No examples yet</strong>
            <span>Add curated examples to improve this component page.</span>
            <MockButton>Add example</MockButton>
          </MockPanel>
        </PreviewShell>
      )
    }
  ],

  Pagination: [
    {
      id: "pagination-basic",
      title: "Pagination controls",
      description: "Use Pagination to move across paged data or documentation lists.",
      code: \`import { Pagination } from "@noctra/react";

export function Example() {
  return <Pagination page={2} total={8} />;
}\`,
      preview: (
        <PreviewShell title="Pagination preview">
          <Group>
            <MockButton muted>Previous</MockButton>
            <MockBadge>1</MockBadge>
            <MockBadge tone="success">2</MockBadge>
            <MockBadge>3</MockBadge>
            <MockButton>Next</MockButton>
          </Group>
        </PreviewShell>
      )
    }
  ],

  Menu: [
    {
      id: "menu-actions",
      title: "Action menu",
      description: "Use Menu for grouped actions in cards, tables, and toolbars.",
      code: \`import { Menu } from "@noctra/react";

export function Example() {
  return (
    <Menu
      items={[
        { value: "copy", label: "Copy import" },
        { value: "open", label: "Open docs" }
      ]}
    />
  );
}\`,
      preview: (
        <PreviewShell title="Menu preview">
          <MockPanel>
            <MockRow left="Copy import" />
            <MockRow left="Open docs" />
          </MockPanel>
        </PreviewShell>
      )
    }
  ]
};

for (const [componentName, examples] of Object.entries(docsAuditSupplementalExamples)) {
  componentExamples[componentName] = componentExamples[componentName] ?? examples;
}
`;

    return text.replace(
      "\nexport function getComponentExamples(componentName: string): ComponentExample[] {",
      `${insert}
export function getComponentExamples(componentName: string): ComponentExample[] {`
    );
  }
);

ensureCss(
  "apps/docs/src/docs.css",
  "nd-mock-loader",
  `.nd-mock-loader{width:1rem;height:1rem;border-radius:999px;border:2px solid rgba(148,163,184,.24);border-top-color:#a78bfa;display:inline-block}`
);

console.log("Professional docs audit fixes patched.");