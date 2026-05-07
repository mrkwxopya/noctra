# DocsChrome Native Typefix Report

Generated: 2026-05-07T16:20:55.651Z

Chrome changed: yes
Main changed: yes
Problems found: 0

## Problems

- None

## Applied

- Added optionalNode, optionalString, optionalStyle and optionalClassName helpers.
- Sanitized unknown className/style values before passing to DOM.
- Avoided href={undefined} under exactOptionalPropertyTypes.
- Replaced DocsRoute type usage in main.tsx with typeof DocsRoute.
- Kept DocsChrome native and decoupled from @noctra/react.
