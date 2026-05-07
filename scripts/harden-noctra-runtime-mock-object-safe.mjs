import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import ts from "typescript";

const srcRoot = "apps/docs/src";
const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "noctra-runtime-mock-object-safe-report.md";

const problems = [];
const valueNames = new Set();
const typeNames = new Set();

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function collectFiles(dir) {
  const out = [];

  if (!existsSync(dir)) return out;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const normalized = normalizePath(full);

    if (
      normalized.includes("/dist/") ||
      normalized.includes("/node_modules/") ||
      normalized.includes("/.vite/") ||
      normalized.endsWith("/components/docs-system/NoctraRuntimeMock.tsx")
    ) {
      continue;
    }

    const stats = statSync(full);

    if (stats.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(full)) {
      out.push(normalized);
    }
  }

  return out;
}

function collectImportsFromFile(file) {
  const source = readText(file);
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") || file.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  function visit(node) {
    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text.includes("NoctraRuntimeMock") &&
      node.importClause
    ) {
      const importClause = node.importClause;

      if (importClause.name) {
        valueNames.add(importClause.name.text);
      }

      if (importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
        for (const specifier of importClause.namedBindings.elements) {
          const importedName = (specifier.propertyName ?? specifier.name).text;
          const localName = specifier.name.text;
          const isTypeOnly = importClause.isTypeOnly || specifier.isTypeOnly;

          if (isTypeOnly || importedName.endsWith("Props") || importedName.startsWith("Nc")) {
            typeNames.add(importedName);
          } else {
            valueNames.add(importedName);
          }

          if (localName !== importedName) {
            if (isTypeOnly || localName.endsWith("Props") || localName.startsWith("Nc")) {
              typeNames.add(localName);
            } else {
              valueNames.add(localName);
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

const fallbackValueNames = [
  "Accordion", "Alert", "AppShell", "AspectRatio", "Autocomplete", "Avatar", "Badge", "Blockquote", "Box",
  "Breadcrumb", "Breadcrumbs", "Button", "Card", "CardBody", "CardDescription", "CardFooter", "CardHeader",
  "CardTitle", "Center", "Checkbox", "ClickOutside", "Clipboard", "Code", "CodeBlock", "ColorInput",
  "ColorPicker", "Combobox", "Command", "CommandBar", "Container", "ContextMenu", "CreditCard", "DataGrid",
  "Dialog", "Divider", "Dock", "Drawer", "Dropzone", "EmptyState", "Flex", "FloatLabel", "FocusTrap",
  "Footer", "FormField", "Grid", "Group", "Header", "Highlight", "HoverCard", "IconButton", "InlineCode",
  "Input", "Kbd", "Layout", "LayoutShell", "Link", "ListBox", "Loader", "Menu", "Modal", "MultiSelect",
  "NativeSelect", "Notification", "NumberInput", "Page", "Pagination", "Paper", "PasswordInput", "PinCode",
  "PinInput", "Popover", "Portal", "Progress", "Prose", "Radio", "RangeSlider", "Rating", "ResizablePanel",
  "ScrollArea", "ScrollLock", "SearchInput", "Section", "SegmentedControl", "Select", "Sidebar", "SimpleGrid",
  "Skeleton", "Slider", "Spacer", "Spinner", "SplitPane", "Stack", "StatusBar", "Stepper", "Switch", "Table",
  "TableOfContents", "Tabs", "TagsInput", "Textarea", "TextInput", "Timeline", "Toast", "Toolbar", "Tooltip",
  "TransferList", "Tree", "TreeSelect", "TreeView", "VisuallyHidden"
];

const fallbackTypeNames = [
  "NcAccentMode", "NcButtonVariant", "NcDensity", "NcRadius", "NcRadiusMode", "NcSize", "NcTone",
  "AccordionProps", "AlertProps", "AppShellProps", "AspectRatioProps", "AvatarProps", "BadgeProps",
  "BoxProps", "ButtonProps", "CardProps", "CheckboxProps", "CodeBlockProps", "ContainerProps",
  "GridProps", "GroupProps", "InputProps", "ModalProps", "PaperProps", "SelectProps", "StackProps",
  "TabsProps", "TextInputProps"
];

for (const file of collectFiles(srcRoot)) {
  collectImportsFromFile(file);
}

for (const name of fallbackValueNames) valueNames.add(name);
for (const name of fallbackTypeNames) typeNames.add(name);

valueNames.delete("NoctraProvider");
valueNames.delete("default");

const sortedValueNames = [...valueNames]
  .filter((name) => /^[A-Za-z_$][\w$]*$/.test(name))
  .filter((name) => !name.endsWith("Props"))
  .sort((a, b) => a.localeCompare(b));

const sortedTypeNames = [...typeNames]
  .filter((name) => /^[A-Za-z_$][\w$]*$/.test(name))
  .sort((a, b) => a.localeCompare(b));

function typeAliasFor(name) {
  return `export type ${name} = any;`;
}

function exportValueFor(name) {
  if (/^use[A-Z]/.test(name)) {
    return `export function ${name}(..._args: any[]): any { return {}; }`;
  }

  if (/^(create|get|set|is|has|merge|compose|resolve|define|build)[A-Z_]/.test(name)) {
    return `export function ${name}(..._args: any[]): any { return {}; }`;
  }

  return `export const ${name}: any = createNoctraMock("${name}");`;
}

const runtimeContent = `import { createElement, forwardRef, isValidElement, type ElementType, type ReactNode } from "react";

export type NoctraMockProps = {
  as?: ElementType | string;
  children?: ReactNode;
  className?: string;
  style?: any;
  href?: string;
  type?: "button" | "submit" | "reset";
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  placeholder?: string;
  title?: any;
  label?: any;
  description?: any;
  data?: readonly any[];
  items?: readonly any[];
  rows?: readonly any[];
  columns?: readonly any[];
  options?: readonly any[];
  theme?: any;
  density?: any;
  radius?: any;
  radiusMode?: any;
  accent?: any;
  tone?: any;
  variant?: any;
  size?: any;
  [key: string]: any;
};

export type NoctraProviderProps = NoctraMockProps;
export type NoctraTheme = any;
export type NoctraTokens = any;

function cx(...values: any[]) {
  return values.filter((value) => typeof value === "string" && value.length > 0).join(" ");
}

function kebab(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function safeText(value: any): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
  if (typeof value === "function") return value.displayName || value.name || "function";
  if (Array.isArray(value)) return value.length === 0 ? undefined : value.map((item) => safeText(item)).filter(Boolean).join(", ");
  if (typeof value === "object") return undefined;
  return undefined;
}

function safeNode(value: any): any {
  if (value === null || value === undefined || value === "") return undefined;
  if (isValidElement(value)) return value;
  const text = safeText(value);
  return text === undefined ? undefined : text;
}

function safeChildren(value: any, fallback: string): any {
  if (value === null || value === undefined || value === "") return fallback;
  if (isValidElement(value)) return value;
  if (Array.isArray(value)) {
    const nodes = value.map((item) => safeNode(item)).filter((item) => item !== undefined);
    return nodes.length > 0 ? nodes : fallback;
  }
  return safeNode(value) ?? fallback;
}

function isInteractiveName(name: string) {
  return /button|tab|menu|select|checkbox|radio|switch|slider|pagination|rating|clipboard/i.test(name);
}

function isTextInputName(name: string) {
  return /input|textarea|search|password|number|color/i.test(name);
}

function resolveSafeTag(as: any, displayName: string, href?: string): any {
  if (typeof as === "string") return as;
  if (href) return "a";
  if (isTextInputName(displayName)) return "input";
  if (isInteractiveName(displayName)) return "button";
  return "div";
}

function createNoctraMock(displayName: string) {
  const Component = forwardRef<any, NoctraMockProps>(function NoctraRuntimeMockComponent(
    props,
    ref
  ) {
    const {
      as,
      children,
      className,
      style,
      href,
      type,
      title,
      label,
      description,
      data,
      items,
      rows,
      columns,
      options,
      disabled,
      placeholder,
      ...rest
    } = props;

    const tag = resolveSafeTag(as, displayName, href);
    const list = data ?? items ?? rows ?? options ?? columns;
    const displayChildren = safeChildren(children, safeText(label) ?? safeText(title) ?? displayName);
    const descriptionNode = safeNode(description);

    const safeProps: Record<string, any> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (
        key.startsWith("data-") ||
        key.startsWith("aria-") ||
        key === "id" ||
        key === "role" ||
        key === "name" ||
        key === "target" ||
        key === "rel"
      ) {
        safeProps[key] = value;
      }
    }

    const commonProps: Record<string, any> = {
      ...safeProps,
      ref,
      className: cx("ncr-mock", \`ncr-mock-\${kebab(displayName)}\`, className),
      style: typeof style === "object" && style !== null && !Array.isArray(style) ? style : undefined
    };

    if (tag === "input" || tag === "textarea") {
      return createElement(tag, {
        ...commonProps,
        placeholder: typeof placeholder === "string" ? placeholder : displayName,
        disabled: Boolean(disabled)
      });
    }

    if (href) {
      commonProps.href = href;
    }

    if (tag === "button") {
      commonProps.type = type ?? "button";
      commonProps.disabled = Boolean(disabled);
    }

    const childrenNodes: any[] = [
      createElement("span", { className: "ncr-mock-label", key: "label" }, displayChildren)
    ];

    if (descriptionNode !== undefined) {
      childrenNodes.push(createElement("small", { key: "description" }, descriptionNode));
    }

    if (Array.isArray(list) && list.length > 0) {
      childrenNodes.push(createElement("span", { className: "ncr-mock-list", key: "list" }, \`\${list.length} items\`));
    }

    return createElement(tag, commonProps, ...childrenNodes);
  });

  Component.displayName = \`NoctraDocsSafe\${displayName}\`;

  return Component;
}

export const DefaultNoctraMock: any = createNoctraMock("Default");

export function NoctraProvider({ children, className, style }: NoctraProviderProps) {
  return createElement("div", {
    className: cx("ncr-provider", className),
    style: typeof style === "object" && style !== null && !Array.isArray(style) ? style : undefined
  }, safeChildren(children, ""));
}

${sortedTypeNames.map(typeAliasFor).join("\n")}

${sortedValueNames.map(exportValueFor).join("\n")}

export default DefaultNoctraMock;
`;

writeText(runtimePath, runtimeContent);

let css = readText(cssPath);

const cssBlock = `
/* NOCTRA_DOCS_SAFE_RUNTIME_PREVIEW_START */
.ncr-provider{display:contents}
.ncr-mock{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:34px;padding:0 12px;border:1px solid rgba(148,163,184,.18);background:rgba(15,23,42,.48);color:var(--nc-text,#f8fafc);border-radius:10px;text-decoration:none;font:inherit;font-size:13px;line-height:1.2;vertical-align:middle}
.ncr-mock:hover{background:rgba(148,163,184,.1);border-color:rgba(148,163,184,.28)}
.ncr-mock-button,.ncr-mock-icon-button{cursor:pointer;background:rgba(124,58,237,.28);border-color:rgba(139,92,246,.46)}
.ncr-mock-input,.ncr-mock-text-input,.ncr-mock-textarea,.ncr-mock-search-input,.ncr-mock-password-input,.ncr-mock-number-input{justify-content:flex-start;min-width:180px;background:rgba(2,6,23,.42)}
.ncr-mock-card,.ncr-mock-paper,.ncr-mock-modal,.ncr-mock-drawer,.ncr-mock-dialog,.ncr-mock-card-body,.ncr-mock-card-header,.ncr-mock-card-footer{display:flex;min-height:54px;align-items:flex-start;justify-content:flex-start;padding:16px;background:rgba(15,23,42,.56)}
.ncr-mock-list{font-size:11px;color:var(--nc-text-muted,#a7b2c3)}
.ncr-mock small{font-size:11px;color:var(--nc-text-muted,#a7b2c3)}
/* NOCTRA_DOCS_SAFE_RUNTIME_PREVIEW_END */
`;

const cssPattern = /\/\* NOCTRA_DOCS_SAFE_RUNTIME_PREVIEW_START \*\/[\s\S]*?\/\* NOCTRA_DOCS_SAFE_RUNTIME_PREVIEW_END \*\//;

if (cssPattern.test(css)) {
  css = css.replace(cssPattern, cssBlock.trim());
} else {
  css = `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;
}

writeText(cssPath, css);

const runtimeAfter = readText(runtimePath);
const runtimeSyntax = ts.transpileModule(runtimeAfter, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: runtimePath
});

for (const diagnostic of runtimeSyntax.diagnostics ?? []) {
  problems.push(`${runtimePath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

for (const required of ["CardBody", "CardDescription", "CardFooter", "CardHeader", "CardTitle", "NcDensity", "NcRadius", "NcTone", "NcButtonVariant"]) {
  const exportPattern = new RegExp(`export (const|type|function) ${required}\\b`);

  if (!exportPattern.test(runtimeAfter)) {
    problems.push(`Missing runtime mock export: ${required}`);
  }
}

if (runtimeAfter.includes("@noctra/react")) {
  problems.push("NoctraRuntimeMock should not contain @noctra/react.");
}

if (!runtimeAfter.includes("safeChildren")) {
  problems.push("NoctraRuntimeMock missing safeChildren guard.");
}

if (!runtimeAfter.includes("resolveSafeTag")) {
  problems.push("NoctraRuntimeMock missing resolveSafeTag guard.");
}

const report = [
  "# Noctra Runtime Mock Object Safe Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Value exports: ${sortedValueNames.length}`,
  `Type exports: ${sortedTypeNames.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added safeText, safeNode and safeChildren guards.",
  "- Stopped rendering plain objects as React children.",
  "- Ignored non-string as props to prevent recursive component rendering.",
  "- Kept all required card slot exports and Noctra type aliases.",
  "- Preserved docs-only preview runtime behavior."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Noctra runtime mock object-safe patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Noctra runtime mock object-safe patch failed.");
}
