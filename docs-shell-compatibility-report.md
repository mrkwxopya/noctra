# DocsShell Compatibility Report

Generated: 2026-05-07T12:55:59+03:00

## Fixed

- Removed unsafe prop.values access from MantineStyleComponentDocs.tsx
- Extracted literal values from prop.type instead
- Added compatibility exports to DocsShell.tsx:
  - PageIntro
  - DocsSection
  - InfoCard
  - HeroCard
  - CodePanel
- Moved pps/docs/src/main.before-professional-docs.tsx out of src so it does not enter TypeScript typecheck