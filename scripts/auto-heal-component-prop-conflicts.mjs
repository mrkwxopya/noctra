import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function walkFiles(root, extensions = [".types.ts"]) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walkFiles(fullPath, extensions));
      continue;
    }

    if (extensions.some((extension) => entry.endsWith(extension))) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output.sort((a, b) => a.localeCompare(b));
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

function parseProps(body) {
  const props = new Set();
  const regex = /^\s*([A-Za-z_$][\w$]*)\??\s*:/gm;
  let match;

  while ((match = regex.exec(body)) !== null) {
    props.add(match[1]);
  }

  return Array.from(props).sort((a, b) => a.localeCompare(b));
}

function parseOmitKeys(omitRaw) {
  const keys = new Set();
  const matches = omitRaw.match(/"([^"]+)"/g) ?? [];

  for (const match of matches) {
    keys.add(match.slice(1, -1));
  }

  return keys;
}

function formatOmitKeys(keys) {
  return Array.from(keys)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => `"${key}"`)
    .join(" | ");
}

const knownHtmlAttributeConflicts = new Set([
  "accept",
  "action",
  "align",
  "alt",
  "as",
  "async",
  "autoComplete",
  "autoFocus",
  "autoPlay",
  "capture",
  "checked",
  "children",
  "cite",
  "className",
  "color",
  "cols",
  "content",
  "controls",
  "coords",
  "crossOrigin",
  "dangerouslySetInnerHTML",
  "data",
  "dateTime",
  "defaultChecked",
  "defaultValue",
  "disabled",
  "download",
  "draggable",
  "encType",
  "form",
  "height",
  "hidden",
  "href",
  "htmlFor",
  "id",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "max",
  "maxLength",
  "media",
  "method",
  "min",
  "minLength",
  "multiple",
  "muted",
  "name",
  "open",
  "pattern",
  "placeholder",
  "poster",
  "prefix",
  "readOnly",
  "rel",
  "required",
  "reversed",
  "role",
  "rows",
  "scope",
  "selected",
  "shape",
  "size",
  "span",
  "spellCheck",
  "src",
  "srcDoc",
  "srcLang",
  "srcSet",
  "start",
  "step",
  "style",
  "tabIndex",
  "target",
  "title",
  "translate",
  "type",
  "value",
  "width",
  "wrap"
]);

function healFile(path) {
  let text = readText(path);
  let changed = false;
  const changes = [];

  const interfaceRegex = /export\s+interface\s+(\w+Props)\s+extends\s+Omit<(.+),\s*([^>]+)>\s*\{/g;
  const replacements = [];
  let match;

  while ((match = interfaceRegex.exec(text)) !== null) {
    const interfaceName = match[1];
    const base = match[2].trim();
    const omitRaw = match[3].trim();
    const headerStart = match.index;
    const bodyStart = interfaceRegex.lastIndex;
    const openBraceIndex = text.indexOf("{", headerStart);
    const closeBraceIndex = findMatchingBrace(text, openBraceIndex);

    if (closeBraceIndex === -1) continue;

    const body = text.slice(bodyStart, closeBraceIndex);
    const props = parseProps(body);
    const omitted = parseOmitKeys(omitRaw);
    const conflicts = props.filter((prop) => knownHtmlAttributeConflicts.has(prop) && !omitted.has(prop));

    if (conflicts.length === 0) continue;

    for (const conflict of conflicts) {
      omitted.add(conflict);
    }

    const newHeader = `export interface ${interfaceName} extends Omit<${base}, ${formatOmitKeys(omitted)}> {`;

    replacements.push({
      start: headerStart,
      end: bodyStart,
      value: newHeader
    });

    changed = true;
    changes.push(`${interfaceName}: added ${conflicts.join(", ")} to Omit<${base}, ...>`);
  }

  for (const replacement of replacements.reverse()) {
    text = `${text.slice(0, replacement.start)}${replacement.value}${text.slice(replacement.end)}`;
  }

  if (changed) {
    writeText(path, text);
  }

  return changes;
}

const files = walkFiles("packages/react/src/components");
const changes = [];

for (const file of files) {
  const fileChanges = healFile(file);

  for (const change of fileChanges) {
    changes.push(`${file}: ${change}`);
  }
}

const report = [
  "# Noctra Component Prop Conflict Auto-Heal Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Type files scanned: ${files.length}`,
  `Changes applied: ${changes.length}`,
  "",
  "## Changes",
  "",
  ...(changes.length > 0 ? changes.map((change) => `- ${change}`) : ["- None"])
].join("\n");

writeFileSync("component-prop-conflict-auto-heal-report.md", `${report}\n`, "utf8");

console.log(`Component prop conflict auto-heal completed. Files: ${files.length}. Changes: ${changes.length}. Report: component-prop-conflict-auto-heal-report.md`);