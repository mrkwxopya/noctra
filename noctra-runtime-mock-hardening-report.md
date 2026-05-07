# Noctra Runtime Mock Hardening Report

Generated: 2026-05-07T16:37:25.392Z

Value exports: 111
Type exports: 28
Problems found: 0

## Required fixed exports

- CardBody
- CardDescription
- CardFooter
- CardHeader
- CardTitle
- NcAccentMode
- NcButtonVariant
- NcDensity
- NcRadius
- NcRadiusMode
- NcSize
- NcTone

## Problems

- None

## Applied

- Regenerated NoctraRuntimeMock from actual docs imports.
- Added missing card slot exports.
- Added Noctra utility type aliases.
- Replaced dynamic JSX Tag with createElement for safer TypeScript.
- Sanitized unknown className/style before DOM usage.
- Expanded NoctraProvider props compatibility.
