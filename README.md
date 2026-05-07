# Noctra

Noctra is a dark-first premium React design ecosystem.

It is not only a component kit. It is a token-first visual system, component system, utility system, documentation system, and playground foundation.

## Current status

Noctra is currently an internal alpha foundation.

The foundation includes:

- React component package
- CSS styles package
- Token metadata package
- Shared utility package
- Documentation app
- Playground MVP
- Token inspector MVP
- Theme controls
- Export smoke tests
- Quality gate docs
- Accessibility audit docs

## Packages

| Package | Purpose |
| --- | --- |
| `@noctra/react` | React components and provider |
| `@noctra/styles` | CSS tokens, themes, components, and utilities |
| `@noctra/tokens` | Token metadata and token name exports |
| `@noctra/utils` | Shared utilities and system types |
| `@noctra/docs` | Documentation app |

## Components

Current MVP foundation components:

- Button
- IconButton
- Card
- Input
- NumberInput
- PasswordInput
- SearchInput
- PinInput
- FileInput
- Dropzone
- Clipboard
- CreditCard
- ListBox
- PinCode
- FloatLabel
- TransferList
- TreeView
- Timeline
- Stepper
- ColorInput
- ColorPicker
- DateInput
- DatePicker
- DateRangePicker
- TimeInput
- DateTimeInput
- MonthInput
- WeekInput
- YearInput
- Slider
- RangeSlider
- Rating
- Progress
- Loader
- Textarea
- Checkbox
- CheckboxGroup
- Radio
- RadioGroup
- Switch
- SwitchGroup
- SegmentedControl
- Tabs
- Accordion
- Modal
- Breadcrumbs
- Pagination
- Menu
- ContextMenu
- Select
- MultiSelect
- Autocomplete
- TagsInput
- TextInput
- Popover
- Tooltip
- HoverCard
- Drawer
- Toast
- Notification
- Dialog
- Command
- Kbd
- CodeBlock
- InlineCode
- Highlight
- Link
- Blockquote
- Prose
- VisuallyHidden
- Portal
- FocusTrap
- ClickOutside
- ScrollLock
- Code
- EmptyState
- NativeSelect
- FormField
- Badge
- Alert
- Modal
- Tooltip
- Spinner
- Skeleton
- Divider
- Paper
- Card
- Section
- Page
- Layout
- Spacer
- AspectRatio
- Center
- Container
- Stack
- Group
- Grid
- SimpleGrid
- Box
- Flex
- ScrollArea
- SplitPane
- ResizablePanel
- Dock
- Toolbar
- CommandBar
- StatusBar
- Avatar

## Install

```powershell
pnpm install
````

## Development

```powershell
pnpm dev
pnpm typecheck
pnpm build
```

## Usage

Import the CSS once near the app root:

```tsx
import "@noctra/styles/index.css";
```

Use the provider:

```tsx
import { NoctraProvider, Button } from "@noctra/react";

export function App() {
  return (
    <NoctraProvider theme="dark" density="default" radiusMode="default" accent="violet">
      <Button>Continue</Button>
    </NoctraProvider>
  );
}
```

## Partial CSS imports

```tsx
import "@noctra/styles/tokens.css";
import "@noctra/styles/components.css";
import "@noctra/styles/utilities.css";
```

## Component subpath imports

```tsx
import { Button } from "@noctra/react/button";
import { Card } from "@noctra/react/card";
import { Input } from "@noctra/react/input";
```

## Theme API

`NoctraProvider` supports:

| Prop         | Values                                        |
| ------------ | --------------------------------------------- |
| `theme`      | `dark`, `light`, `system`                     |
| `density`    | `compact`, `default`, `comfortable`           |
| `radiusMode` | `sharp`, `default`, `rounded`                 |
| `accent`     | `violet`, `indigo`, `blue`, `cyan`, `emerald` |

## Design rules

* No raw colors inside components.
* Components use semantic or component tokens.
* CSS variables are part of the public styling API.
* Anatomy slots are part of the public styling API.
* Dark mode is the default identity.
* Light mode must remain polished.
* Glow is rare and controlled.
* Borders, surfaces, typography, spacing, and states create the premium feel.
* Every important component needs docs and playground coverage.

## Quality gates

Current foundation gates:

* `pnpm typecheck`
* `pnpm build`
* `pnpm --filter @noctra/docs build`
* `node scripts/verify-exports.mjs`
  '@

Write-NoctraFile "docs/installation.md" @'

# Installation

Noctra is organized as a pnpm workspace.

## Install dependencies

```powershell
pnpm install
```

## Run docs

```powershell
pnpm dev
```

## Build all packages

```powershell
pnpm build
```

## Typecheck all packages

```powershell
pnpm typecheck
```

## Verify exports

```powershell
node scripts/verify-exports.mjs
```

## Recommended app setup

Import Noctra CSS once:

```tsx
import "@noctra/styles/index.css";
```

Wrap the app with `NoctraProvider`:

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

## Alpha foundation summary

The alpha foundation summary is available in:

```text
NOCTRA_ALPHA_FOUNDATION_SUMMARY.md
````

The next phase roadmap is available in:

```text
docs/next-phase-roadmap.md
```
