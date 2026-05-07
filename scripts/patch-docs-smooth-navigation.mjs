import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceFunction(text, functionName, replacement, nextFunctionName) {
  const start = text.indexOf(`export function ${functionName}(`);

  if (start === -1) {
    throw new Error(`Could not find function ${functionName}`);
  }

  const end = text.indexOf(`export function ${nextFunctionName}`, start);

  if (end === -1) {
    throw new Error(`Could not find next function ${nextFunctionName}`);
  }

  return `${text.slice(0, start)}${replacement}\n\n${text.slice(end)}`;
}

const chromePath = "apps/docs/src/components/DocsChrome.tsx";
let chrome = readText(chromePath);

const anchorListReplacement = `export function AnchorList({ items }: { items: readonly { href: string; label: string; description?: string }[] }) {
  function handleScroll(targetHref: string) {
    const targetId = targetHref.replace(/^#/, "");
    const target = document.getElementById(targetId);

    if (!target) return;

    const topbarOffset = 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - topbarOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth"
    });
  }

  return (
    <nav className="nd-anchor-list" aria-label="On this page">
      <strong>On this page</strong>
      {items.map((item) => (
        <button key={item.href} type="button" onClick={() => handleScroll(item.href)}>
          <span>{item.label}</span>
          {item.description ? <small>{item.description}</small> : null}
        </button>
      ))}
    </nav>
  );
}`;

chrome = replaceFunction(chrome, "AnchorList", anchorListReplacement, "CoverageMeter");

writeText(chromePath, chrome);

const mainPath = "apps/docs/src/main.tsx";
let main = readText(mainPath);

if (!main.includes("Smooth scroll to top on route changes")) {
  const marker = "  const page = useMemo(() => {";

  if (!main.includes(marker)) {
    throw new Error("Could not find page useMemo marker in main.tsx");
  }

  main = main.replace(
    marker,
    `  // Smooth scroll to top on route changes.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [parsedRoute.route, parsedRoute.componentSlug]);

${marker}`
  );

  writeText(mainPath, main);
}

const cssPath = "apps/docs/src/docs.css";
let css = readText(cssPath);

if (!css.includes(".nd-anchor-list button")) {
  css = `${css.trimEnd()}
.nd-anchor-list button{appearance:none;width:100%;display:grid;gap:.1rem;padding:.58rem;border:0;border-radius:.75rem;background:transparent;color:var(--nd-muted);text-align:left;font:inherit;cursor:pointer}
.nd-anchor-list button:hover{background:rgba(139,92,246,.12);color:#ddd6fe}
.nd-anchor-list button:focus-visible{outline:0;box-shadow:0 0 0 3px rgba(139,92,246,.2)}
.nd-anchor-list button span{font-size:.82rem;font-weight:850;color:inherit}
.nd-anchor-list button small{font-size:.72rem;color:inherit;opacity:.82}
.nd-anchor-list a{display:none}
`;
  writeText(cssPath, css);
}

console.log("Docs smooth navigation patched.");