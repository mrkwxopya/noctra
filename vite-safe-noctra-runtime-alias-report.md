# Vite Safe Noctra Runtime Alias Report

Generated: 2026-05-07T16:56:18.549Z

Vite config: apps/docs/vite.config.ts
Changed: no
Problems found: 1

## Problems

- Vite config missing @noctra/react subpath regex.

## Applied

- Added Vite pre-resolve plugin.
- Forced @noctra/react to NoctraRuntimeMock.tsx.
- Forced @noctra/react/* subpaths to NoctraRuntimeMock.tsx.
- This catches static imports, subpath imports, and dynamic import resolution in docs.
