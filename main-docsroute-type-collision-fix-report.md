# main.tsx DocsRoute Type Collision Fix Report

Generated: 2026-05-07T16:22:12.806Z

Changed: yes
Bad route type hits before: 1
Bad route type hits after: 0
Problems found: 0

## Hits before

- 48: function parseRoute(): { route: typeof DocsRoute; componentSlug?: string } {

## Hits after

- None

## Problems

- None

## Applied

- Kept DocsRoute as a component export.
- Restored route id type to string.
- Removed invalid route: typeof DocsRoute typing.
