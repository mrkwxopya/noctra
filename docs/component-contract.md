
# Component Contract

Every Noctra component should define the same contract.

## Required files

```text
Component.tsx
Component.types.ts
Component.anatomy.ts
index.ts
```

## Required component fields

Every component should define:

* variants
* sizes where relevant
* tones where relevant
* radius where relevant
* density where relevant
* states
* slots
* CSS variables
* data attributes
* accessibility rules
* documentation metadata
* playground controls where relevant

## Common anatomy slots

* root
* wrapper
* inner
* header
* body
* footer
* content
* label
* description
* icon
* indicator
* control
* trigger
* panel
* item
* separator
* action
* loader
* error
* hint

## Common data attributes

* `data-slot`
* `data-variant`
* `data-size`
* `data-tone`
* `data-radius`
* `data-density`
* `data-state`
* `data-disabled`
* `data-loading`
* `data-invalid`
* `data-selected`
* `data-orientation`
* `data-interactive`

## Accessibility baseline

* Prefer native elements.
* Expose labels for icon-only controls.
* Link labels, descriptions, and errors.
* Use semantic roles only when needed.
* Keep focus states visible and consistent.
* Do not rely on color only.
* Respect reduced motion.
  '@

Write-NoctraFile "docs/foundation-summary.md" @'

# Foundation Summary

Noctra foundation currently includes:

## Systems

* Primitive tokens
* Semantic tokens
* Theme tokens
* Component tokens
* Surface system
* Border system
* Shadow/glow system
* Typography utilities
* Layout utilities
* Theme provider
* Density mode
* Radius mode
* Accent mode

## Components

* Button
* IconButton
* Card
* Input
* Badge
* Alert
* Modal
* Tooltip
* Spinner
* Skeleton
* Divider
* Avatar

## Documentation

* Docs shell
* Core showcase
* MVP component showcase
* Button playground
* Token inspector
* Component docs registry
* Quality gate
* Accessibility audit

## Build gates

* Workspace build
* Workspace typecheck
* Docs build
* Export verification

## Next phase

After the alpha foundation, the next major expansion should focus on:

* FormField
* Textarea
* Checkbox
* Radio
* Switch
* Select
* Tabs
* Menu
* Popover
* Drawer
* Toast
* Table
  '@

Write-NoctraFile "packages/react/README.md" @'

# @noctra/react

React components for Noctra.

## Main import

```tsx
import { Button, Card, Input } from "@noctra/react";
```

## Provider

```tsx
import { NoctraProvider } from "@noctra/react";

export function Root() {
  return (
    <NoctraProvider theme="dark" density="default" radiusMode="default" accent="violet">
      <App />
    </NoctraProvider>
  );
}
```

## Subpath imports

```tsx
import { Button } from "@noctra/react/button";
import { IconButton } from "@noctra/react/icon-button";
import { Card } from "@noctra/react/card";
import { Input } from "@noctra/react/input";
import { Badge } from "@noctra/react/badge";
import { Alert } from "@noctra/react/alert";
import { Modal } from "@noctra/react/modal";
import { Tooltip } from "@noctra/react/tooltip";
import { Spinner } from "@noctra/react/spinner";
import { Skeleton } from "@noctra/react/skeleton";
import { Divider } from "@noctra/react/divider";
import { Avatar } from "@noctra/react/avatar";
```

## Components

* Button
* IconButton
* Card
* Input
* Badge
* Alert
* Modal
* Tooltip
* Spinner
* Skeleton
* Divider
* Avatar

## Status

Internal alpha foundation. API can still change.