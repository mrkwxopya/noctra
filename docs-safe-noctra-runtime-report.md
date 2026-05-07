# Docs Safe Noctra Runtime Report

Generated: 2026-05-07T16:27:37.744Z

Files scanned: 42
Files with @noctra/react imports before patch: 24
Runtime value exports generated: 135
Runtime type exports generated: 0
Changed files: 21
Remaining @noctra/react imports: 14
Problems found: 1

## Patched import files

- apps/docs/src/components/AccessibilityAudit.tsx
- apps/docs/src/components/ComponentDocsOverview.tsx
- apps/docs/src/components/FoundationQualityGate.tsx
- apps/docs/src/components/InteractiveComponentDemo.tsx
- apps/docs/src/components/MantineStyleComponentDocs.tsx
- apps/docs/src/data/componentExamples.tsx
- apps/docs/src/data/interactiveDemoPresets.ts
- apps/docs/src/data/realDemoAdapters.ts
- apps/docs/src/generated/noctra-component-registry.generated.ts
- apps/docs/src/generated/noctra-professional-docs.generated.ts
- apps/docs/src/main.before-noctra-docs-pages.tsx
- apps/docs/src/pages/AccessibilityPage.tsx
- apps/docs/src/pages/ArchitecturePage.tsx
- apps/docs/src/pages/ButtonReferencePage.tsx
- apps/docs/src/pages/ComponentDetailPage.tsx
- apps/docs/src/pages/GettingStartedPage.tsx
- apps/docs/src/pages/HomePage.tsx
- apps/docs/src/pages/LayoutPage.tsx
- apps/docs/src/pages/QualityPage.tsx
- apps/docs/src/pages/ReleasePage.tsx
- apps/docs/src/pages/TokensPage.tsx
- apps/docs/src/playground/buttonPlayground.ts
- apps/docs/src/registry/button.docs.ts
- apps/docs/src/smoke/subpath-imports.tsx

## Remaining imports

- apps/docs/src/components/InteractiveComponentDemo.tsx
- apps/docs/src/components/MantineStyleComponentDocs.tsx
- apps/docs/src/data/componentExamples.tsx
- apps/docs/src/data/interactiveDemoPresets.ts
- apps/docs/src/data/realDemoAdapters.ts
- apps/docs/src/generated/noctra-component-registry.generated.ts
- apps/docs/src/generated/noctra-professional-docs.generated.ts
- apps/docs/src/pages/ArchitecturePage.tsx
- apps/docs/src/pages/ButtonReferencePage.tsx
- apps/docs/src/pages/ComponentDetailPage.tsx
- apps/docs/src/pages/GettingStartedPage.tsx
- apps/docs/src/pages/QualityPage.tsx
- apps/docs/src/pages/ReleasePage.tsx
- apps/docs/src/smoke/subpath-imports.tsx

## Problems

- Remaining @noctra/react imports in docs source: apps/docs/src/components/InteractiveComponentDemo.tsx, apps/docs/src/components/MantineStyleComponentDocs.tsx, apps/docs/src/data/componentExamples.tsx, apps/docs/src/data/interactiveDemoPresets.ts, apps/docs/src/data/realDemoAdapters.ts, apps/docs/src/generated/noctra-component-registry.generated.ts, apps/docs/src/generated/noctra-professional-docs.generated.ts, apps/docs/src/pages/ArchitecturePage.tsx, apps/docs/src/pages/ButtonReferencePage.tsx, apps/docs/src/pages/ComponentDetailPage.tsx, apps/docs/src/pages/GettingStartedPage.tsx, apps/docs/src/pages/QualityPage.tsx, apps/docs/src/pages/ReleasePage.tsx, apps/docs/src/smoke/subpath-imports.tsx

## Applied

- Replaced docs-side @noctra/react imports with docs-system/NoctraRuntimeMock.
- Generated safe preview component exports.
- Kept package source untouched.
- Added safe preview CSS.
