# Hard Docs Base URL Audit

Generated: 2026-05-07T09:21:02.559Z

Scanned files: 35
Problems found: 0

## Problems

- None

## Required

- No user-facing link should navigate to `https://mrkwxopya.github.io/components/...`.
- All component links must resolve to `/noctra/components/...`.
- Runtime click handling must canonicalize root `/components/...` to `/noctra/components/...`.
- Rendered anchors must be sanitized after render.
- `docsRouting.ts` is allowed to contain route parser strings such as `/components/${slug}` because it canonicalizes them.
