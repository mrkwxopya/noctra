# Noctra Workspace Dependency Boundary Audit

Generated: 2026-05-07T01:38:11.586Z

Package files scanned: 6
Dependency edges scanned: 16
Problems found: 0
Warnings found: 0
Duplicate external version groups: 2

## Dependency Matrix

| Package | package.json | Field | Dependency | Version | Workspace package | Workspace protocol |
|---|---|---|---|---|---|---|
| @noctra/docs | apps/docs/package.json | dependencies | @noctra/react | workspace:* | YES | YES |
| @noctra/docs | apps/docs/package.json | dependencies | @noctra/styles | workspace:* | YES | YES |
| @noctra/docs | apps/docs/package.json | dependencies | @noctra/tokens | workspace:* | YES | YES |
| @noctra/docs | apps/docs/package.json | dependencies | @vitejs/plugin-react | ^4.3.4 | NO | NO |
| @noctra/docs | apps/docs/package.json | dependencies | react | ^19.0.0 | NO | NO |
| @noctra/docs | apps/docs/package.json | dependencies | react-dom | ^19.0.0 | NO | NO |
| @noctra/docs | apps/docs/package.json | dependencies | vite | ^6.0.3 | NO | NO |
| @noctra/docs | apps/docs/package.json | devDependencies | @types/react | ^19.0.2 | NO | NO |
| @noctra/docs | apps/docs/package.json | devDependencies | @types/react-dom | ^19.0.2 | NO | NO |
| noctra | package.json | devDependencies | @types/node | ^22.10.2 | NO | NO |
| noctra | package.json | devDependencies | typescript | ^5.7.2 | NO | NO |
| @noctra/react | packages/react/package.json | dependencies | @noctra/utils | workspace:* | YES | YES |
| @noctra/react | packages/react/package.json | devDependencies | @types/react | ^19.0.2 | NO | NO |
| @noctra/react | packages/react/package.json | devDependencies | @types/react-dom | ^19.0.2 | NO | NO |
| @noctra/react | packages/react/package.json | peerDependencies | react | >=18 | NO | NO |
| @noctra/react | packages/react/package.json | peerDependencies | react-dom | >=18 | NO | NO |

## Problems

- None

## Warnings

- None

## Duplicate External Dependency Versions

- react: ^19.0.0, >=18
- react-dom: ^19.0.0, >=18

## Note

- This audit does not automatically fail on warnings.
- Build, typecheck, verify-exports, and final-quality-gate remain the source of truth.
- Workspace package dependencies should use workspace:* to avoid accidentally resolving a published package.
