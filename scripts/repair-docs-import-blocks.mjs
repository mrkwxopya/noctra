import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function stripImports(text) {
  let next = text;

  next = next.replace(/^\s*import\s*\{[\s\S]*?\}\s*from\s*["'][^"']+["'];\s*\r?\n?/gm, "");
  next = next.replace(/^\s*import\s+type\s*\{[\s\S]*?\}\s*from\s*["'][^"']+["'];\s*\r?\n?/gm, "");
  next = next.replace(/^\s*import\s+[^;\n]+from\s*["'][^"']+["'];\s*\r?\n?/gm, "");
  next = next.replace(/^\s*import\s+["'][^"']+["'];\s*\r?\n?/gm, "");

  return next.replace(/^\s+/, "");
}

function replaceImports(path, imports) {
  const current = readText(path);

  if (!current) {
    throw new Error(`Missing or empty file: ${path}`);
  }

  const body = stripImports(current);
  writeText(path, `${imports.trimEnd()}\n\n${body}`);
}

replaceImports(
  "apps/docs/src/main.tsx",
  `import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { DocsChrome, type DocsRoute } from "./components/DocsChrome";
import { OverviewPage } from "./pages/OverviewPage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { ComponentDetailPage } from "./pages/ComponentDetailPage";
import { ArchitecturePage } from "./pages/ArchitecturePage";
import { ThemingPage } from "./pages/ThemingPage";
import { QualityPage } from "./pages/QualityPage";
import { ReleasePage } from "./pages/ReleasePage";
import { noctraDocsComponents } from "./generated/noctra-professional-docs.generated";
import {
  canonicalizeDocsCleanRoute,
  docsHref,
  forceNoctraDocsHref,
  isInternalDocsUrl,
  parseDocsRouteFromLocation,
  sanitizeDocsAnchors
} from "./lib/docsRouting";
import "./noctra-style-bridge.css";
import "./docs.css";`
);

replaceImports(
  "apps/docs/src/components/DocsChrome.tsx",
  `import { useMemo, useState, type ReactNode } from "react";
import {
  noctraDocsComponents,
  noctraDocsGroups,
  noctraDocsSummary
} from "../generated/noctra-professional-docs.generated";
import { docsHref } from "../lib/docsRouting";`
);

replaceImports(
  "apps/docs/src/pages/ComponentsPage.tsx",
  `import { useMemo, useState } from "react";
import { PageHero, TagList } from "../components/DocsChrome";
import { noctraDocsComponents, noctraDocsGroups } from "../generated/noctra-professional-docs.generated";
import { docsHref } from "../lib/docsRouting";`
);

replaceImports(
  "apps/docs/src/pages/ComponentDetailPage.tsx",
  `import {
  AnchorList,
  CodeBlock,
  CoverageMeter,
  DataTable,
  DocCard,
  PageHero,
  SectionTitle,
  StatCard,
  TagList
} from "../components/DocsChrome";
import { InteractiveComponentDemo } from "../components/InteractiveComponentDemo";
import { MantineStyleComponentDocs } from "../components/MantineStyleComponentDocs";
import { getCategoryLabel, getPropDescription } from "../data/propDescriptions";
import { noctraDocsComponents, type NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";
import { docsHref } from "../lib/docsRouting";`
);

writeText(
  "apps/docs/src/components/DocsShell.tsx",
  `import type { ReactNode } from "react";

export function DocsShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default DocsShell;`
);

console.log("Docs import blocks repaired.");
