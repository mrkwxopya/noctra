import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function objectLiteral(value, indent = 4) {
  return JSON.stringify(value, null, 2)
    .replace(/"([A-Za-z_$][A-Za-z0-9_$]*)":/g, "$1:")
    .split("\n")
    .map((line, index) => (index === 0 ? line : `${" ".repeat(indent)}${line}`))
    .join("\n");
}

function hasPreset(source, name) {
  return new RegExp(`(^|\\n)\\s*${name}\\s*:`, "m").test(source);
}

function replacePresetBlock(source, name, newBlock) {
  const match = new RegExp(`(^|\\n)(\\s*)${name}\\s*:\\s*\\{`, "m").exec(source);

  if (!match || match.index === undefined) return source;

  const start = match.index + match[1].length;
  const openBrace = source.indexOf("{", start);

  if (openBrace === -1) return source;

  let depth = 0;
  let end = openBrace;

  for (; end < source.length; end += 1) {
    const char = source[end];

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      end += 1;
      break;
    }
  }

  if (source[end] === ",") end += 1;

  return `${source.slice(0, start)}${newBlock},${source.slice(end)}`;
}

function upsertPreset(source, name, preset) {
  const block = `  ${name}: ${objectLiteral(preset, 4)}`;

  if (hasPreset(source, name)) {
    return {
      text: replacePresetBlock(source, name, block),
      mode: "replaced"
    };
  }

  const marker = "\n};\n\nexport const componentInteractiveDemoPresets";

  if (!source.includes(marker)) {
    throw new Error("Could not find interactiveDemoPresets object closing marker.");
  }

  return {
    text: source.replace(marker, `,\n\n${block}${marker}`),
    mode: "added"
  };
}

const sharedBreadcrumbItems = [
  { label: "Docs", href: "/noctra/" },
  { label: "Components", href: "/noctra/components" },
  { label: "Button", href: "/noctra/components/button" }
];

const sharedTreeNodes = [
  {
    value: "components",
    label: "components",
    children: [
      { value: "button", label: "Button" },
      { value: "input", label: "Input" }
    ]
  },
  {
    value: "docs",
    label: "docs",
    children: [
      { value: "usage", label: "Usage" },
      { value: "props", label: "Props" }
    ]
  }
];

const presets = {
  Anchor: {
    title: "Anchor",
    description: "Safe anchor/link preview with href, label, children, and list-like fallback data.",
    props: {
      href: "/noctra/components",
      label: "Browse components",
      children: "Browse components",
      items: sharedBreadcrumbItems,
      data: sharedBreadcrumbItems,
      links: sharedBreadcrumbItems,
      value: "/noctra/components"
    },
    controls: ["href", "children", "label", "disabled"]
  },

  Breadcrumb: {
    title: "Breadcrumb",
    description: "Breadcrumb preview with non-empty items array.",
    props: {
      items: sharedBreadcrumbItems,
      data: sharedBreadcrumbItems,
      links: sharedBreadcrumbItems,
      value: "button"
    },
    controls: []
  },

  Breadcrumbs: {
    title: "Breadcrumbs",
    description: "Breadcrumbs preview with non-empty items array.",
    props: {
      items: sharedBreadcrumbItems,
      data: sharedBreadcrumbItems,
      links: sharedBreadcrumbItems,
      value: "button"
    },
    controls: []
  },

  FileInput: {
    title: "File input",
    description: "File input with array-based currentFiles shape.",
    previewWidth: 340,
    props: {
      placeholder: "Choose file",
      label: "Upload file",
      value: [],
      files: [
        { name: "noctra-release-notes.md", size: 12400, type: "text/markdown" }
      ],
      currentFiles: [
        { name: "noctra-release-notes.md", size: 12400, type: "text/markdown" }
      ],
      selectedFiles: [
        { name: "noctra-release-notes.md", size: 12400, type: "text/markdown" }
      ]
    },
    controls: ["placeholder", "disabled", "size", "radius"]
  },

  SegmentedControl: {
    title: "Segmented control",
    description: "Segmented control with data array and selected value.",
    previewWidth: 360,
    props: {
      value: "docs",
      defaultValue: "docs",
      data: [
        { value: "overview", label: "Overview" },
        { value: "docs", label: "Docs" },
        { value: "api", label: "API" }
      ],
      items: [
        { value: "overview", label: "Overview" },
        { value: "docs", label: "Docs" },
        { value: "api", label: "API" }
      ],
      options: [
        { value: "overview", label: "Overview" },
        { value: "docs", label: "Docs" },
        { value: "api", label: "API" }
      ]
    },
    controls: ["value", "disabled", "size", "radius"]
  },

  Spotlight: {
    title: "Spotlight",
    description: "Spotlight search with iterable actions array.",
    previewWidth: 460,
    props: {
      open: true,
      value: "",
      query: "",
      placeholder: "Search actions",
      actions: [
        { id: "search-docs", value: "search-docs", label: "Search docs", description: "Open documentation search" },
        { id: "copy-import", value: "copy-import", label: "Copy import", description: "Copy package import" },
        { id: "open-release", value: "open-release", label: "Open release", description: "Review release checklist" }
      ],
      items: [
        { id: "search-docs", value: "search-docs", label: "Search docs", description: "Open documentation search" },
        { id: "copy-import", value: "copy-import", label: "Copy import", description: "Copy package import" },
        { id: "open-release", value: "open-release", label: "Open release", description: "Review release checklist" }
      ],
      data: [
        { id: "search-docs", value: "search-docs", label: "Search docs", description: "Open documentation search" },
        { id: "copy-import", value: "copy-import", label: "Copy import", description: "Copy package import" },
        { id: "open-release", value: "open-release", label: "Open release", description: "Review release checklist" }
      ]
    },
    controls: ["open", "value", "placeholder"]
  },

  Tree: {
    title: "Tree",
    description: "Tree with iterable nested nodes array.",
    previewWidth: 360,
    props: {
      nodes: sharedTreeNodes,
      items: sharedTreeNodes,
      data: sharedTreeNodes,
      value: ["components"],
      expanded: ["components", "docs"]
    },
    controls: ["value", "multiple"]
  },

  TreeSelect: {
    title: "TreeSelect",
    description: "TreeSelect with iterable nested nodes array.",
    previewWidth: 360,
    props: {
      nodes: sharedTreeNodes,
      items: sharedTreeNodes,
      data: sharedTreeNodes,
      value: "button",
      placeholder: "Select node",
      expanded: ["components", "docs"]
    },
    controls: ["value", "placeholder", "disabled"]
  }
};

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const changes = [];

for (const [name, preset] of Object.entries(presets)) {
  const result = upsertPreset(text, name, preset);
  text = result.text;
  changes.push(`${name}: ${result.mode}`);
}

writeText(file, text);

const remaining = [];

for (const name of Object.keys(presets)) {
  if (!hasPreset(text, name)) {
    remaining.push(name);
  }
}

const report = [
  "# Runtime Failing Safe Presets Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Patched presets: ${changes.length}`,
  `Remaining missing patched presets: ${remaining.length}`,
  "",
  "## Changes",
  "",
  ...changes.map((item) => `- ${item}`),
  "",
  "## Remaining",
  "",
  ...(remaining.length > 0 ? remaining.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("runtime-failing-safe-presets-report.md", `${report}\n`, "utf8");

console.log(`Runtime failing safe presets patched. Patched: ${changes.length}. Remaining: ${remaining.length}. Report: runtime-failing-safe-presets-report.md`);

if (remaining.length > 0) {
  console.error(report);
  throw new Error("Runtime failing safe presets patch incomplete.");
}