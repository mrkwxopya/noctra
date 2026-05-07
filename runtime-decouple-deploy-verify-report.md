# Runtime Decouple Deploy Verify Report

Generated: 2026-05-07T16:10:05.0633340Z

Decision: PASS_RUNTIME_DECOUPLE_DEPLOY_READY
Workflow file: docs-pages.yml
Run id: 25507619609
Status: completed
Conclusion: success
Title: Decouple docs foundation from runtime safely
Run URL: https://github.com/mrkwxopya/noctra/actions/runs/25507619609
Run head SHA: 6c7693c6bb1c888d32c5c638e00be58f8f43abb9
Local HEAD: 6c7693c6bb1c888d32c5c638e00be58f8f43abb9
Remote HEAD: 6c7693c6bb1c888d32c5c638e00be58f8f43abb9
Remote matches local: True

## Source problems

- None

## Browser check

- Open: https://mrkwxopya.github.io/noctra/components/button
- Hard refresh: Ctrl+F5
- Console should not show: Maximum call stack size exceeded
- Left sidebar should show Docs and Components
- Links should stay clean without #/architecture
