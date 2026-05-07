# Latest GitHub Pages Deploy Check By Workflow File Report

Generated: 2026-05-07T15:59:29.5688569Z

Decision: PASS_DEPLOY_RUNTIME_READY_FOR_BROWSER_CHECK
Selected workflow file: docs-pages.yml
Selected workflow name: Deploy Noctra Docs
Latest run id: 25506993200
Latest status: completed
Latest conclusion: success
Latest title: Generate lightweight docs sidebar links from components
Latest run URL: https://github.com/mrkwxopya/noctra/actions/runs/25506993200
Run head SHA: 59cff68f0ae5fc5fb07546a74ce92291414444b8
Local HEAD: 59cff68f0ae5fc5fb07546a74ce92291414444b8
Remote HEAD: 59cff68f0ae5fc5fb07546a74ce92291414444b8
Remote matches local: True

## Workflow list

```text
Deploy Noctra Docs	active	272370582
Deploy Noctra Docs	active	272658400
```

## Recent candidate runs

- docs-pages.yml :: completed / success :: Generate lightweight docs sidebar links from components :: 2026-05-07T15:56:44.0000000Z :: https://github.com/mrkwxopya/noctra/actions/runs/25506993200
- docs.yml :: completed / cancelled :: Generate lightweight docs sidebar links from components :: 2026-05-07T15:56:44.0000000Z :: https://github.com/mrkwxopya/noctra/actions/runs/25506993214
- docs-pages.yml :: completed / success :: Fix interactive demo presets includes and has typing :: 2026-05-07T15:49:23.0000000Z :: https://github.com/mrkwxopya/noctra/actions/runs/25506605301
- docs.yml :: completed / cancelled :: Fix interactive demo presets includes and has typing :: 2026-05-07T15:49:23.0000000Z :: https://github.com/mrkwxopya/noctra/actions/runs/25506605293
- docs-pages.yml :: completed / cancelled :: Make package integrity audit pnpm workspace aware :: 2026-05-07T15:36:43.0000000Z :: https://github.com/mrkwxopya/noctra/actions/runs/25505915245
- docs.yml :: completed / failure :: Make package integrity audit pnpm workspace aware :: 2026-05-07T15:36:43.0000000Z :: https://github.com/mrkwxopya/noctra/actions/runs/25505915270

## Source problems

- None

## Manual browser check if PASS

- Open: https://mrkwxopya.github.io/noctra/components/button
- Hard refresh with Ctrl+F5.
- Console should NOT show Maximum call stack size exceeded.
- Left sidebar should list Docs links and Components.
- Component URL should stay clean.
- Architecture should open /noctra/architecture, not #/architecture.
