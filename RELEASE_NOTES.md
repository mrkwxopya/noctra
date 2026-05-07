# Noctra Release Notes

Generated: 2026-05-07T01:38:12.215Z

## Release Candidate Summary

- Root package: noctra
- Root version: 0.0.0
- Workspace packages: 5
- Publishable packages: 4
- React components: 119
- Quality reports indexed: 22
- Critical reported problems: 0
- Reported warnings: 0
- Auto-heal changes summarized: 0

## Publishable Packages

- @noctra/react@0.0.0-alpha.0
- @noctra/styles@0.0.0-alpha.0
- @noctra/tokens@0.0.0-alpha.0
- @noctra/utils@0.0.0-alpha.0

## Component Inventory

- Accordion (accordion)
- Alert (alert)
- Anchor (anchor)
- AppShell (app-shell)
- AspectRatio (aspect-ratio)
- Autocomplete (autocomplete)
- Avatar (avatar)
- Badge (badge)
- Blockquote (blockquote)
- Box (box)
- Breadcrumb (breadcrumb)
- Breadcrumbs (breadcrumbs)
- Button (button)
- Calendar (calendar)
- Card (card)
- Center (center)
- Checkbox (checkbox)
- ClickOutside (click-outside)
- Clipboard (clipboard)
- Code (code)
- CodeBlock (code-block)
- ColorInput (color-input)
- ColorPicker (color-picker)
- Combobox (combobox)
- Command (command)
- CommandBar (command-bar)
- Container (container)
- ContextMenu (context-menu)
- CreditCard (credit-card)
- DataGrid (data-grid)
- DateInput (date-input)
- DatePicker (date-picker)
- DateRangePicker (date-range-picker)
- DateTimeInput (date-time-input)
- DateTimePicker (date-time-picker)
- Dialog (dialog)
- Divider (divider)
- Dock (dock)
- Drawer (drawer)
- Dropzone (dropzone)
- EmptyState (empty-state)
- FileInput (file-input)
- Flex (flex)
- FloatLabel (float-label)
- FocusTrap (focus-trap)
- Footer (footer)
- FormField (form-field)
- Grid (grid)
- Group (group)
- Header (header)
- Highlight (highlight)
- HoverCard (hover-card)
- IconButton (icon-button)
- InlineCode (inline-code)
- Input (input)
- Kbd (kbd)
- Layout (layout)
- LayoutShell (layout-shell)
- Link (link)
- ListBox (list-box)
- Loader (loader)
- Menu (menu)
- Modal (modal)
- MonthInput (month-input)
- MultiSelect (multi-select)
- NativeSelect (native-select)
- Notification (notification)
- NumberInput (number-input)
- Page (page)
- Pagination (pagination)
- Paper (paper)
- PasswordInput (password-input)
- PinCode (pin-code)
- PinInput (pin-input)
- Popover (popover)
- Portal (portal)
- Progress (progress)
- Prose (prose)
- Radio (radio)
- RangeSlider (range-slider)
- Rating (rating)
- ResizablePanel (resizable-panel)
- ScrollArea (scroll-area)
- ScrollLock (scroll-lock)
- SearchInput (search-input)
- Section (section)
- SegmentedControl (segmented-control)
- Select (select)
- Sidebar (sidebar)
- SimpleGrid (simple-grid)
- Skeleton (skeleton)
- Slider (slider)
- Spacer (spacer)
- Spinner (spinner)
- SplitPane (split-pane)
- Spotlight (spotlight)
- Stack (stack)
- StatusBar (status-bar)
- Stepper (stepper)
- Switch (switch)
- Table (table)
- TableOfContents (table-of-contents)
- Tabs (tabs)
- TagsInput (tags-input)
- Textarea (textarea)
- TextInput (text-input)
- TimeInput (time-input)
- Timeline (timeline)
- TimePicker (time-picker)
- Toast (toast)
- Toolbar (toolbar)
- Tooltip (tooltip)
- TransferList (transfer-list)
- Tree (tree)
- TreeSelect (tree-select)
- TreeView (tree-view)
- VisuallyHidden (visually-hidden)
- WeekInput (week-input)
- YearInput (year-input)

## Dist Artifact Summary

| Root | Exists | Files |
|---|---|---:|
| packages/react/dist | OK | 1948 |
| packages/styles/dist | OK | 8 |
| packages/tokens/dist | OK | 516 |
| packages/utils/dist | OK | 12 |
| apps/docs/dist | OK | 3 |

## Verification Gates

- JSON verification
- Component export auto-heal
- Component prop conflict auto-heal
- Workspace dependency boundary auto-heal
- Release metadata auto-heal
- React component smoke export generation
- Token component smoke export generation
- Style component smoke export generation
- Component inventory audit
- Docs component usage audit
- Component prop conflict audit
- Workspace dependency boundary audit
- Release metadata audit
- Package entry point audit
- Dist artifact audit
- npm pack dry-run audit
- Final quality gate

## Notes

- This file is generated and should be refreshed before publishing.
- It does not publish, tag, commit, or push.
- Any report with problems should be inspected before release.
## Professional Docs Release Gate

- Professional component documentation is generated from package source.
- Component detail pages include imports, showcase, props metadata, variants, anatomy, tokens, integration, and related components.
- professional-docs-audit-report.md must report zero problems before GitHub publish.
- FINAL_DOCS_RELEASE_DECISION.md must pass before publishing docs publicly.