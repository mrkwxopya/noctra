# Lightweight Sidebar Links Report

Generated: 2026-05-07T15:51:48.510Z

Generated source used: none
Component links generated: 0
Changed files: 0
Problems found: 6

## Changed files

- None

## Problems

- Could not extract component links from generated docs files.
- NoctraMantineDocs.tsx still references noctraDocsComponents.
- NoctraMantineDocs.tsx still imports professional docs generated data.
- NoctraMantineDocs.tsx does not import docsSidebarLinks.
- docsSidebarLinks.ts missing docsComponentLinks.
- Expected many component links, extracted only 0. Source: none

## Applied

- Generated lightweight plain sidebar links.
- Removed heavy generated docs import from NoctraMantineDocs.
- Kept ncd2 shell layout.
- Avoided runtime circular generated docs graph in docs foundation.
