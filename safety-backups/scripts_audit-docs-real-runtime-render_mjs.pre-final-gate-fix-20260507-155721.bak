import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

process.env.NODE_ENV = "production";

const rootRequire = createRequire(resolve("package.json"));
const appRequire = createRequire(resolve("apps/docs/package.json"));

const React = appRequire("react");
const { renderToString } = appRequire("react-dom/server");

let createServer;

try {
  ({ createServer } = appRequire("vite"));
} catch {
  ({ createServer } = rootRequire("vite"));
}

const removedComponents = new Set([
  "DateInput",
  "DateTimeInput",
  "MonthInput",
  "TimeInput",
  "WeekInput",
  "YearInput",
  "TimePicker",
  "Calendar",
  "DatePicker",
  "DateTimePicker",
  "DateRangePicker"
]);

const childlessComponents = new Set([
  "Input",
  "SearchInput",
  "TextInput",
  "Textarea",
  "NumberInput",
  "Select",
  "MultiSelect",
  "Combobox",
  "Autocomplete",
  "TagsInput",
  "Checkbox",
  "Radio",
  "Switch",
  "Slider",
  "Pagination",
  "ColorInput",
  "FileInput"
]);

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function toViteFsId(path) {
  return `/@fs/${resolve(path).replace(/\\/g, "/")}`;
}

function extractComponents() {
  const generated = readText("apps/docs/src/generated/noctra-professional-docs.generated.ts");
  const names = new Set();

  for (const match of generated.matchAll(/name:\s*"([A-Z][A-Za-z0-9]*)"/g)) {
    const name = match[1];

    if (name && !removedComponents.has(name)) {
      names.add(name);
    }
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

function compilePresetsRuntimeModule() {
  const sourcePath = "apps/docs/src/data/interactiveDemoPresets.ts";
  const source = readText(sourcePath);

  if (!source) {
    throw new Error(`Missing ${sourcePath}`);
  }

  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      skipLibCheck: true
    },
    fileName: sourcePath,
    reportDiagnostics: true
  });

  const diagnostics = result.diagnostics ?? [];

  if (diagnostics.length > 0) {
    const message = diagnostics
      .map((diagnostic) => `TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`)
      .join("\n");

    throw new Error(`interactiveDemoPresets.ts transpile failed:\n${message}`);
  }

  mkdirSync("apps/docs/.tmp-docs-runtime", { recursive: true });

  const runtimePath = "apps/docs/.tmp-docs-runtime/interactiveDemoPresets.runtime.mjs";
  writeText(runtimePath, result.outputText);

  return pathToFileURL(resolve(runtimePath)).href;
}

async function loadReactRuntimeWithVite() {
  const entryCandidates = [
    "packages/react/src/index.ts",
    "packages/react/src/index.tsx"
  ];

  const entry = entryCandidates.find((candidate) => existsSync(candidate));

  if (!entry) {
    throw new Error("Could not find packages/react/src/index.ts or packages/react/src/index.tsx");
  }

  const server = await createServer({
    root: resolve("."),
    configFile: false,
    mode: "production",
    logLevel: "silent",
    appType: "custom",
    server: {
      middlewareMode: true
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify("production")
    },
    esbuild: {
      jsx: "automatic",
      jsxDev: false,
      jsxImportSource: "react"
    },
    ssr: {
      external: [
        "react",
        "react-dom",
        "react-dom/server",
        "react/jsx-runtime",
        "react/jsx-dev-runtime"
      ],
      noExternal: []
    },
    resolve: {
      preserveSymlinks: false,
      conditions: ["production", "import", "module", "browser", "default"]
    },
    optimizeDeps: {
      noDiscovery: true,
      exclude: [
        "react",
        "react-dom",
        "react-dom/server",
        "react/jsx-runtime",
        "react/jsx-dev-runtime"
      ]
    }
  });

  try {
    const runtime = await server.ssrLoadModule(toViteFsId(entry));
    return { runtime, server };
  } catch (error) {
    await server.close();
    throw error;
  }
}

function safeComponentLike(name) {
  return {
    name,
    props: []
  };
}

