# Docs Routing Duplicate Import Fix Report

Generated: 2026-05-07T12:21:02+03:00

## Fixed

- Removed duplicate docsHref imports from pps/docs/src/main.tsx
- Normalized all docsRouting imports in pps/docs/src
- Preserved required clean-path helpers:
  - canonicalizeDocsCleanRoute
  - docsHref
  - orceNoctraDocsHref
  - isInternalDocsUrl
  - parseDocsRouteFromLocation
  - sanitizeDocsAnchors
