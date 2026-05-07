import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const reportPath = "docs-preview-helper-typing-fix-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceBetween(source, startNeedle, endNeedle, replacement) {
  const start = source.indexOf(startNeedle);

  if (start < 0) {
    throw new Error(`Start marker not found: ${startNeedle}`);
  }

  const end = source.indexOf(endNeedle, start + startNeedle.length);

  if (end < 0) {
    throw new Error(`End marker not found after ${startNeedle}: ${endNeedle}`);
  }

  return `${source.slice(0, start)}${replacement.trimEnd()}\n\n${source.slice(end)}`;
}

const before = readText(pagePath);
let page = before;

const helperFixBlock = `function humanizeSlug(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\\s+/g, " ")
    .trim()
    .replace(/\\b\\w/g, (letter) => letter.toUpperCase());
}

type ComponentVisualProps = {
  slug?: string;
  label?: string;
  state?: VisualState;
  component?: {
    slug?: string;
    kebab?: string;
    name?: string;
    label?: string;
  };
  children?: ReactNode;
  [key: string]: unknown;
};

function fallbackVisualState(): VisualState {
  return {
    variant: "filled",
    tone: "primary",
    size: "md",
    radius: "md",
    disabled: false,
    loading: false,
    fullWidth: false
  };
}

function ComponentVisual({
  slug,
  label,
  state,
  component,
  children
}: ComponentVisualProps) {
  const resolvedSlug = slug ?? component?.slug ?? component?.kebab ?? "button";
  const resolvedLabel = label ?? component?.label ?? component?.name ?? humanizeSlug(resolvedSlug);
  const resolvedState = state ?? fallbackVisualState();

  return (
    <div className="ncu-component-visual">
      <NativeVisual slug={resolvedSlug} label={resolvedLabel} state={resolvedState} />
      {children ? <div className="ncu-component-visual-extra">{children}</div> : null}
    </div>
  );
}

type ControlGroupOption = string | {
  label?: ReactNode;
  value?: string;
  disabled?: boolean;
  [key: string]: unknown;
};

type ControlGroupProps = {
  label?: ReactNode;
  value?: string;
  options?: readonly ControlGroupOption[];
  onChange?: (value: string) => void;
  children?: ReactNode;
  [key: string]: unknown;
};

function optionValue(option: ControlGroupOption) {
  if (typeof option === "string") return option;

  const raw = option.value ?? option.label;

  if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") {
    return String(raw);
  }

  return "";
}

function optionLabel(option: ControlGroupOption): ReactNode {
  if (typeof option === "string") return option;

  return option.label ?? option.value ?? "";
}

function ControlGroup({
  label,
  value,
  options,
  onChange,
  children
}: ControlGroupProps) {
  if (children) {
    return (
      <div className="ncu-control-group">
        {label ? <span className="ncu-control-label">{label}</span> : null}
        <div className="ncu-control-content">{children}</div>
      </div>
    );
  }

  return (
    <div className="ncu-control-group">
      {label ? <span className="ncu-control-label">{label}</span> : null}
      <div className="ncu-control-options">
        {(options ?? []).map((option, index) => {
          const resolvedValue = optionValue(option);

          return (
            <button
              key={resolvedValue || index}
              type="button"
              disabled={typeof option === "object" ? Boolean(option.disabled) : false}
              data-active={value === resolvedValue ? "true" : undefined}
              onClick={() => onChange?.(resolvedValue)}
            >
              {optionLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type BooleanControlProps = {
  label?: ReactNode;
  checked?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
  children?: ReactNode;
  [key: string]: unknown;
};

function BooleanControl({
  label,
  checked,
  value,
  onChange,
  children
}: BooleanControlProps) {
  const isChecked = Boolean(checked ?? value);

  return (
    <label className="ncu-boolean-control">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
      />
      <span>{children ?? label}</span>
    </label>
  );
}`;

if (page.includes("type ComponentVisualProps")) {
  page = replaceBetween(page, page.includes("function humanizeSlug") ? "function humanizeSlug" : "type ComponentVisualProps", "function buildCode", `${helperFixBlock}\n\n`);
} else {
  const marker = "function buildCode";

  if (!page.includes(marker)) {
    throw new Error("function buildCode marker not found.");
  }

  page = page.replace(marker, `${helperFixBlock}\n\n${marker}`);
}

writeText(pagePath, page);

const after = readText(pagePath);
const problems = [];

for (const marker of [
  "function humanizeSlug",
  "type ControlGroupOption",
  "options?: readonly ControlGroupOption[]",
  "function optionValue",
  "function optionLabel",
  "function ComponentVisual",
  "function ControlGroup",
  "function BooleanControl"
]) {
  if (!after.includes(marker)) {
    problems.push(`Missing helper typing marker: ${marker}`);
  }
}

if (after.includes("options?: readonly string[]")) {
  problems.push("Old ControlGroup string-only options type remains.");
}

const sourceFile = ts.createSourceFile(
  pagePath,
  after,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
  problems.push(`${pagePath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Docs Preview Helper Typing Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `UniversalComponentDocPage changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added humanizeSlug helper for ComponentVisual fallback labels.",
  "- Updated ControlGroup to accept string options and ControlOption-like object options.",
  "- Added optionValue and optionLabel normalizers.",
  "- Preserved ComponentVisual, ControlGroup and BooleanControl helpers.",
  "- Fixed TypeScript errors from STEP 313C under strict typecheck."
].join("\n");

writeText(reportPath, report);

console.log(`Docs preview helper typing fix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs preview helper typing fix failed.");
}
