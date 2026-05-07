# Canonical Pages Artifact Live Verify Report

Generated: 2026-05-07T17:11:11.2616733Z

Decision: FAIL_CANONICAL_PAGES_ARTIFACT_NOT_LIVE
Workflow file: docs-pages.yml
Run id: 25510721951
Run status: completed
Run conclusion: failure
Run title: Deploy current docs dist artifact to Pages
Run URL: https://github.com/mrkwxopya/noctra/actions/runs/25510721951
Run SHA: d646329c55e28a2b106a326176bb164ba898c5d0
Local HEAD: d646329c55e28a2b106a326176bb164ba898c5d0
Remote HEAD: d646329c55e28a2b106a326176bb164ba898c5d0
Remote matches local: True

## Asset state

- Local asset src: /noctra/assets/index-Cm97Pnqq.js
- Local asset path: assets/index-Cm97Pnqq.js
- Remote index URL: https://mrkwxopya.github.io/noctra/?verify=20260507201110
- Remote index status: 200
- Remote index content-type: text/html; charset=utf-8
- Remote asset src: /noctra/assets/index-DnmXOM5f.js
- Remote asset path: assets/index-DnmXOM5f.js
- Remote asset URL: https://mrkwxopya.github.io/noctra/=20260507201110
- Remote asset downloaded: False
- Remote asset contains safe runtime marker: False
- Remote asset is old DnmXOM5f: False

## Deploy info

- Deploy info URL: https://mrkwxopya.github.io/noctra/noctra-deploy-info.json?verify=20260507201110
- Deploy info available: False
- Deploy info SHA: 
- Deploy info asset: 

## Problems

- Latest docs-pages.yml run is not successful.
- Remote noctra-deploy-info.json is not available yet.
- Remote index still points to old crashing asset index-DnmXOM5f.js.
- Remote JS asset could not be downloaded.

## Browser check if PASS

- Open cache-busted Button page.
- Ctrl+F5.
- Console must not show Maximum call stack size exceeded.
- JS file should no longer be index-DnmXOM5f.js.
