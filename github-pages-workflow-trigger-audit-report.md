# GitHub Pages Workflow Trigger Audit Report

Generated: 2026-05-07T15:30:38.1135611Z

Branch: main
HEAD: 0577aefb8c0a7e7e803e191b9f4918c1e526037a
Last commit: 0577aef Fix docs catalog clean link import
Workflow files found: 0
GitHub CLI available: True
Problems found: 1

## Workflow checks


## Last commit changed files

- apps/docs/src/data/docsCatalog.ts
- docscatalog-docshref-import-report.md
- safety-backups/DocsChrome.pre-final-hash-cleanup-20260507-182255.tsx
- safety-backups/NoctraMantineDocs.pre-left-nav-clean-links-20260507-181937.tsx
- safety-backups/apps_docs_src_components_DocsChrome_tsx.pre-left-nav-clean-links-repair-20260507-182058.bak
- safety-backups/apps_docs_src_components_docs-system_NoctraMantineDocs_tsx.pre-left-nav-clean-links-repair-20260507-182058.bak
- safety-backups/apps_docs_src_docs_css.pre-left-nav-clean-links-repair-20260507-182058.bak
- safety-backups/apps_docs_src_lib_docsRouting_ts.pre-left-nav-clean-links-repair-20260507-182058.bak
- safety-backups/apps_docs_src_main_tsx.pre-left-nav-clean-links-repair-20260507-182058.bak
- safety-backups/docs.pre-left-nav-clean-links-20260507-181937.css
- safety-backups/docsCatalog.pre-docshref-import-20260507-182443.ts
- safety-backups/docsRouting.pre-left-nav-clean-links-20260507-181937.ts
- safety-backups/main.pre-left-nav-clean-links-20260507-181937.tsx
- scripts/patch-docscatalog-docshref-import.mjs

## GitHub run list

`	ext
completed	cancelled	Fix docs catalog clean link import	Deploy Noctra Docs	main	push	25505265045	2s	2026-05-07T15:25:02Z
completed	success	Fix docs catalog clean link import	Deploy Noctra Docs	main	push	25505264663	1m5s	2026-05-07T15:25:02Z
completed	failure	Reset docs shell to Mantine-like desktop layout	Deploy Noctra Docs	main	push	25504503384	23s	2026-05-07T15:11:15Z
completed	cancelled	Reset docs shell to Mantine-like desktop layout	Deploy Noctra Docs	main	push	25504502756	3s	2026-05-07T15:11:14Z
completed	cancelled	Clean Mantine-like docs card-heavy classes	Deploy Noctra Docs	main	push	25503475356	3s	2026-05-07T14:53:07Z
completed	failure	Clean Mantine-like docs card-heavy classes	Deploy Noctra Docs	main	push	25503475304	18s	2026-05-07T14:53:07Z
completed	failure	Fix Noctra docs system visual layout	Deploy Noctra Docs	main	push	25502913386	19s	2026-05-07T14:43:01Z
completed	cancelled	Fix Noctra docs system visual layout	Deploy Noctra Docs	main	push	25502913378	3s	2026-05-07T14:43:01Z
`",
  ",
  

- No workflow file found under .github/workflows.

## Interpretation

- Eğer workflow gri/skipped görünüyorsa genelde trigger, paths filter veya job-level if koşulu çalışmamıştır.
- Eğer push görünmüyorsa workflow dosyasında push/main tetikleyicisi eksiktir.
- Eğer run list boşsa GitHub tarafı workflow'u hiç başlatmamıştır.
- Bir sonraki adımda workflow'u push + manual trigger garantili hale getireceğiz.
