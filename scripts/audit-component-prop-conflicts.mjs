import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
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

function extractInterfaceBlocks(text) {
  const blocks = [];
  const regex = /export\s+interface\s+(\w+Props)\s+extends\s+Omit<([^>]+),\s*([^>]+)>\s*\{/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const name = match[1];
    const base = match[2].trim();
    const omitRaw = match[3].trim();
    const start = match.index;
    const bodyStart = regex.lastIndex;
    let depth = 1;
    let index = bodyStart;

    while (index < text.length && depth > 0) {
      const char = text[index];

      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;

      index += 1;
    }

    blocks.push({
      name,
      base,
      omitRaw,
      body: text.slice(bodyStart, index - 1),
      source: text.slice(start, index)
    });
  }

  return blocks;
}

function parseOmitKeys(omitRaw) {
  const keys = new Set();
  const matches = omitRaw.match(/"([^"]+)"/g) ?? [];

  for (const match of matches) {
    keys.add(match.slice(1, -1));
  }

  return keys;
}

function parsePropNames(body) {
  const props = [];
  const regex = /^\s*([A-Za-z_$][\w$]*)\??\s*:/gm;
  let match;

  while ((match = regex.exec(body)) !== null) {
    props.push(match[1]);
  }

  return Array.from(new Set(props)).sort((a, b) => a.localeCompare(b));
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

const files = walkFiles("packages/react/src/components");
const rows = [];
const problems = [];

for (const file of files) {
  const text = readText(file);
  const blocks = extractInterfaceBlocks(text);

  for (const block of blocks) {
    const omitted = parseOmitKeys(block.omitRaw);
    const props = parsePropNames(block.body);
    const conflicts = props.filter((prop) => knownHtmlAttributeConflicts.has(prop) && !omitted.has(prop));

    rows.push({
      file,
      interfaceName: block.name,
      base: block.base,
      omitted: Array.from(omitted).sort((a, b) => a.localeCompare(b)),
      props,
      conflicts
    });

    for (const conflict of conflicts) {
      problems.push(`${file}: ${block.name} declares "${conflict}" but does not omit it from ${block.base}`);
    }
  }
}

const report = [
  "# Noctra Component Prop Conflict Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Type files scanned: ${files.length}`,
  `Interfaces scanned: ${rows.length}`,
  `Potential conflicts found: ${problems.length}`,
  "",
  "## Interface Matrix",
  "",
  "| File | Interface | Base | Omitted keys | Potential conflicts |",
  "|---|---|---|---|---|",
  ...rows.map((row) => {
    return `| ${row.file} | ${row.interfaceName} | ${row.base.replace(/\|/g, "\\|")} | ${row.omitted.join(", ") || "-"} | ${row.conflicts.join(", ") || "-"} |`;
  }),
  "",
  "## Potential Conflicts",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Note",
  "",
  "- This audit is intentionally conservative. Build/typecheck remains the source of truth.",
  "- Any listed prop should either be renamed or added to the Omit<...> key list when it intentionally overrides a native HTML prop."
].join("\n");

writeFileSync("component-prop-conflict-audit-report.md", `${report}\n`, "utf8");

console.log(`Component prop conflict audit completed. Files: ${files.length}. Interfaces: ${rows.length}. Potential conflicts: ${problems.length}. Report: component-prop-conflict-audit-report.md`);