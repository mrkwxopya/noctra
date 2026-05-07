# Noctra Publish Checklist

Generated: 2026-05-07T01:38:12.216Z

## Required Before Publishing

- [ ] Confirm `pnpm install` completed successfully.
- [ ] Confirm `pnpm --filter @noctra/utils build` passed.
- [ ] Confirm `pnpm --filter @noctra/tokens build` passed.
- [ ] Confirm `pnpm --filter @noctra/react build` passed.
- [ ] Confirm `pnpm --filter @noctra/styles build` passed.
- [ ] Confirm `pnpm --filter @noctra/docs typecheck` passed.
- [ ] Confirm `pnpm --filter @noctra/docs build` passed.
- [ ] Confirm `pnpm typecheck` passed.
- [ ] Confirm `pnpm build` passed.
- [ ] Confirm `node scripts/verify-exports.mjs` passed.
- [ ] Confirm `node scripts/final-quality-gate.mjs` passed.
- [ ] Inspect `component-inventory-audit-report.md`.
- [ ] Inspect `docs-component-usage-audit-report.md`.
- [ ] Inspect `component-prop-conflict-audit-report.md`.
- [ ] Inspect `workspace-dependency-boundary-audit-report.md`.
- [ ] Inspect `release-metadata-audit-report.md`.
- [ ] Inspect `package-entry-point-audit-report.md`.
- [ ] Inspect `dist-artifact-audit-report.md`.
- [ ] Inspect `npm-pack-dry-run-audit-report.md`.
- [ ] Inspect `noctra-release-candidate-manifest.md`.
- [ ] Inspect `RELEASE_NOTES.md`.

## Publishable Package Order

1. @noctra/react@0.0.0-alpha.0
2. @noctra/styles@0.0.0-alpha.0
3. @noctra/tokens@0.0.0-alpha.0
4. @noctra/utils@0.0.0-alpha.0

## Safe Publish Commands

```powershell
# Only run after the checklist is complete.
pnpm --filter @noctra/react publish --access public --no-git-checks
pnpm --filter @noctra/styles publish --access public --no-git-checks
pnpm --filter @noctra/tokens publish --access public --no-git-checks
pnpm --filter @noctra/utils publish --access public --no-git-checks
```

## Safety Notes

- Do not publish if any build or typecheck command fails.
- Do not publish if npm pack dry-run reports missing package files.
- Do not publish if package entry point audit reports missing concrete files.
- Do not publish if the final quality gate reports unresolved blockers.
## Professional Docs Checks

- [ ] Confirm 
ode scripts/generate-professional-docs-data.mjs passed.
- [ ] Confirm 
ode scripts/audit-professional-docs.mjs passed.
- [ ] Inspect professional-docs-audit-report.md.
- [ ] Confirm FINAL_DOCS_RELEASE_DECISION.md says PASS_FINAL_DOCS_RELEASE_GATE.