# Interactive Demo Presets includes/has Typefix Report

Generated: 2026-05-07T15:49:07.217Z

Changed: yes
includes/has calls patched: 1
Problems found: 0

## Original typecheck excerpt

```text
> @noctra/docs@0.0.0 typecheck D:\nodejs\noctra\apps\docs
> tsc --noEmit -p tsconfig.json

src/data/interactiveDemoPresets.ts(1217,49): error TS2345: Argument of type 'string' is not assignable to parameter of type 'never'.
D:\nodejs\noctra\apps\docs:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @noctra/docs@0.0.0 typecheck: `tsc --noEmit -p tsconfig.json`
Exit status 2
```

## Patched locations

- 1217: has :: return removedInteractiveDemoComponents.has(componentName);

## Problems

- None
