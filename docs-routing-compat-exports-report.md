# Docs Routing Compatibility Exports Report

Generated: 2026-05-07T17:34:11.836Z

Changed: yes
Problems found: 0

## Restored compatibility exports

- canonicalizeDocsCleanRoute
- parseDocsRouteFromLocation
- sanitizeDocsAnchors

## Problems

- None

## Applied

- Added compatibility aliases expected by main.tsx.
- Kept cleanDocsPath one-way and non-recursive.
- Did not reintroduce docsHref inside cleanDocsPath.
