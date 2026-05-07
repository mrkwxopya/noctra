# Docs Routing Recursion Fix Report

Generated: 2026-05-07T17:33:12.934Z

Changed: yes
Problems found: 0

## Root cause

- docsHref called cleanDocsPath.
- cleanDocsPath called docsHref('/') inside startsWith().
- This created an immediate infinite recursion before any page could render.

## Problems

- None

## Applied

- Replaced docsRouting.ts with pure one-way path helpers.
- cleanDocsPath no longer calls docsHref.
- docsHref is now the only function that adds /noctra.
- Hash sanitizer and anchor rewrite now use non-recursive clean path logic.
- Added compatibility aliases for existing imports.
