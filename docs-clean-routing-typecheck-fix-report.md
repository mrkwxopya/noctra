# Docs Clean Routing Typecheck Fix Report

Generated: 2026-05-07T05:40:19+03:00

## Fixed

- Removed accidental docsHref usage from src/data/*
- Rewrote docsRouting.ts with safe import.meta typing
- Added pps/docs/src/vite-env.d.ts
- Updated patch-docs-clean-path-links.mjs so it no longer patches src/data or src/generated
- Preserved clean path routing:
  - /noctra/
  - /noctra/components/container
  - /noctra/release

## Reason

The previous clean path patch touched data files too broadly and injected/used docsHref where it should not exist.