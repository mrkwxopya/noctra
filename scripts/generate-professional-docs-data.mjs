import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function toHumanTitle(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}

function listComponentDirs() {
  const root = "packages/react/src/components";

  if (!existsSync(root)) return [];

  return readdirSync(root)
    .filter((entry) => {
      const fullPath = join(root, entry);
      return statSync(fullPath).isDirectory() && !entry.startsWith(".");
    })
    .sort((a, b) => a.localeCompare(b));
}

function findMatchingBrace(text, openIndex) {
  let depth = 0;

  for (let index = openIndex; index < text.length; index += 1) {
    const char = text[index];

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) return index;
  }

  return -1;
}

function extractProps(componentName, text) {
  const interfaceNames = [
    `${componentName}Props`,
    `${componentName}PartProps`
  ];

  const props = [];

  for (const interfaceName of interfaceNames) {
    const start = text.indexOf(`export interface ${interfaceName}`);

    if (start === -1) continue;

    const open = text.indexOf("{", start);
    const close = findMatchingBrace(text, open);

    if (open === -1 || close === -1) continue;

    const body = text.slice(open + 1, close);
    const lines = body.split(/\r?\n/g);

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*")) continue;

      const match = trimmed.match(/^([A-Za-z_$][\w$]*)\??\s*:\s*([^;]+);?$/);

      if (!match) continue;

      const name = match[1];
      const type = match[2].trim();
      const required = !trimmed.includes("?");

      if (!props.some((prop) => prop.name === name)) {
        props.push({
          name,
          type,
          required,
          source: interfaceName
        });
      }
    }
  }

  return props.sort((a, b) => a.name.localeCompare(b.name));
}

function extractUnionValues(typeName, text) {
  const regex = new RegExp(`export\\s+type\\s+${typeName}\\s*=\\s*([^;]+);`);
  const match = text.match(regex);

  if (!match) return [];

  return Array.from(match[1].matchAll(/"([^"]+)"/g)).map((item) => item[1]);
}

function extractExportedTypes(text) {
  return Array.from(text.matchAll(/export\s+type\s+([A-Za-z_$][\w$]*)/g))
    .map((match) => match[1])
    .sort((a, b) => a.localeCompare(b));
}

function extractAnatomy(text) {
  return Array.from(text.matchAll(/"([^"]+)"/g))
    .map((match) => match[1])
    .filter((value) => !value.includes("/"))
    .filter((value, index, array) => array.indexOf(value) === index);
}

