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

const before = text;

text = text.replace(
  /props\?:\s*Array<\{\s*name:\s*string;\s*type\?:\s*string;\s*required\?:\s*boolean;\s*\}>;/m,
  `props?: readonly {
    name: string;
    type?: string;
    required?: boolean;
  }[];`
);

text = text.replace(
  /props\?:\s*\{\s*name:\s*string;\s*type\?:\s*string;\s*required\?:\s*boolean;\s*\}\[\];/m,
  `props?: readonly {
    name: string;
    type?: string;
    required?: boolean;
  }[];`
);

if (text === before) {
  if (text.includes("type DemoComponentLike")) {
    text = text.replace(
      /(type DemoComponentLike = \{\s*name:\s*string;\s*)props\?:[\s\S]*?(\s*variants\?:\s*readonly string\[\];)/m,
      `$1props?: readonly {
    name: string;
    type?: string;
    required?: boolean;
  }[];
$2`
    );
  }
}

if (text === before) {
  throw new Error("Could not patch DemoComponentLike props type.");
}

writeText(file, text);

console.log("Patched DemoComponentLike props as readonly.");