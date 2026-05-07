# Docs Real Noctra Import Cleanup Report

Generated: 2026-05-07T16:35:02.627Z

Files scanned: 42
Real @noctra/react imports before: 0
Real @noctra/react imports after: 0
Remaining @noctra/react text hits after: 244
Changed files: 0
Problems found: 0

## Real imports before

- None

## Real imports after

- None

## Remaining text hits after

- apps/docs/src/components/InteractiveComponentDemo.tsx:270: <p>@noctra/react does not expose this component at runtime.</p>
- apps/docs/src/components/MantineStyleComponentDocs.tsx:81: <span>@noctra/react does not expose this component at runtime.</span>
- apps/docs/src/data/componentExamples.tsx:770: <tr><td>@noctra/react</td><td>Ready</td></tr>
- apps/docs/src/data/componentExamples.tsx:790: { value: "install", label: "Install", content: "Install @noctra/react and @noctra/styles." },
- apps/docs/src/data/componentExamples.tsx:800: <MockPanel>Install @noctra/react and @noctra/styles.</MockPanel>
- apps/docs/src/data/interactiveDemoPresets.ts:248: { value: "usage", title: "Usage", label: "Usage", content: "Use Noctra components directly from @noctra/react." },
- apps/docs/src/data/interactiveDemoPresets.ts:855: value: "npm install @noctra/react",
- apps/docs/src/data/interactiveDemoPresets.ts:865: children: "pnpm add @noctra/react"
- apps/docs/src/data/realDemoAdapters.ts:28: { value: "install", label: "Install", content: "Install @noctra/react and @noctra/styles." },
- apps/docs/src/data/realDemoAdapters.ts:97: description: `Real ${name} component rendered from @noctra/react in an isolated iframe preview.`,
- apps/docs/src/generated/noctra-component-registry.generated.ts:14: {"name":"Accordion","kebab":"accordion","cssClass":"nc-accordion-root","importPath":"@noctra/react/accordion","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:15: {"name":"Alert","kebab":"alert","cssClass":"nc-alert-root","importPath":"@noctra/react/alert","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:16: {"name":"Anchor","kebab":"anchor","cssClass":"nc-anchor-root","importPath":"@noctra/react/anchor","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:17: {"name":"AppShell","kebab":"app-shell","cssClass":"nc-app-shell-root","importPath":"@noctra/react/app-shell","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:18: {"name":"AspectRatio","kebab":"aspect-ratio","cssClass":"nc-aspect-ratio-root","importPath":"@noctra/react/aspect-ratio","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:19: {"name":"Autocomplete","kebab":"autocomplete","cssClass":"nc-autocomplete-root","importPath":"@noctra/react/autocomplete","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:20: {"name":"Avatar","kebab":"avatar","cssClass":"nc-avatar-root","importPath":"@noctra/react/avatar","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:21: {"name":"Badge","kebab":"badge","cssClass":"nc-badge-root","importPath":"@noctra/react/badge","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:22: {"name":"Blockquote","kebab":"blockquote","cssClass":"nc-blockquote-root","importPath":"@noctra/react/blockquote","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:23: {"name":"Box","kebab":"box","cssClass":"nc-box-root","importPath":"@noctra/react/box","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:24: {"name":"Breadcrumb","kebab":"breadcrumb","cssClass":"nc-breadcrumb-root","importPath":"@noctra/react/breadcrumb","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:25: {"name":"Breadcrumbs","kebab":"breadcrumbs","cssClass":"nc-breadcrumbs-root","importPath":"@noctra/react/breadcrumbs","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:26: {"name":"Button","kebab":"button","cssClass":"nc-button-root","importPath":"@noctra/react/button","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:27: {"name":"Card","kebab":"card","cssClass":"nc-card-root","importPath":"@noctra/react/card","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:28: {"name":"Center","kebab":"center","cssClass":"nc-center-root","importPath":"@noctra/react/center","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:29: {"name":"Checkbox","kebab":"checkbox","cssClass":"nc-checkbox-root","importPath":"@noctra/react/checkbox","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:30: {"name":"ClickOutside","kebab":"click-outside","cssClass":"nc-click-outside-root","importPath":"@noctra/react/click-outside","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:31: {"name":"Clipboard","kebab":"clipboard","cssClass":"nc-clipboard-root","importPath":"@noctra/react/clipboard","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:32: {"name":"Code","kebab":"code","cssClass":"nc-code-root","importPath":"@noctra/react/code","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:33: {"name":"CodeBlock","kebab":"code-block","cssClass":"nc-code-block-root","importPath":"@noctra/react/code-block","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:34: {"name":"ColorInput","kebab":"color-input","cssClass":"nc-color-input-root","importPath":"@noctra/react/color-input","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:35: {"name":"ColorPicker","kebab":"color-picker","cssClass":"nc-color-picker-root","importPath":"@noctra/react/color-picker","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:36: {"name":"Combobox","kebab":"combobox","cssClass":"nc-combobox-root","importPath":"@noctra/react/combobox","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:37: {"name":"Command","kebab":"command","cssClass":"nc-command-root","importPath":"@noctra/react/command","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:38: {"name":"CommandBar","kebab":"command-bar","cssClass":"nc-command-bar-root","importPath":"@noctra/react/command-bar","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:39: {"name":"Container","kebab":"container","cssClass":"nc-container-root","importPath":"@noctra/react/container","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:40: {"name":"ContextMenu","kebab":"context-menu","cssClass":"nc-context-menu-root","importPath":"@noctra/react/context-menu","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:41: {"name":"CreditCard","kebab":"credit-card","cssClass":"nc-credit-card-root","importPath":"@noctra/react/credit-card","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:42: {"name":"DataGrid","kebab":"data-grid","cssClass":"nc-data-grid-root","importPath":"@noctra/react/data-grid","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:43: {"name":"Dialog","kebab":"dialog","cssClass":"nc-dialog-root","importPath":"@noctra/react/dialog","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:44: {"name":"Divider","kebab":"divider","cssClass":"nc-divider-root","importPath":"@noctra/react/divider","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:45: {"name":"Dock","kebab":"dock","cssClass":"nc-dock-root","importPath":"@noctra/react/dock","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:46: {"name":"Drawer","kebab":"drawer","cssClass":"nc-drawer-root","importPath":"@noctra/react/drawer","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:47: {"name":"Dropzone","kebab":"dropzone","cssClass":"nc-dropzone-root","importPath":"@noctra/react/dropzone","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:48: {"name":"EmptyState","kebab":"empty-state","cssClass":"nc-empty-state-root","importPath":"@noctra/react/empty-state","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:49: {"name":"FileInput","kebab":"file-input","cssClass":"nc-file-input-root","importPath":"@noctra/react/file-input","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:50: {"name":"Flex","kebab":"flex","cssClass":"nc-flex-root","importPath":"@noctra/react/flex","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:51: {"name":"FloatLabel","kebab":"float-label","cssClass":"nc-float-label-root","importPath":"@noctra/react/float-label","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:52: {"name":"FocusTrap","kebab":"focus-trap","cssClass":"nc-focus-trap-root","importPath":"@noctra/react/focus-trap","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:53: {"name":"Footer","kebab":"footer","cssClass":"nc-footer-root","importPath":"@noctra/react/footer","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:54: {"name":"FormField","kebab":"form-field","cssClass":"nc-form-field-root","importPath":"@noctra/react/form-field","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:55: {"name":"Grid","kebab":"grid","cssClass":"nc-grid-root","importPath":"@noctra/react/grid","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:56: {"name":"Group","kebab":"group","cssClass":"nc-group-root","importPath":"@noctra/react/group","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:57: {"name":"Header","kebab":"header","cssClass":"nc-header-root","importPath":"@noctra/react/header","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:58: {"name":"Highlight","kebab":"highlight","cssClass":"nc-highlight-root","importPath":"@noctra/react/highlight","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:59: {"name":"HoverCard","kebab":"hover-card","cssClass":"nc-hover-card-root","importPath":"@noctra/react/hover-card","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:60: {"name":"IconButton","kebab":"icon-button","cssClass":"nc-icon-button-root","importPath":"@noctra/react/icon-button","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:61: {"name":"InlineCode","kebab":"inline-code","cssClass":"nc-inline-code-root","importPath":"@noctra/react/inline-code","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:62: {"name":"Input","kebab":"input","cssClass":"nc-input-root","importPath":"@noctra/react/input","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:63: {"name":"Kbd","kebab":"kbd","cssClass":"nc-kbd-root","importPath":"@noctra/react/kbd","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:64: {"name":"Layout","kebab":"layout","cssClass":"nc-layout-root","importPath":"@noctra/react/layout","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:65: {"name":"LayoutShell","kebab":"layout-shell","cssClass":"nc-layout-shell-root","importPath":"@noctra/react/layout-shell","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:66: {"name":"Link","kebab":"link","cssClass":"nc-link-root","importPath":"@noctra/react/link","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:67: {"name":"ListBox","kebab":"list-box","cssClass":"nc-list-box-root","importPath":"@noctra/react/list-box","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:68: {"name":"Loader","kebab":"loader","cssClass":"nc-loader-root","importPath":"@noctra/react/loader","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:69: {"name":"Menu","kebab":"menu","cssClass":"nc-menu-root","importPath":"@noctra/react/menu","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:70: {"name":"Modal","kebab":"modal","cssClass":"nc-modal-root","importPath":"@noctra/react/modal","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:71: {"name":"MultiSelect","kebab":"multi-select","cssClass":"nc-multi-select-root","importPath":"@noctra/react/multi-select","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:72: {"name":"NativeSelect","kebab":"native-select","cssClass":"nc-native-select-root","importPath":"@noctra/react/native-select","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:73: {"name":"Notification","kebab":"notification","cssClass":"nc-notification-root","importPath":"@noctra/react/notification","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:74: {"name":"NumberInput","kebab":"number-input","cssClass":"nc-number-input-root","importPath":"@noctra/react/number-input","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:75: {"name":"Page","kebab":"page","cssClass":"nc-page-root","importPath":"@noctra/react/page","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:76: {"name":"Pagination","kebab":"pagination","cssClass":"nc-pagination-root","importPath":"@noctra/react/pagination","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:77: {"name":"Paper","kebab":"paper","cssClass":"nc-paper-root","importPath":"@noctra/react/paper","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:78: {"name":"PasswordInput","kebab":"password-input","cssClass":"nc-password-input-root","importPath":"@noctra/react/password-input","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:79: {"name":"PinCode","kebab":"pin-code","cssClass":"nc-pin-code-root","importPath":"@noctra/react/pin-code","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:80: {"name":"PinInput","kebab":"pin-input","cssClass":"nc-pin-input-root","importPath":"@noctra/react/pin-input","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:81: {"name":"Popover","kebab":"popover","cssClass":"nc-popover-root","importPath":"@noctra/react/popover","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:82: {"name":"Portal","kebab":"portal","cssClass":"nc-portal-root","importPath":"@noctra/react/portal","status":"registered"},
- apps/docs/src/generated/noctra-component-registry.generated.ts:83: {"name":"Progress","kebab":"progress","cssClass":"nc-progress-root","importPath":"@noctra/react/progress","status":"registered"},

## Problems

- None

## Interpretation

- Real imports are runtime-affecting and must be zero.
- Remaining text hits are allowed if they are documentation code examples.
- This audit no longer treats code examples as runtime imports.
