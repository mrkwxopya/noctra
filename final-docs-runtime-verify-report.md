# Final Docs Runtime Verify Report

Generated: 2026-05-07T16:23:51.1847591Z

Decision: PASS_FINAL_DOCS_RUNTIME_READY
Workflow file: docs-pages.yml
Run id: 25508332776
Status: completed
Conclusion: success
Title: Fix native docs chrome routing types
Run URL: https://github.com/mrkwxopya/noctra/actions/runs/25508332776
Run head SHA: ba692bcdaa812fb798ddf06a8d601da41ba6255d
Local HEAD: ba692bcdaa812fb798ddf06a8d601da41ba6255d
Remote HEAD: ba692bcdaa812fb798ddf06a8d601da41ba6255d
Remote matches local: True
Hash problem files: 0

## Source problems

- None

## Browser check

- Open: https://mrkwxopya.github.io/noctra/components/button
- Hard refresh with Ctrl+F5.
- Console should not show Maximum call stack size exceeded.
- Left sidebar should show Docs and Components.
- Component links should stay clean: /noctra/components/aspect-ratio
- Architecture link should open /noctra/architecture.
- URL should not become /noctra/components/aspect-ratio#/architecture.
