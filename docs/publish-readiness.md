# Publish Readiness

Noctra packages are prepared for alpha publishing.

## Packages prepared

- `@noctra/react`
- `@noctra/styles`
- `@noctra/tokens`
- `@noctra/utils`

## Current version

```text
0.0.0-alpha.0
````

## Publish checks

Run before publishing:

```powershell
pnpm install
pnpm typecheck
pnpm build
node scripts/verify-exports.mjs
pnpm --filter @noctra/docs build
```

## Important

The package scope `@noctra` must exist on npm before publishing scoped packages.

If the npm scope is not available, rename packages before publishing.