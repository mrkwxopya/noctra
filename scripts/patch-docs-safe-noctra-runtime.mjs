import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import ts from "typescript";

const srcRoot = "apps/docs/src";
const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const reportPath = "docs-safe-noctra-runtime-report.md";

const changed = [];
const problems = [];
const collectedNames = new Set();

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
  changed.push(normalizePath(path));
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
      normalized.includes("/components/docs-system/NoctraRuntimeMock.tsx")
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

function relativeRuntimeImport(fromFile) {
  let target = normalizePath(relative(dirname(fromFile), runtimePath)).replace(/\.tsx$/, "");

  if (!target.startsWith(".")) {
    target = `./${target}`;
  }

  return target;
}

function collectNamesFromImportClause(clause) {
  const namedMatch = clause.match(/\{([\s\S]*?)\}/);

  if (namedMatch) {
    for (const rawPart of namedMatch[1].split(",")) {
      const part = rawPart
        .trim()
        .replace(/^type\s+/, "")
        .replace(/\s+as\s+.+$/, "")
        .trim();

      if (/^[A-Za-z_$][\w$]*$/.test(part)) {
        collectedNames.add(part);
      }
    }
  }

  const defaultMatch = clause.match(/^\s*([A-Za-z_$][\w$]*)\s*(?:,|$)/);

  if (defaultMatch && !clause.trim().startsWith("{") && !clause.trim().startsWith("*")) {
    collectedNames.add(defaultMatch[1]);
  }
}

const files = collectFiles(srcRoot);
const importFiles = [];

for (const file of files) {
  let text = readText(file);

  if (!text.includes("@noctra/react")) continue;

  const before = text;
  importFiles.push(file);

  text = text.replace(/import\s+type\s+\{([\s\S]*?)\}\s+from\s+["']@noctra\/react["'];/g, (match, names) => {
    collectNamesFromImportClause(`{${names}}`);
    return `import type { ${names.trim()} } from "${relativeRuntimeImport(file)}";`;
  });

  text = text.replace(/import\s+\{([\s\S]*?)\}\s+from\s+["']@noctra\/react["'];/g, (match, names) => {
    collectNamesFromImportClause(`{${names}}`);
    return `import { ${names.trim()} } from "${relativeRuntimeImport(file)}";`;
  });

  text = text.replace(/import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+["']@noctra\/react["'];/g, (match, namespaceName) => {
    return `import * as ${namespaceName} from "${relativeRuntimeImport(file)}";`;
  });

  text = text.replace(/import\s+([A-Za-z_$][\w$]*)\s+from\s+["']@noctra\/react["'];/g, (match, defaultName) => {
    collectedNames.add(defaultName);
    return `import ${defaultName} from "${relativeRuntimeImport(file)}";`;
  });

  if (text !== before) {
    writeText(file, text);
  }
}

const fallbackComponentNames = [
  "Accordion", "Alert", "AppShell", "AspectRatio", "Autocomplete", "Avatar", "Badge", "Blockquote", "Box", "Breadcrumb",
  "Breadcrumbs", "Button", "Card", "Center", "Checkbox", "ClickOutside", "Clipboard", "Code", "CodeBlock", "ColorInput",
  "ColorPicker", "Combobox", "Command", "CommandBar", "Container", "ContextMenu", "CreditCard", "DataGrid", "Dialog",
  "Divider", "Dock", "Drawer", "Dropzone", "EmptyState", "Flex", "FloatLabel", "FocusTrap", "Footer", "FormField",
  "Grid", "Group", "Header", "Highlight", "HoverCard", "IconButton", "InlineCode", "Input", "Kbd", "Layout",
  "LayoutShell", "Link", "ListBox", "Loader", "Menu", "Modal", "MultiSelect", "NativeSelect", "Notification",
  "NumberInput", "Page", "Pagination", "Paper", "PasswordInput", "PinCode", "PinInput", "Popover", "Portal",
  "Progress", "Prose", "Radio", "RangeSlider", "Rating", "ResizablePanel", "ScrollArea", "ScrollLock", "SearchInput",
  "Section", "SegmentedControl", "Select", "Sidebar", "SimpleGrid", "Skeleton", "Slider", "Spacer", "Spinner",
  "SplitPane", "Stack", "StatusBar", "Stepper", "Switch", "Table", "TableOfContents", "Tabs", "TagsInput",
  "Textarea", "TextInput", "Timeline", "Toast", "Toolbar", "Tooltip", "TransferList", "Tree", "TreeSelect",
  "TreeView", "VisuallyHidden"
];

for (const name of fallbackComponentNames) {
  collectedNames.add(name);
}

const valueExports = [...collectedNames]
  .filter((name) => /^[A-Za-z_$][\w$]*$/.test(name))
  .filter((name) => !name.endsWith("Props"))
  .sort((a, b) => a.localeCompare(b));

const typeExports = [...collectedNames]
  .filter((name) => /^[A-Za-z_$][\w$]*$/.test(name))
  .filter((name) => name.endsWith("Props"))
  .sort((a, b) => a.localeCompare(b));

