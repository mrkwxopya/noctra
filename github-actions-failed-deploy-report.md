# GitHub Actions Failed Deploy Report

Generated: 2026-05-07T13:07:11.0282829Z

Run ID: 25497442757
Workflow: Deploy Noctra Docs
Status: completed
Conclusion: failure
Branch: main
SHA: 3aeeea42b7f74833ee94c404a45a0b86f50f96b9
URL: https://github.com/mrkwxopya/noctra/actions/runs/25497442757

Summary file: github-actions-failed-deploy-summary.json
Failed log file: github-actions-failed-deploy-log.txt

## First failed log lines

Build docs	Setup pnpm	﻿2026-05-07T13:02:37.4285221Z ##[group]Run pnpm/action-setup@v4
Build docs	Setup pnpm	2026-05-07T13:02:37.4286172Z with:
Build docs	Setup pnpm	2026-05-07T13:02:37.4286823Z   version: 10.33.2
Build docs	Setup pnpm	2026-05-07T13:02:37.4287548Z   run_install: false
Build docs	Setup pnpm	2026-05-07T13:02:37.4288296Z   dest: ~/setup-pnpm
Build docs	Setup pnpm	2026-05-07T13:02:37.4289041Z   cache: false
Build docs	Setup pnpm	2026-05-07T13:02:37.4289794Z   cache_dependency_path: pnpm-lock.yaml
Build docs	Setup pnpm	2026-05-07T13:02:37.4290930Z   package_json_file: package.json
Build docs	Setup pnpm	2026-05-07T13:02:37.4291826Z   standalone: false
Build docs	Setup pnpm	2026-05-07T13:02:37.4292536Z env:
Build docs	Setup pnpm	2026-05-07T13:02:37.4293216Z   GITHUB_PAGES_BASE: /noctra/
Build docs	Setup pnpm	2026-05-07T13:02:37.4294063Z   NODE_ENV: production
Build docs	Setup pnpm	2026-05-07T13:02:37.4294821Z ##[endgroup]
Build docs	Setup pnpm	2026-05-07T13:02:37.5715437Z ##[group]Running self-installer...
Build docs	Setup pnpm	2026-05-07T13:02:37.5785147Z Error: Multiple versions of pnpm specified:
Build docs	Setup pnpm	2026-05-07T13:02:37.5786620Z   - version 10.33.2 in the GitHub Action config with the key "version"
Build docs	Setup pnpm	2026-05-07T13:02:37.5788437Z   - version pnpm@9.15.0 in the package.json with the key "packageManager"
Build docs	Setup pnpm	2026-05-07T13:02:37.5790615Z Remove one of these versions to avoid version mismatch errors like ERR_PNPM_BAD_PM_VERSION
Build docs	Setup pnpm	2026-05-07T13:02:37.5792681Z     at readTarget (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:7537)
Build docs	Setup pnpm	2026-05-07T13:02:37.5794696Z     at runSelfInstaller (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:6702)
Build docs	Setup pnpm	2026-05-07T13:02:37.5796709Z     at async install (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:5706)
Build docs	Setup pnpm	2026-05-07T13:02:37.5798682Z     at async runMain (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:2804)
Build docs	Setup pnpm	2026-05-07T13:02:37.5801036Z     at async main (/home/runner/work/_actions/pnpm/action-setup/v4/dist/index.js:1:2726)
Build docs	Setup pnpm	2026-05-07T13:02:37.5831962Z ##[error]Error: Multiple versions of pnpm specified:
Build docs	Setup pnpm	  - version 10.33.2 in the GitHub Action config with the key "version"
Build docs	Setup pnpm	  - version pnpm@9.15.0 in the package.json with the key "packageManager"
Build docs	Setup pnpm	Remove one of these versions to avoid version mismatch errors like ERR_PNPM_BAD_PM_VERSION
