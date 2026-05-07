# Commit Missing Left Nav Clean Links Report

Generated: 2026-05-07T15:32:47.6439022Z

Decision: PASS_MISSING_LEFT_NAV_COMMITTED_AND_PUSHED
Local HEAD: 9b7a8391894b6a14cafae69979d0bd0275754d57
Remote HEAD: 9b7a8391894b6a14cafae69979d0bd0275754d57
Remote matches local: True
Push exit code: 0

## Git status before

```text
M apps/docs/src/components/DocsChrome.tsx
 M apps/docs/src/components/docs-system/NoctraMantineDocs.tsx
 M apps/docs/src/data/componentExamples.tsx
 M apps/docs/src/docs.css
 M apps/docs/src/generated/noctra-professional-docs.generated.ts
 M apps/docs/src/lib/docsRouting.ts
 M apps/docs/src/main.tsx
 M date-time-removal-state-report.md
 M packages/react/src/components/Stepper/Stepper.tsx
 M professional-docs-data-generation-report.md
 M scripts/audit-docs-real-runtime-render.mjs
 M scripts/generate-professional-docs-data.mjs
?? apps/docs/.tmp-docs-runtime/
?? build-diagnostics-summary.md
?? button-noctra-docs-system-preview-report.md
?? button-reference-local-preview-report.md
?? button-reference-rework-preview-report.md
?? button-runtime-adapter-fresh-preview-report.md
?? docs-clean-path-routing-audit-report.md
?? docs-hard-base-url-audit-report.md
?? docs-routing-duplicate-import-fix-report.md
?? docs-shell-reset-preview-report.md
?? docs-shell-structure-audit-report.md
?? docs-url-and-mantine-style-report.md
?? docschrome-final-hash-cleanup-report.md
?? final-docs-forbidden-text-cleanup-report.md
?? git-push-verify-report.md
?? github-actions-failed-deploy-log.txt
?? github-actions-failed-deploy-report.md
?? github-actions-failed-deploy-summary.json
?? github-pages-workflow-trigger-audit-report.md
?? left-nav-clean-links-push-verify-report.md
?? left-nav-clean-links-repair-report.md
?? left-nav-clean-links-report.md
?? mantine-desktop-structure-preview-report.md
?? mantine-desktop-structure-restore-report.md
?? mantine-like-docs-preview-report.md
?? noctra-docs-visual-layout-preview-report.md
?? package-json-integrity-report.md
?? safe-date-time-removal-report.md
?? scripts/audit-button-noctra-docs-system-migration.mjs
?? scripts/audit-button-page-density-fix.mjs
?? scripts/audit-component-example-coverage.mjs
?? scripts/audit-component-runtime-smoke.mjs
?? scripts/audit-date-time-removal-state.mjs
?? scripts/audit-docs-clean-path-routing.mjs
?? scripts/audit-docs-final-dist-url.mjs
?? scripts/audit-docs-imports-clean.mjs
?? scripts/audit-docs-mantine-style-requirements.mjs
?? scripts/audit-final-noctra-docs-release.mjs
?? scripts/audit-hard-docs-base-url.mjs
?? scripts/audit-interactive-demo-engine-sync.mjs
?? scripts/audit-interactive-demo-preset-api-compat.mjs
?? scripts/audit-interactive-demo-presets-syntax.mjs
?? scripts/audit-noctra-ui-docs-foundation.mjs
?? scripts/audit-package-json-integrity.mjs
?? scripts/audit-removed-date-time-components.mjs
?? scripts/audit-url-and-mantine-style-docs.mjs
?? scripts/clean-date-time-exports-targeted.mjs
?? scripts/cleanup-docschrome-final-hash-fragments.mjs
?? scripts/finalize-date-time-component-removal.mjs
?? scripts/fix-button-docs-system-typecheck.mjs
?? scripts/fix-button-state-examples-type.mjs
?? scripts/fix-docs-import-audit-false-positive.mjs
?? scripts/fix-docs-routing-duplicate-imports.mjs
?? scripts/hard-fix-docs-base-links.mjs
?? scripts/patch-button-page-density-fix.mjs
?? scripts/patch-final-docs-forbidden-text.mjs
?? scripts/patch-interactive-demo-preset-api-compat.mjs
?? scripts/patch-left-nav-clean-links.mjs
?? scripts/patch-mantine-style-docs-safe.mjs
?? scripts/patch-real-isolated-playground.mjs
?? scripts/patch-remove-docs-coverage-section.mjs
?? scripts/patch-runtime-failing-safe-presets.mjs
?? scripts/remove-date-time-css-imports.mjs
?? scripts/remove-date-time-input-components.mjs
?? scripts/repair-docs-import-blocks.mjs
?? scripts/repair-interactive-demo-presets.mjs
?? scripts/repair-left-nav-clean-links.mjs
?? scripts/restore-mantine-desktop-structure.mjs
?? scripts/safe-remove-date-time-components.mjs
?? stabilized-docs-system-preview-report.md
```

