import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const entries = {
  Anchor: `Anchor: {
    title: "Anchor",
    description: "Simple link with independent href behavior.",
    props: {
      href: "/noctra/components",
      children: "Browse components"
    },
    controls: ["href", "children"]
  }`,

  Avatar: `Avatar: {
    title: "Avatar",
    description: "Avatar with initials fallback and balanced size.",
    props: {
      src: "",
      alt: "Noctra user",
      fallback: "NC",
      children: "NC",
      size: "md"
    },
    controls: ["src", "alt", "fallback", "size", "radius"]
  }`,

  Clipboard: `Clipboard: {
    title: "Clipboard",
    description: "Compact copy action with copied feedback.",
    previewWidth: 320,
    props: {
      value: "npm install @noctra/react",
      label: "Copy install command",
      copiedLabel: "Copied"
    },
    controls: ["value", "label", "disabled", "size"]
  }`,

  Code: `Code: {
    title: "Code",
    description: "Inline code preview with real code content.",
    props: {
      children: "pnpm add @noctra/react"
    },
    controls: ["children"]
  }`,

  ColorInput: `ColorInput: {
    title: "Color input",
    description: "Compact color input with swatch and value.",
    previewWidth: 320,
    props: {
      value: "#7c3aed",
      placeholder: "Pick color",
      label: "Brand color"
    },
    controls: ["value", "placeholder", "disabled", "size", "radius"]
  }`,

  CreditCard: `CreditCard: {
    title: "Credit card",
    description: "Reasonable card preview with realistic content.",
    previewWidth: 380,
    props: {
      number: "4242 4242 4242 4242",
      holder: "NOCTRA USER",
      expiry: "12/28",
      brand: "Visa"
    },
    controls: ["number", "holder", "expiry", "brand"]
  }`,

  FileInput: `FileInput: {
    title: "File input",
    description: "File input with placeholder and selected file label.",
    previewWidth: 340,
    props: {
      placeholder: "Choose file",
      value: "noctra-release-notes.md",
      label: "Upload file"
    },
    controls: ["placeholder", "value", "disabled", "size", "radius"]
  }`,

  FloatLabel: `FloatLabel: {
    title: "Float label",
    description: "Floating label with focused and filled input state.",
    previewWidth: 340,
    props: {
      label: "Project name",
      value: "Noctra",
      placeholder: "Project name",
      focused: true
    },
    controls: ["label", "value", "placeholder", "disabled", "size", "radius"]
  }`,

  ResizablePanel: `ResizablePanel: {
    title: "Resizable panel",
    description: "Two visible panels with a clear resize handle.",
    previewWidth: 560,
    previewHeight: 260,
    props: {
      panels: [
        { value: "left", label: "Navigation", size: 35 },
        { value: "right", label: "Preview", size: 65 }
      ],
      defaultSize: 35
    },
    controls: ["defaultSize", "disabled"]
  }`,

  SplitPane: `SplitPane: {
    title: "Split pane",
    description: "Left and right panes with visible content.",
    previewWidth: 560,
    previewHeight: 260,
    props: {
      left: "Component list",
      right: "Component preview",
      defaultSize: 40
    },
    controls: ["defaultSize", "orientation"]
  }`,

  VisuallyHidden: `VisuallyHidden: {
    title: "Visually hidden",
    description: "Visible explanation for screen-reader-only content.",
    previewWidth: 420,
    props: {
      children: "This text is visually hidden but available to screen readers.",
      label: "Screen reader text"
    },
    controls: ["children", "label"]
  }`,

  Dock: `Dock: {
    title: "Dock",
    description: "Dock with five app-like items.",
    previewWidth: 420,
    props: {
      items: [
        { value: "home", label: "Home" },
        { value: "docs", label: "Docs" },
        { value: "tokens", label: "Tokens" },
        { value: "theme", label: "Theme" },
        { value: "release", label: "Release" }
      ],
      value: "docs"
    },
    controls: ["value", "size"]
  }`,

  ClickOutside: `ClickOutside: {
    title: "Click outside",
    description: "Card closes when clicking outside the isolated preview area.",
    previewWidth: 360,
    props: {
      open: true,
      title: "Click outside demo",
      description: "Click inside to keep it open, outside to close."
    },
    controls: ["open"]
  }`,

  Hover: `Hover: {
    title: "Hover",
    description: "Hover content must be fully readable.",
    props: {
      open: true,
      label: "Hover target",
      content: "Readable hover content"
    },
    controls: ["open", "label", "content"]
  }`,

  Tooltip: `Tooltip: {
    title: "Tooltip",
    description: "Tooltip with readable content.",
    props: {
      open: true,
      label: "Hover me",
      content: "Tooltip content"
    },
    controls: ["open", "label", "content"]
  }`,

  HoverCard: `HoverCard: {
    title: "Hover card",
    description: "Hover card with clear trigger and content.",
    previewWidth: 340,
    props: {
      open: true,
      label: "Noctra",
      title: "Noctra UI",
      description: "Premium React component system."
    },
    controls: ["open", "label", "title", "description"]
  }`,

  Popover: `Popover: {
    title: "Popover",
    description: "Open popover with title and content.",
    previewWidth: 340,
    props: {
      open: true,
      label: "Open popover",
      title: "Popover title",
      content: "Popover content"
    },
    controls: ["open", "label", "title", "content"]
  }`
};

const added = [];

for (const [name, entry] of Object.entries(entries)) {
  const pattern = new RegExp(`(^|\\n)\\s*${name}\\s*:`, "m");

  if (pattern.test(text)) continue;

  const marker = "\n};\n\nexport const componentInteractiveDemoPresets";

  if (!text.includes(marker)) {
    throw new Error("Could not find interactiveDemoPresets object closing marker.");
  }

  text = text.replace(marker, `,\n\n  ${entry}${marker}`);
  added.push(name);
}

writeText(file, text);

const report = [
  "# Missing Safe Demo Presets Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Added presets: ${added.length}`,
  "",
  "## Added",
  "",
  ...(added.length > 0 ? added.map((name) => `- ${name}`) : ["- None"])
].join("\n");

writeFileSync("missing-safe-demo-presets-report.md", `${report}\n`, "utf8");

console.log(`Missing safe demo presets patched. Added: ${added.length}. Report: missing-safe-demo-presets-report.md`);