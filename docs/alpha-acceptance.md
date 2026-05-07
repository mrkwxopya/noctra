# Alpha Acceptance Criteria

Noctra alpha foundation is accepted when these checks pass:

## Build

- pnpm install
- pnpm typecheck
- pnpm build
- pnpm --filter @noctra/docs build
- node scripts/verify-exports.mjs
- node scripts/final-quality-gate.mjs

## Required outputs

- apps/docs/dist/index.html
- packages/react/dist/index.js
- packages/react/dist/index.d.ts
- packages/styles/dist/index.js
- packages/styles/dist/index.d.ts
- packages/tokens/dist/index.js
- packages/tokens/dist/index.d.ts
- packages/utils/dist/index.js
- packages/utils/dist/index.d.ts
- final-quality-gate-report.md

## Required documentation

- README.md
- CHANGELOG.md
- LICENSE
- docs/installation.md
- docs/theming.md
- docs/component-contract.md
- docs/foundation-summary.md
- docs/publish-readiness.md
- docs/next-phase-roadmap.md
- NOCTRA_ALPHA_FOUNDATION_SUMMARY.md

## Required package state

- package exports exist
- subpath exports exist for React components
- CSS partial exports exist
- package metadata is alpha-ready
- package README files exist
- package LICENSE files exist