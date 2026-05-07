import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/main.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing ${file}`);
}

const before = text;

if (!text.includes("sanitizeDocsAnchors")) {
  if (text.includes('from "./lib/docsRouting"')) {
    text = text.replace(
      /import\s*\{([\s\S]*?)\}\s*from\s*["']\.\/lib\/docsRouting["'];/,
      (match, names) => {
        const parts = names
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        if (!parts.includes("sanitizeDocsAnchors")) {
          parts.push("sanitizeDocsAnchors");
        }

        return `import {\n  ${Array.from(new Set(parts)).join(",\n  ")}\n} from "./lib/docsRouting";`;
      }
    );
  } else {
    text = `import { sanitizeDocsAnchors } from "./lib/docsRouting";\n${text}`;
  }
}

if (!text.includes("sanitizeDocsAnchors();")) {
  const renderCallIndex = text.indexOf("createRoot(");

  if (renderCallIndex !== -1) {
    text = `${text.slice(0, renderCallIndex)}
sanitizeDocsAnchors();

const noctraAnchorObserver = new MutationObserver(() => {
  sanitizeDocsAnchors();
});

noctraAnchorObserver.observe(document.body, {
  childList: true,
  subtree: true
});

${text.slice(renderCallIndex)}`;
  } else {
    text = `${text}

sanitizeDocsAnchors();
`;
  }
}

writeText(file, text);

console.log(`main.tsx anchor sanitize patch completed. Changed: ${before !== text}`);