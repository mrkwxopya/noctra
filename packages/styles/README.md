
# @noctra/styles

CSS tokens, themes, components, and utilities for Noctra.

## Full CSS

```tsx
import "@noctra/styles/index.css";
```

## Partial CSS

```tsx
import "@noctra/styles/tokens.css";
import "@noctra/styles/components.css";
import "@noctra/styles/utilities.css";
```

## Individual component CSS

```tsx
import "@noctra/styles/components/button.css";
import "@noctra/styles/components/card.css";
import "@noctra/styles/components/input.css";
```

## Token CSS

```tsx
import "@noctra/styles/tokens/primitive.css";
import "@noctra/styles/tokens/semantic.css";
import "@noctra/styles/tokens/theme-dark.css";
import "@noctra/styles/tokens/theme-light.css";
import "@noctra/styles/tokens/theme-accent.css";
import "@noctra/styles/tokens/theme-density.css";
import "@noctra/styles/tokens/theme-radius.css";
```

## Includes

* reset
* primitive tokens
* semantic tokens
* dark theme
* light theme
* accent theme
* density theme
* radius theme
* base styles
* component styles
* utility classes
  '@

Write-NoctraFile "packages/tokens/README.md" @'

# @noctra/tokens

Token source and metadata for Noctra.

## Exports

* primitive token names
* semantic token names
* theme modes
* component token names
* token metadata

## Example

```ts
import { noctraTokenMeta } from "@noctra/tokens";
```

## Purpose

This package is used by documentation, token inspectors, and future theme editors.