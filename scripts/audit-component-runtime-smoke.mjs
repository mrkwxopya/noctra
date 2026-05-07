import { existsSync, readFileSync, writeFileSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";

const removedComponents = new Set([
  "",
  "",
  "",
  "",
  "",
  ""
]);

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function extractComponentNames() {
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

function safePropsFor(name) {
  const commonItems = [
    { value: "overview", label: "Overview", content: "Overview panel" },
    { value: "components", label: "Components", content: "Components panel" },
    { value: "release", label: "Release", content: "Release panel" }
  ];

  const commonOptions = [
    { value: "alpha", label: "Alpha" },
    { value: "beta", label: "Beta" },
    { value: "stable", label: "Stable" }
  ];

  const base = {
    title: `${name} demo`,
    description: `${name} runtime smoke demo`,
    label: `${name} label`,
    placeholder: `${name} placeholder`,
    value: "Noctra",
    defaultValue: "overview",
    checked: true,
    defaultChecked: true,
    open: true,
    defaultOpen: true,
    disabled: false,
    variant: "default",
    tone: "primary",
    size: "md",
    radius: "md",
    density: "default",
    items: commonItems,
    data: commonItems,
    options: commonOptions,
    columns: ["Package", "Status"],
    rows: [
      ["@noctra/react", "Ready"],
      ["@noctra/styles", "Ready"]
    ],
    onChange: () => undefined,
    onClick: () => undefined,
    onOpenChange: () => undefined,
    href: "#",
    src: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%238b5cf6%22/%3E%3C/svg%3E",
    alt: `${name} preview`
  };

  if (name === "Breadcrumbs") {
    return {
      ...base,
      items: [
        { label: "Docs", href: "/noctra/" },
        { label: "Components", href: "/noctra/components" },
        { label: name }
      ]
    };
  }

  return base;
}

async function main() {
  const names = extractComponentNames();
  const reactModule = await import("../packages/react/dist/index.js");
  const missing = [];
  const failed = [];
  const passed = [];

  for (const name of names) {
    const Component = reactModule[name];

    if (!Component) {
      missing.push(name);
      continue;
    }

    try {
      const html = renderToString(React.createElement(Component, safePropsFor(name), `${name} content`));

      if (typeof html !== "string") {
        failed.push({
          name,
          reason: "renderToString did not return a string"
        });
        continue;
      }

      passed.push(name);
    } catch (error) {
      failed.push({
        name,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  const report = [
    "# Component Runtime Smoke Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Components checked: ${names.length}`,
    `Passed: ${passed.length}`,
    `Missing exports: ${missing.length}`,
    `Render failures: ${failed.length}`,
    "",
    "## Missing exports",
    "",
    ...(missing.length > 0 ? missing.map((name) => `- ${name}`) : ["- None"]),
    "",
    "## Render failures",
    "",
    ...(failed.length > 0 ? failed.map((item) => `- ${item.name}: ${item.reason}`) : ["- None"]),
    "",
    "## Passed",
    "",
    ...(passed.length > 0 ? passed.map((name) => `- ${name}`) : ["- None"])
  ].join("\n");

  writeFileSync("component-runtime-smoke-report.md", `${report}\n`, "utf8");

  console.log(`Component runtime smoke audit completed. Checked: ${names.length}. Passed: ${passed.length}. Missing: ${missing.length}. Failed: ${failed.length}. Report: component-runtime-smoke-report.md`);

  if (missing.length > 0 || failed.length > 0) {
    throw new Error("Component runtime smoke audit found broken components. See component-runtime-smoke-report.md");
  }
}

await main();
