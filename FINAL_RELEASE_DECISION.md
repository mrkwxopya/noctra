# Noctra Final Release Decision

Generated: 2026-05-07T02:01:14.858Z

Decision: PASS_FINAL_HARD_GATE

## Summary

- Publishable packages: 4
- Components: 119
- Critical reports: 8
- Optional reports: 5
- Blockers: 0
- Critical report problems: 0
- Critical report warnings: 0
- Missing dist roots: 0

## Blockers

- None

## Publishable Packages

| Package | Version | Path | Exports | Files | Access |
|---|---|---|---:|---:|---|
| @noctra/react | 0.0.0-alpha.0 | packages/react | 122 | 3 | public |
| @noctra/styles | 0.0.0-alpha.0 | packages/styles | 133 | 4 | public |
| @noctra/tokens | 0.0.0-alpha.0 | packages/tokens | 1 | 3 | public |
| @noctra/utils | 0.0.0-alpha.0 | packages/utils | 1 | 3 | public |

## Dist Matrix

| Root | Exists | Files | Bytes | JS | Types | CSS |
|---|---|---:|---:|---|---|---|
| packages/react/dist | OK | 1948 | 2167888 | OK | OK | MISSING |
| packages/styles/dist | OK | 8 | 89436 | OK | OK | MISSING |
| packages/tokens/dist | OK | 516 | 295133 | OK | OK | MISSING |
| packages/utils/dist | OK | 12 | 2954 | OK | OK | MISSING |
| apps/docs/dist | OK | 3 | 614930 | OK | MISSING | OK |

## Critical Reports

| Report | Problems | Warnings | Changes | SHA256 |
|---|---:|---:|---:|---|
| component-inventory-audit-report.md | 0 | 0 | 0 | 6e60ee1affd3584e8ffba2c5645450c2dac50460fb4525a0e2ca6afdab32c246 |
| component-prop-conflict-audit-report.md | 0 | 0 | 0 | ab7184b7eb74880fee56271a98395b0c1f1a826d9cca168cf7ea718ecb7b756f |
| workspace-dependency-boundary-audit-report.md | 0 | 0 | 0 | e65307d17140ecd41e8d4ec4acd4b43d8ed46c277723a02207f4f56baf484bb2 |
| release-metadata-audit-report.md | 0 | 0 | 0 | 433c055e104e7f731f3c6a9146cfd4982b235eafa8c7fb307c04ad294dd7453d |
| package-entry-point-audit-report.md | 0 | 0 | 0 | 7fd4d34acc63df53f19701bb178d20528b296d8913e77ce6bc05c658b868267d |
| dist-artifact-audit-report.md | 0 | 0 | 0 | 236242cb5830dc5f661bf03ea1d2d303367511b9e71e16d4546e7826aa0c82a0 |
| npm-pack-dry-run-audit-report.md | 0 | 0 | 0 | 190d323775208968e015e077000e0f269b9b8f99c6126fe429bd7ee91ae33c17 |
| final-release-readiness-snapshot-report.md | 0 | 0 | 0 | 747bd8e2342b8f03c5073e3ed4a0e11b5dfbc44ab07ad57c3a4199f8084ffb52 |

## Required File Hashes

| File | SHA256 |
|---|---|
| package.json | 4eac56161501b3113895c9ecd47aae8ade7ccf3dd3f6a27336215d92b4d4c90a |
| pnpm-lock.yaml | f6655c460fd55af32ceabd29d0ecab7a99cccacf1be9f4a111acc103bb2a34ba |
| pnpm-workspace.yaml | 9250753e34f84fffb69d1b040530c6daa564fad994ec8366d2d767801aaaf547 |
| README.md | d88a44e54fbe193c789edfb5a9cd102c24405b1cf9c7311641713a13442fa1cd |
| CHANGELOG.md | 12b6686efda17890fe2ffd469dbc52628c8d561acf4a0f5f6707a5bc217ddf5c |
| RELEASE_NOTES.md | 865e6b3958adf6348b89d47e911031a123f4b390b882a004f1d7b17a9133de8f |
| PUBLISH_CHECKLIST.md | 4edfcd8d70766be61bc3600d003e88409a12fdd344521de37bc98817c20769df |
| final-quality-gate-report.md | 8bea5f5c8c4a668c226780ee9fbc6cdaa60e3474cc7917b45719a4b98349a20e |
| component-inventory-audit-report.md | 6e60ee1affd3584e8ffba2c5645450c2dac50460fb4525a0e2ca6afdab32c246 |
| component-prop-conflict-audit-report.md | ab7184b7eb74880fee56271a98395b0c1f1a826d9cca168cf7ea718ecb7b756f |
| workspace-dependency-boundary-audit-report.md | e65307d17140ecd41e8d4ec4acd4b43d8ed46c277723a02207f4f56baf484bb2 |
| release-metadata-audit-report.md | 433c055e104e7f731f3c6a9146cfd4982b235eafa8c7fb307c04ad294dd7453d |
| package-entry-point-audit-report.md | 7fd4d34acc63df53f19701bb178d20528b296d8913e77ce6bc05c658b868267d |
| dist-artifact-audit-report.md | 236242cb5830dc5f661bf03ea1d2d303367511b9e71e16d4546e7826aa0c82a0 |
| npm-pack-dry-run-audit-report.md | 190d323775208968e015e077000e0f269b9b8f99c6126fe429bd7ee91ae33c17 |
| noctra-release-candidate-manifest.json | 15e8aa4dd4775de78b115c7d864d9c5ba09d70503f0aecc030fcce1e2ddebf71 |
| noctra-release-candidate-manifest.md | d97fe744692aa2aefcf7995504d0218548ef1f074a7c05347c8b78fc03764590 |
| FINAL_RELEASE_READINESS_SNAPSHOT.json | f34c3e1671cc907674cdbd5f2571759a32d6f3c7ff3f07ce09a59317de31d283 |
| FINAL_RELEASE_READINESS_SNAPSHOT.md | d12e5080df8e2cb8765687063810e72b3a0a90cc5c4170ddc6ce96b57b0b03e0 |

## Final Note

- This step does not publish, tag, commit, or push.
- If the decision is PASS_FINAL_HARD_GATE, use PUBLISH_CHECKLIST.md before publishing.
- If the decision is BLOCKED_FINAL_HARD_GATE, fix blockers first and rerun this step.
