# Canonical Pages Workflow Report

Generated: 2026-05-07T17:09:46.545Z

Changed: yes
Problems found: 0

## Problems

- None

## Applied

- Replaced docs-pages.yml with one canonical Pages deploy workflow.
- Build job now always builds @noctra/docs from current HEAD.
- Upload artifact path is explicitly apps/docs/dist.
- Deploy job deploys exactly that uploaded artifact.
- Added noctra-deploy-info.json marker into the artifact.
- Removed hardcoded pnpm version to avoid packageManager conflicts.
