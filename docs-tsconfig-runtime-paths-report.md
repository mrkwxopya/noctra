# Docs TypeScript Runtime Paths Report

Generated: 2026-05-07T17:13:51.601Z

tsconfig changed: yes
Problems found: 0

## Added paths

- @noctra/react -> NoctraRuntimeMock.tsx
- @noctra/react/* -> NoctraRuntimeMock.tsx
- @noctra/tokens -> NoctraTokensMock.ts
- @noctra/tokens/* -> NoctraTokensMock.ts

## Problems

- None

## Applied

- Added TypeScript path aliases for docs runtime mocks.
- Added docs-only token mock for @noctra/tokens.
- This fixes CI tsc resolution; Vite alias still handles runtime bundling.