## Git status after add

```text
M  apps/docs/src/components/DocsChrome.tsx
M  apps/docs/src/components/docs-system/NoctraMantineDocs.tsx
 M apps/docs/src/data/componentExamples.tsx
M  apps/docs/src/docs.css
 M apps/docs/src/generated/noctra-professional-docs.generated.ts
M  apps/docs/src/lib/docsRouting.ts
M  apps/docs/src/main.tsx
 M date-time-removal-state-report.md
A  docschrome-final-hash-cleanup-report.md
A  left-nav-clean-links-repair-report.md
A  left-nav-clean-links-report.md
 M packages/react/src/components/Stepper/Stepper.tsx
 M professional-docs-data-generation-report.md
 M scripts/audit-docs-real-runtime-render.mjs
 M scripts/generate-professional-docs-data.mjs
?? apps/docs/.tmp-docs-runtime/
?? build-diagnostics-summary.md
?? button-noctra-docs-system-preview-report.md
?? button-reference-local-preview-report.md
?? button-reference-rework-preview-report.md
?? button-runtime-adapter-fresh-preview-report.md
?? docs-clean-path-routing-audit-report.md
?? docs-hard-base-url-audit-report.md
?? docs-routing-duplicate-import-fix-report.md
?? docs-shell-reset-preview-report.md
?? docs-shell-structure-audit-report.md
?? docs-url-and-mantine-style-report.md
?? final-docs-forbidden-text-cleanup-report.md
?? git-push-verify-report.md
?? github-actions-failed-deploy-log.txt
?? github-actions-failed-deploy-report.md
?? github-actions-failed-deploy-summary.json
?? github-pages-workflow-trigger-audit-report.md
?? left-nav-clean-links-push-verify-report.md
?? mantine-desktop-structure-preview-report.md
?? mantine-desktop-structure-restore-report.md
?? mantine-like-docs-preview-report.md
?? noctra-docs-visual-layout-preview-report.md
?? package-json-integrity-report.md
?? safe-date-time-removal-report.md
?? scripts/audit-button-noctra-docs-system-migration.mjs
?? scripts/audit-button-page-density-fix.mjs
?? scripts/audit-component-example-coverage.mjs
?? scripts/audit-component-runtime-smoke.mjs
?? scripts/audit-date-time-removal-state.mjs
?? scripts/audit-docs-clean-path-routing.mjs
?? scripts/audit-docs-final-dist-url.mjs
?? scripts/audit-docs-imports-clean.mjs
?? scripts/audit-docs-mantine-style-requirements.mjs
?? scripts/audit-final-noctra-docs-release.mjs
?? scripts/audit-hard-docs-base-url.mjs
?? scripts/audit-interactive-demo-engine-sync.mjs
?? scripts/audit-interactive-demo-preset-api-compat.mjs
?? scripts/audit-interactive-demo-presets-syntax.mjs
?? scripts/audit-noctra-ui-docs-foundation.mjs
?? scripts/audit-package-json-integrity.mjs
?? scripts/audit-removed-date-time-components.mjs
?? scripts/audit-url-and-mantine-style-docs.mjs
?? scripts/clean-date-time-exports-targeted.mjs
?? scripts/cleanup-docschrome-final-hash-fragments.mjs
?? scripts/finalize-date-time-component-removal.mjs
?? scripts/fix-button-docs-system-typecheck.mjs
?? scripts/fix-button-state-examples-type.mjs
?? scripts/fix-docs-import-audit-false-positive.mjs
?? scripts/fix-docs-routing-duplicate-imports.mjs
?? scripts/hard-fix-docs-base-links.mjs
?? scripts/patch-button-page-density-fix.mjs
?? scripts/patch-final-docs-forbidden-text.mjs
?? scripts/patch-interactive-demo-preset-api-compat.mjs
?? scripts/patch-left-nav-clean-links.mjs
?? scripts/patch-mantine-style-docs-safe.mjs
?? scripts/patch-real-isolated-playground.mjs
?? scripts/patch-remove-docs-coverage-section.mjs
?? scripts/patch-runtime-failing-safe-presets.mjs
?? scripts/remove-date-time-css-imports.mjs
?? scripts/remove-date-time-input-components.mjs
?? scripts/repair-docs-import-blocks.mjs
?? scripts/repair-interactive-demo-presets.mjs
?? scripts/repair-left-nav-clean-links.mjs
?? scripts/restore-mantine-desktop-structure.mjs
?? scripts/safe-remove-date-time-components.mjs
?? stabilized-docs-system-preview-report.md
```

## Push output

```text
branch 'main' set up to track 'origin/main'.
To https://github.com/mrkwxopya/noctra.git
   0577aef..9b7a839  main -> main
```