const runtimeContent = `import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactNode
} from "react";

export type NoctraMockProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  href?: string;
  type?: "button" | "submit" | "reset";
  value?: unknown;
  checked?: boolean;
  disabled?: boolean;
  placeholder?: string;
  title?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  data?: readonly unknown[];
  items?: readonly unknown[];
  rows?: readonly unknown[];
  columns?: readonly unknown[];
  options?: readonly unknown[];
  [key: string]: unknown;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function renderPrimitive(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function isInteractiveName(name: string) {
  return /button|tab|menu|select|input|checkbox|radio|switch|slider|pagination|rating|clipboard/i.test(name);
}

function isTextInputName(name: string) {
  return /input|textarea|search|password|number|color/i.test(name);
}

function createNoctraMock(displayName: string) {
  const Component = forwardRef<HTMLElement, NoctraMockProps>(function NoctraRuntimeMockComponent(
    {
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
      ...props
    },
    ref
  ) {
    const Tag = as ?? (href ? "a" : isTextInputName(displayName) ? "input" : isInteractiveName(displayName) ? "button" : "div");
    const displayChildren = children ?? renderPrimitive(label) ?? renderPrimitive(title) ?? displayName;
    const list = data ?? items ?? rows ?? options ?? columns;

    const safeProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
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

    if (Tag === "input") {
      return (
        <input
          ref={ref as never}
          className={cx("ncr-mock", "ncr-mock-input", className)}
          style={style}
          placeholder={typeof props.placeholder === "string" ? props.placeholder : displayName}
          disabled={Boolean(props.disabled)}
          {...safeProps}
        />
      );
    }

    return (
      <Tag
        ref={ref as never}
        className={cx("ncr-mock", \`ncr-mock-\${displayName.toLowerCase()}\`, className)}
        style={style}
        href={href}
        type={Tag === "button" ? type ?? "button" : undefined}
        disabled={Tag === "button" ? Boolean(props.disabled) : undefined}
        {...safeProps}
      >
        <span className="ncr-mock-label">{displayChildren}</span>
        {description ? <small>{description}</small> : null}
        {Array.isArray(list) && list.length > 0 ? (
          <span className="ncr-mock-list">{list.length} items</span>
        ) : null}
      </Tag>
    );
  });

  Component.displayName = \`NoctraDocsSafe\${displayName}\`;

  return Component;
}

${typeExports.map((name) => `export type ${name} = NoctraMockProps;`).join("\n")}

${valueExports.map((name) => `export const ${name} = createNoctraMock("${name}");`).join("\n")}

export const NoctraProvider = ({ children }: { children?: ReactNode }) => <>{children}</>;

export default createNoctraMock("Default");
`;

writeText(runtimePath, runtimeContent);

let cssPath = "apps/docs/src/docs.css";
let css = readText(cssPath);

const cssBlock = `
/* NOCTRA_DOCS_SAFE_RUNTIME_PREVIEW_START */
.ncr-mock{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:34px;padding:0 12px;border:1px solid rgba(148,163,184,.18);background:rgba(15,23,42,.48);color:var(--nc-text,#f8fafc);border-radius:10px;text-decoration:none;font:inherit;font-size:13px;line-height:1.2;vertical-align:middle}
.ncr-mock:hover{background:rgba(148,163,184,.1);border-color:rgba(148,163,184,.28)}
.ncr-mock-button,.ncr-mock-iconbutton{cursor:pointer;background:rgba(124,58,237,.28);border-color:rgba(139,92,246,.46)}
.ncr-mock-input{justify-content:flex-start;min-width:180px;background:rgba(2,6,23,.42)}
.ncr-mock-card,.ncr-mock-paper,.ncr-mock-modal,.ncr-mock-drawer,.ncr-mock-dialog{display:flex;min-height:90px;align-items:flex-start;justify-content:flex-start;padding:16px;background:rgba(15,23,42,.56)}
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

const remainingImports = [];

for (const file of collectFiles(srcRoot)) {
  const text = readText(file);

  if (text.includes("@noctra/react")) {
    remainingImports.push(file);
  }
}

if (remainingImports.length > 0) {
  problems.push(`Remaining @noctra/react imports in docs source: ${remainingImports.join(", ")}`);
}

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

const report = [
  "# Docs Safe Noctra Runtime Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Files scanned: ${files.length}`,
  `Files with @noctra/react imports before patch: ${importFiles.length}`,
  `Runtime value exports generated: ${valueExports.length}`,
  `Runtime type exports generated: ${typeExports.length}`,
  `Changed files: ${changed.length}`,
  `Remaining @noctra/react imports: ${remainingImports.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Patched import files",
  "",
  ...(importFiles.length ? importFiles.map((file) => `- ${file}`) : ["- None"]),
  "",
  "## Remaining imports",
  "",
  ...(remainingImports.length ? remainingImports.map((file) => `- ${file}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Replaced docs-side @noctra/react imports with docs-system/NoctraRuntimeMock.",
  "- Generated safe preview component exports.",
  "- Kept package source untouched.",
  "- Added safe preview CSS."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Docs safe Noctra runtime patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs safe Noctra runtime patch failed.");
}
