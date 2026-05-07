# Docs Safe Noctra Runtime Force Report

Generated: 2026-05-07T16:30:49.242Z

Files scanned: 42
Files force patched: 8
Runtime component exports generated: 105
Runtime hook exports generated: 0
Runtime utility exports generated: 0
Runtime type exports generated: 105
Changed files: 10
Remaining @noctra/react imports: 13
Problems found: 1

## Force patched files

- apps/docs/src/data/componentExamples.tsx
- apps/docs/src/data/interactiveDemoPresets.ts
- apps/docs/src/data/realDemoAdapters.ts
- apps/docs/src/generated/noctra-professional-docs.generated.ts
- apps/docs/src/pages/ArchitecturePage.tsx
- apps/docs/src/pages/ButtonReferencePage.tsx
- apps/docs/src/pages/GettingStartedPage.tsx
- apps/docs/src/pages/ReleasePage.tsx

## Remaining imports

- apps/docs/src/components/InteractiveComponentDemo.tsx
- apps/docs/src/components/MantineStyleComponentDocs.tsx
- apps/docs/src/data/componentExamples.tsx
- apps/docs/src/data/interactiveDemoPresets.ts
- apps/docs/src/data/realDemoAdapters.ts
- apps/docs/src/generated/noctra-component-registry.generated.ts
- apps/docs/src/generated/noctra-professional-docs.generated.ts
- apps/docs/src/pages/ArchitecturePage.tsx
- apps/docs/src/pages/ComponentDetailPage.tsx
- apps/docs/src/pages/GettingStartedPage.tsx
- apps/docs/src/pages/QualityPage.tsx
- apps/docs/src/pages/ReleasePage.tsx
- apps/docs/src/smoke/subpath-imports.tsx

## Problems

- Remaining @noctra/react imports in docs source: apps/docs/src/components/InteractiveComponentDemo.tsx, apps/docs/src/components/MantineStyleComponentDocs.tsx, apps/docs/src/data/componentExamples.tsx, apps/docs/src/data/interactiveDemoPresets.ts, apps/docs/src/data/realDemoAdapters.ts, apps/docs/src/generated/noctra-component-registry.generated.ts, apps/docs/src/generated/noctra-professional-docs.generated.ts, apps/docs/src/pages/ArchitecturePage.tsx, apps/docs/src/pages/ComponentDetailPage.tsx, apps/docs/src/pages/GettingStartedPage.tsx, apps/docs/src/pages/QualityPage.tsx, apps/docs/src/pages/ReleasePage.tsx, apps/docs/src/smoke/subpath-imports.tsx

## Applied

- Force replaced all remaining docs-side @noctra/react module specifiers.
- Regenerated safe preview runtime exports.
- Left package source untouched.
