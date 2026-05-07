# Final Professional Docs Release Decision

Generated: 2026-05-07T02:01:14.753Z

Decision: PASS_FINAL_DOCS_RELEASE_GATE

## Summary

- Audit problems: 0
- Audit warnings: 0
- Generated components: 119
- Generated props: 2786
- Generated tokens: 1661
- Curated examples: 34
- Prop descriptions: 108
- Docs dist files: 3
- Docs dist bytes: 614930

## Blockers

- None

## Warnings

- None

## Dist Samples

- apps/docs/dist/assets/index-Bzuwqdnb.css
- apps/docs/dist/assets/index-j8YKOYT1.js
- apps/docs/dist/index.html

## File Hashes

| File | SHA256 |
|---|---|
| apps/docs/src/main.tsx | e9c28786ac0842d763457c8e2a59621de220766b18d86f9e7097f4c5f77054e5 |
| apps/docs/src/docs.css | b747c8710becc3c0ceeb4fc43ffdda0acf8fcc6e787875e1e79b4e705d514a38 |
| apps/docs/src/components/DocsChrome.tsx | 672418e655c938f72b26a451643892c23821ae9bd156d0f07a94511b915b1dfc |
| apps/docs/src/pages/OverviewPage.tsx | 58e223c183eeb6a75eed0d8375d6e68aa824ba644ba647a2d0e0e379f30f5fd8 |
| apps/docs/src/pages/ComponentsPage.tsx | 2ce4245c888101d05857df263fee0ad083139779829c542f8f0fcbed31dc6f1e |
| apps/docs/src/pages/ComponentDetailPage.tsx | 3c5cc16fb9457574b8b0a0a85a5a7e343133c98864701545c92686d8ac93f316 |
| apps/docs/src/pages/ArchitecturePage.tsx | f1ed2f565f2d18886d2742b26e6bf804087c24c79d7c3df6a0185a5acc1595c4 |
| apps/docs/src/pages/ThemingPage.tsx | dbb5cc18caccda2eb3b0c422160801d636d9f88bf278389f429a868899cd20ce |
| apps/docs/src/pages/QualityPage.tsx | 8dce6260050e3022bf4cedb6fb9d94e7ed5a2798ed83ce7f01853aba95f8b129 |
| apps/docs/src/pages/ReleasePage.tsx | 4c962874a8590defb80459a00d8b8a94f566ccde997ef391230139cecf3b0961 |
| apps/docs/src/data/componentExamples.tsx | 4e911f62467ccb4087c6af7f2755104e30bb882942d78060ddba7a3c1d0d0a55 |
| apps/docs/src/data/propDescriptions.ts | 4756b5993db763a2e241ecf2a42c32dd865afa0399dfd58446586bf22fff1af8 |
| apps/docs/src/generated/noctra-professional-docs.generated.ts | c0e06040d5d4e64e38c97d64df4bb79a94fb0902349ebae1fbba04d6adb0c864 |
| professional-docs-audit-report.md | bfc55ebaa64602e4575aadb9a76437d6e1cb4c7d2eeb395632c2e70675e6e9c3 |
| professional-docs-data-generation-report.md | d7b2bc845c19b60dbae8696700b0e260c8d06beddb8da34f39c9e8e25d77720e |
| docs-typecheck-debug.log | d14f63ee551260745a3e658dc4777b46d3e041d4acdfff19cbc236d5caad9ad1 |
| docs-build-debug.log | 24d6c5bd8fccfd0584b9de0dd9c68e8c50a61bc4910b386e9c9b994d9bcb999b |

## Interpretation

- PASS_FINAL_DOCS_RELEASE_GATE means the professional docs structure, generated component docs, audit, typecheck, and build passed.
- Warnings are acceptable for alpha docs, but should be reduced before a stable public v1 documentation release.
- This step does not publish, commit, tag, or push.