function extractTokens(text) {
  return Array.from(text.matchAll(/"--nc-[^"]+"/g))
    .map((match) => match[0].slice(1, -1))
    .filter((value, index, array) => array.indexOf(value) === index);
}

function groupForComponent(name) {
  const layout = new Set(["Container", "Stack", "Group", "Grid", "SimpleGrid", "Box", "Flex", "Spacer", "Divider", "Paper", "Card", "Section", "Page", "Layout"]);
  const inputs = new Set(["Button", "TextInput", "Textarea", "Select", "Checkbox", "Radio", "Switch", "Slider", "NumberInput", "PinCode", "FileInput", "Dropzone", "ColorPicker", "DatePicker", "DateRangePicker", "Clipboard", "CreditCard", "TransferList", "ListBox"]);
  const feedback = new Set(["Alert", "Badge", "Toast", "Notification", "Progress", "RingProgress", "Skeleton", "Loader", "EmptyState", "Result", "Kbd"]);
  const navigation = new Set(["Tabs", "Breadcrumbs", "Pagination", "Stepper", "Menu", "Command", "TreeView", "Sidebar", "Navbar", "Anchor"]);
  const overlay = new Set(["Modal", "Drawer", "Popover", "Tooltip", "HoverCard", "Dialog", "FocusTrap", "Portal", "Overlay"]);
  const data = new Set(["Table", "DataTable", "Timeline", "Accordion", "Avatar", "Image", "List", "CodeBlock", "InlineCode"]);

  if (layout.has(name)) return "Layout";
  if (inputs.has(name)) return "Inputs";
  if (feedback.has(name)) return "Feedback";
  if (navigation.has(name)) return "Navigation";
  if (overlay.has(name)) return "Overlay";
  if (data.has(name)) return "Data display";

  return "General";
}

function inferDescription(name, group) {
  const map = {
    Layout: "Layout primitive for composing responsive application and documentation surfaces.",
    Inputs: "Interactive control or form component for product interfaces.",
    Feedback: "Feedback component for communicating state, loading, progress, or result information.",
    Navigation: "Navigation component for moving through views, commands, trees, menus, or pages.",
    Overlay: "Layered surface component for modal, floating, or portal-based interfaces.",
    "Data display": "Data and content display component for structured UI.",
    General: "Reusable Noctra component with public React, CSS, and token integration."
  };

  return map[group] ?? map.General;
}

const componentNames = listComponentDirs();

const components = componentNames.map((name) => {
  const kebab = toKebabCase(name);
  const reactDir = `packages/react/src/components/${name}`;
  const typePath = `${reactDir}/${name}.types.ts`;
  const anatomyPath = `${reactDir}/${name}.anatomy.ts`;
  const indexPath = `${reactDir}/index.ts`;
  const stylePath = `packages/styles/src/components/${kebab}.css`;
  const tokenPath = `packages/tokens/src/components/${kebab}.ts`;

  const typeText = readText(typePath);
  const anatomyText = readText(anatomyPath);
  const tokenText = readText(tokenPath);
  const group = groupForComponent(name);

  return {
    name,
    title: toHumanTitle(name),
    kebab,
    group,
    description: inferDescription(name, group),
    importPath: "@noctra/react",
    packageEntry: `@noctra/react/${kebab}`,
    styleEntry: `@noctra/styles/components/${kebab}.css`,
    tokenEntry: `@noctra/tokens`,
    reactDir,
    hasIndex: existsSync(indexPath),
    hasTypes: existsSync(typePath),
    hasAnatomy: existsSync(anatomyPath),
    hasStyle: existsSync(stylePath),
    hasTokens: existsSync(tokenPath),
    props: extractProps(name, typeText),
    variants: extractUnionValues(`Nc${name}Variant`, typeText),
    sizes: extractUnionValues(`Nc${name}Size`, typeText),
    exportedTypes: extractExportedTypes(typeText),
    anatomy: extractAnatomy(anatomyText),
    tokens: extractTokens(tokenText)
  };
});

const groups = Array.from(new Set(components.map((component) => component.group)))
  .sort((a, b) => a.localeCompare(b))
  .map((group) => ({
    group,
    count: components.filter((component) => component.group === group).length
  }));

const content = [
  "/* eslint-disable */",
  "// Generated by scripts/generate-professional-docs-data.mjs.",
  "// Do not edit manually.",
  "",
  "export type NoctraDocsProp = {",
  "  name: string;",
  "  type: string;",
  "  required: boolean;",
  "  source: string;",
  "};",
  "",
  "export type NoctraDocsComponent = {",
  "  name: string;",
  "  title: string;",
  "  kebab: string;",
  "  group: string;",
  "  description: string;",
  "  importPath: string;",
  "  packageEntry: string;",
  "  styleEntry: string;",
  "  tokenEntry: string;",
  "  reactDir: string;",
  "  hasIndex: boolean;",
  "  hasTypes: boolean;",
  "  hasAnatomy: boolean;",
  "  hasStyle: boolean;",
  "  hasTokens: boolean;",
  "  props: readonly NoctraDocsProp[];",
  "  variants: readonly string[];",
  "  sizes: readonly string[];",
  "  exportedTypes: readonly string[];",
  "  anatomy: readonly string[];",
  "  tokens: readonly string[];",
  "};",
  "",
  `export const noctraDocsComponents = ${JSON.stringify(components, null, 2)} as const satisfies readonly NoctraDocsComponent[];`,
  "",
  `export const noctraDocsGroups = ${JSON.stringify(groups, null, 2)} as const;`,
  "",
  `export const noctraDocsSummary = ${JSON.stringify({
    generatedAt: new Date().toISOString(),
    componentCount: components.length,
    groupCount: groups.length,
    propCount: components.reduce((total, component) => total + component.props.length, 0),
    tokenCount: components.reduce((total, component) => total + component.tokens.length, 0)
  }, null, 2)} as const;`,
  ""
].join("\n");

writeFileSync("apps/docs/src/generated/noctra-professional-docs.generated.ts", content, "utf8");

const report = [
  "# Professional Docs Data Generation Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Components: ${components.length}`,
  `Groups: ${groups.length}`,
  `Props extracted: ${components.reduce((total, component) => total + component.props.length, 0)}`,
  `Tokens extracted: ${components.reduce((total, component) => total + component.tokens.length, 0)}`,
  "",
  "## Groups",
  "",
  ...groups.map((item) => `- ${item.group}: ${item.count}`),
  "",
  "## Components",
  "",
  ...components.map((component) => `- ${component.name}: props=${component.props.length}, anatomy=${component.anatomy.length}, tokens=${component.tokens.length}`)
].join("\n");

writeFileSync("professional-docs-data-generation-report.md", `${report}\n`, "utf8");

console.log(`Professional docs data generated. Components: ${components.length}. Groups: ${groups.length}. Report: professional-docs-data-generation-report.md`);