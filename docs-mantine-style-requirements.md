# Noctra Mantine-Style Documentation Requirements

## Goal

Noctra documentation must become a professional component documentation system with a Mantine-like page flow, but with Noctra's own visual identity and Noctra components.

This is not a generic generated catalog.

Each component page must feel component-specific, practical, interactive, and copy-paste ready.

## Required component page flow

Each component detail page should follow this structure:

1. Header
2. Usage
3. Interactive playground
4. Variants
5. Tones
6. Sizes
7. Radius
8. States
9. Controlled usage
10. Compound usage
11. Props
12. Accessibility
13. Related components

Sections must only appear when they make sense for the component.

## Removed section

The public docs must not show:

- Documentation coverage
- Coverage meter
- Types / CSS / tokens coverage score
- Internal readiness score

Coverage can exist in internal reports only.

## URL requirement

Correct public component URL:

```text
https://mrkwxopya.github.io/noctra/components/button
````

Forbidden URL:

```text
https://mrkwxopya.github.io/components/button
```

All sidebar, search, card, related, breadcrumb, and runtime links must use `/noctra`.

## Removed components

The following components must not appear in docs, catalog, generated data, routes, search, related components, or runtime audits:

* DateInput
* DateTimeInput
* MonthInput
* TimeInput
* WeekInput
* YearInput
* TimePicker
* Calendar
* DatePicker
* DateTimePicker
* DateRangePicker

## Preview sizing

Docs preview areas must not auto-stretch every component.

Expected sizing:

* Inline components use content width
* Form components use readable fixed preview width
* TextInput/SearchInput/Select around 320px
* Textarea around 360px
* Data components use a wider container
* ScrollArea uses fixed height and real overflow
* Overlay components render open with real content
* Layout components render real layout, not placeholder text

## Playground controls

Controls must be component-specific.

Do not show the same controls for every component.

Wrong universal controls:

* Canvas
* Center
* Variant
* Tone
* Size
* Radius
* Density

Correct behavior:

* Button: variant, tone, size, radius, disabled, loading
* TextInput: value, placeholder, size, radius, disabled, invalid
* Select: value, placeholder, size, radius, disabled
* Modal: open, size, title
* Table: rows, striped, highlight
* Slider: value, min, max, step
* Switch: checked, disabled
* Tabs: active tab
* Accordion: active item
* Menu: open and actions

Unsupported props must not appear as controls.

## Preview/code synchronization

Interactive playground must use one shared state.

The same state must render:

* live preview
* generated code

If the user changes variant, tone, size, radius, disabled, checked, open, value, or page, the code tab must change too.

Static code blocks are not acceptable for interactive playgrounds.

## Real runtime components

All previews must render real `@noctra/react` exports.

No fake placeholder preview.

If a runtime export is missing, the docs must report it clearly.

## Component-specific safe presets

Problem components must have safe presets with correct data shape and interactive state.

Required problem areas:

* Input
* SearchInput
* TextInput
* Textarea
* NumberInput
* ListBox
* Select
* MultiSelect
* Combobox
* Autocomplete
* TagsInput
* Checkbox
* Radio
* Switch
* Slider
* Pagination
* Tabs
* Accordion
* Menu
* ContextMenu
* Command
* CommandBar
* Spotlight
* Tree
* TreeSelect
* TransferList
* Dropzone
* Modal
* Drawer
* Dialog
* Table
* DataGrid
* TableOfContents
* Timeline
* Toolbar
* Anchor
* Avatar
* Clipboard
* Code
* ColorInput
* CreditCard
* FileInput
* FloatLabel
* Container
* Flex
* Grid
* ResizablePanel
* SplitPane
* ScrollArea
* ScrollLock
* Skeleton
* VisuallyHidden
* Dock
* ClickOutside

## NumberInput rule

NumberInput must render:

```text
[ - ] [ input ] [ + ]
```

Minus on the left, input in the center, plus on the right.

## Generic placeholder ban

The docs must not rely on placeholder-only examples like:

* Component preview
* Container preview
* Flex preview
* Grid preview
* Code preview
* ClickOutside preview
* No steps available
* Accordion content only

Every component must receive meaningful content matching its purpose.

## Final expectation

Noctra docs should feel as organized and useful as Mantine UI documentation, while keeping Noctra identity.

The final docs must provide:

* Component-specific examples
* Real runtime previews
* Interactive playground
* Synced code
* Rich variants/tones/sizes/radius examples
* Props table
* Accessibility notes
* Related components
* Clean `/noctra` URLs
  '@

Write-NoctraFile "scripts/patch-remove-docs-coverage-section.mjs" @'
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/pages/ComponentDetailPage.tsx";

function readText(path) {
return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
throw new Error(`Missing ${file}`);
}

const before = text;

text = text.replace(/\s*CoverageMeter,\r?\n/g, "\n");

text = text.replace(
/\s*const apiCoverageMax = 5;\s*const apiCoverageValue = [[\s\S]*?].filter(Boolean).length;\s*/m,
"\n"
);

text = text.replace(
/\s*<DocCard title="Documentation coverage"[\s\S]*?</DocCard>\s*/m,
"\n"
);

text = text.replace(
/\s*<DocCard\s+title="Documentation coverage"[\s\S]*?</DocCard>\s*/m,
"\n"
);

text = text.replace(/\n{3,}/g, "\n\n");

writeText(file, text);

const changed = before !== text;

const remaining = [
"Documentation coverage",
"CoverageMeter",
"apiCoverageMax",
"apiCoverageValue"
].filter((term) => text.includes(term));

const report = [
"# Docs Coverage Removal Report",
"",
`Generated: ${new Date().toISOString()}`,
"",
`Changed: ${changed ? "yes" : "no"}`,
`Remaining coverage terms: ${remaining.length}`,
"",
"## Remaining terms",
"",
...(remaining.length > 0 ? remaining.map((term) => `- ${term}`) : ["- None"])
].join("\n");

writeFileSync("docs-coverage-removal-report.md", `${report}\n`, "utf8");

console.log(`Docs coverage removal completed. Changed: ${changed}. Remaining terms: ${remaining.length}. Report: docs-coverage-removal-report.md`);

if (remaining.length > 0) {
console.error(report);
throw new Error("Docs coverage removal still has remaining public terms.");
}