function sanitizeRuntimeProps(props) {
  const next = { ...(props ?? {}) };

  delete next.children;
  delete next.controls;
  delete next.previewWidth;
  delete next.previewHeight;

  for (const key of Object.keys(next)) {
    const value = next[key];

    if (value === undefined || typeof value === "function") {
      delete next[key];
    }
  }

  return next;
}

function getChildren(name, preset, props) {
  if (childlessComponents.has(name)) return undefined;
  if (typeof props?.children === "string") return props.children;
  if (typeof preset?.props?.children === "string") return preset.props.children;
  if (typeof preset?.children === "string") return preset.children;

  return `${name} content`;
}

function isEmptyHtml(html) {
  const stripped = html
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "")
    .trim();

  return stripped.length === 0 && html.length < 80;
}

const problems = [];
const warnings = [];
const passed = [];

let viteServer;

try {
  const componentNames = extractComponents();
  const loadedRuntime = await loadReactRuntimeWithVite();
  const reactRuntime = loadedRuntime.runtime;
  viteServer = loadedRuntime.server;

  const presetsModule = await import(`${compilePresetsRuntimeModule()}?v=${Date.now()}`);

  for (const name of componentNames) {
    const RuntimeComponent = reactRuntime[name];

    if (!RuntimeComponent) {
      problems.push(`${name}: runtime export missing from Vite-loaded @noctra/react source runtime`);
      continue;
    }

    const componentLike = safeComponentLike(name);
    const preset = presetsModule.getInteractiveDemoPreset?.(componentLike);

    if (!preset) {
      warnings.push(`${name}: no component-specific preset found; runtime render used fallback`);
    }

    let runtimeProps = {};

    try {
      runtimeProps = sanitizeRuntimeProps(
        presetsModule.buildInteractiveDemoProps
          ? presetsModule.buildInteractiveDemoProps(componentLike, {})
          : preset?.props ?? {}
      );
    } catch (error) {
      problems.push(`${name}: buildInteractiveDemoProps failed: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    let code = "";

    try {
      code = presetsModule.getInteractiveDemoCode
        ? presetsModule.getInteractiveDemoCode(componentLike, {})
        : `import { ${name} } from "@noctra/react";`;
    } catch (error) {
      problems.push(`${name}: getInteractiveDemoCode failed: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    if (!code.includes(`import { ${name} } from "@noctra/react"`)) {
      problems.push(`${name}: generated code does not contain expected @noctra/react import`);
    }

    if (code.includes("undefined") || code.includes("[object Object]")) {
      warnings.push(`${name}: generated code contains suspicious value`);
    }

    try {
      const children = getChildren(name, preset, runtimeProps);
      delete runtimeProps.children;

      const element = React.createElement(RuntimeComponent, runtimeProps, children);
      const html = renderToString(element);

      if (typeof html !== "string") {
        problems.push(`${name}: renderToString did not return string`);
        continue;
      }

      if (html.includes("runtime preview failed")) {
        problems.push(`${name}: rendered runtime failure text`);
        continue;
      }

      if (isEmptyHtml(html)) {
        warnings.push(`${name}: rendered output looks empty`);
      }

      if (/Component preview|Component content|Code preview|Container preview|Flex preview|Grid preview|ClickOutside preview|No steps available/.test(html)) {
        warnings.push(`${name}: rendered output contains placeholder-like text`);
      }

      passed.push(name);
    } catch (error) {
      problems.push(`${name}: render failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const report = [
    "# Docs Real Runtime Render Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Components checked: ${componentNames.length}`,
    `Passed: ${passed.length}`,
    `Problems found: ${problems.length}`,
    `Warnings found: ${warnings.length}`,
    "",
    "## Problems",
    "",
    ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
    "",
    "## Warnings",
    "",
    ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ["- None"]),
    "",
    "## Passed",
    "",
    ...(passed.length > 0 ? passed.map((name) => `- ${name}`) : ["- None"])
  ].join("\n");

  writeText("docs-real-runtime-render-report.md", report);

  console.log(`Docs real runtime render audit completed. Checked: ${componentNames.length}. Passed: ${passed.length}. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: docs-real-runtime-render-report.md`);

  if (problems.length > 0) {
    console.error(report);
    throw new Error("Docs real runtime render audit failed with blockers.");
  }
} finally {
  if (viteServer) {
    await viteServer.close();
  }
}