export type InteractiveDemoPreset = Record<string, any>;
const formOptions = [
    { value: "alpha", label: "Alpha" },
    { value: "beta", label: "Beta" },
    { value: "stable", label: "Stable" }
];
const commandItems = [
    { value: "search-docs", label: "Search docs", description: "Open documentation search" },
    { value: "copy-import", label: "Copy import", description: "Copy package import" },
    { value: "open-release", label: "Open release", description: "Review release checklist" }
];
const treeItems = [
    {
        value: "src",
        label: "src",
        children: [
            { value: "components", label: "components" },
            { value: "tokens", label: "tokens" }
        ]
    },
    {
        value: "docs",
        label: "docs",
        children: [
            { value: "overview", label: "overview" },
            { value: "components-page", label: "components" }
        ]
    }
];
const transferData = [
    { value: "button", label: "Button" },
    { value: "tabs", label: "Tabs" },
    { value: "modal", label: "Modal" },
    { value: "table", label: "Table" }
];
const tableColumns = [
    { key: "package", label: "Package" },
    { key: "status", label: "Status" },
    { key: "coverage", label: "Coverage" }
];
const tableRows = [
    { package: "@noctra/react", status: "Ready", coverage: "Runtime" },
    { package: "@noctra/styles", status: "Ready", coverage: "CSS" },
    { package: "@noctra/tokens", status: "Ready", coverage: "Tokens" }
];
export const removedInteractiveDemoComponents = new Set([]);
export const interactiveDemoPresets: Record<string, InteractiveDemoPreset> = {
    Input: {
        title: "Input",
        description: "Safe native input preview without children.",
        previewWidth: 320,
        props: {
            value: "Noctra",
            placeholder: "Type a value",
            "aria-label": "Input demo"
        },
        controls: ["value", "placeholder", "disabled", "invalid", "size", "radius"]
    },
    SearchInput: {
        title: "Search input",
        description: "Search field with controlled value.",
        previewWidth: 320,
        props: {
            value: "components",
            placeholder: "Search components",
            "aria-label": "Search"
        },
        controls: ["value", "placeholder", "disabled", "size", "radius"]
    },
    TextInput: {
        title: "Text input",
        description: "Controlled text input with clean focus state.",
        previewWidth: 320,
        props: {
            value: "Noctra",
            placeholder: "Project name",
            label: "Project"
        },
        controls: ["value", "placeholder", "disabled", "invalid", "size", "radius"]
    },
    Textarea: {
        title: "Textarea",
        description: "Textarea with visible border and readable dimensions.",
        previewWidth: 360,
        props: {
            value: "Write documentation notes here.",
            placeholder: "Write notes",
            rows: 4
        },
        controls: ["value", "placeholder", "disabled", "invalid", "size", "radius"]
    },
    NumberInput: {
        title: "Number input",
        description: "Minus on the left, value input in the center, plus on the right.",
        previewWidth: 240,
        state: {
            value: 12
        },
        props: {
            value: 12,
            min: 0,
            max: 100,
            step: 1
        },
        controls: ["value", "min", "max", "step", "disabled", "size", "radius"]
    },
    Checkbox: {
        title: "Checkbox",
        description: "Controlled checkbox preview.",
        props: {
            checked: true,
            label: "Enable notifications"
        },
        controls: ["checked", "disabled", "label"]
    },
    Radio: {
        title: "Radio",
        description: "Controlled radio option preview.",
        props: {
            checked: true,
            label: "Primary option",
            value: "primary",
            name: "radio-demo"
        },
        controls: ["checked", "disabled", "label"]
    },
    Switch: {
        title: "Switch",
        description: "Controlled switch preview.",
        props: {
            checked: true,
            label: "Enable sync"
        },
        controls: ["checked", "disabled", "label", "size"]
    },
    Slider: {
        title: "Slider",
        description: "Controlled slider value preview.",
        previewWidth: 320,
        props: {
            value: 45,
            min: 0,
            max: 100,
            step: 5
        },
        controls: ["value", "min", "max", "step", "disabled"]
    },
    Select: {
        title: "Select",
        description: "Controlled select with options and placeholder.",
        previewWidth: 320,
        props: {
            value: "alpha",
            placeholder: "Choose status",
            options: formOptions,
            data: formOptions
        },
        controls: ["value", "placeholder", "disabled", "size", "radius"]
    },
    MultiSelect: {
        title: "MultiSelect",
        description: "Controlled multiselect with removable values.",
        previewWidth: 360,
        props: {
            value: ["alpha", "stable"],
            options: formOptions,
            data: formOptions,
            placeholder: "Choose values"
        },
        controls: ["value", "placeholder", "disabled", "size", "radius"]
    },
    Combobox: {
        title: "Combobox",
        description: "Combobox with selectable options.",
        previewWidth: 340,
        props: {
            value: "alpha",
            options: formOptions,
            data: formOptions,
            placeholder: "Search option"
        },
        controls: ["value", "placeholder", "disabled", "size", "radius"]
    },
    Autocomplete: {
        title: "Autocomplete",
        description: "Autocomplete suggestions from data.",
        previewWidth: 340,
        props: {
            value: "No",
            options: formOptions,
            data: ["Noctra", "Noctra React", "Noctra Tokens"],
            placeholder: "Start typing"
        },
        controls: ["value", "placeholder", "disabled", "size", "radius"]
    },
    TagsInput: {
        title: "Tags input",
        description: "Tags input with compact shell and removable tags.",
        previewWidth: 380,
        props: {
            value: ["react", "tokens"],
            data: ["react", "tokens", "docs"],
            placeholder: "Add tag"
        },
        controls: ["value", "placeholder", "disabled", "size", "radius"]
    },
    ListBox: {
        title: "ListBox",
        description: "Listbox with toggleable selected item.",
        previewWidth: 320,
        props: {
            value: ["alpha"],
            items: formOptions,
            options: formOptions,
            multiple: true
        },
        controls: ["value", "multiple", "disabled"]
    },
    Pagination: {
        title: "Pagination",
        description: "Controlled active page.",
        props: {
            page: 2,
            value: 2,
            total: 8
        },
        controls: ["page", "total", "disabled"]
    },
    Tabs: {
        title: "Tabs",
        description: "Three panels with controlled active tab.",
        props: {
            value: "overview",
            items: [
                { value: "overview", label: "Overview", content: "Overview content" },
                { value: "usage", label: "Usage", content: "Usage content" },
                { value: "api", label: "API", content: "API content" }
            ]
        },
        controls: ["value", "variant", "size", "orientation"]
    },
    Accordion: {
        title: "Accordion",
        description: "Three disclosure items with title and content.",
        props: {
            value: "usage",
            items: [
                { value: "usage", title: "Usage", label: "Usage", content: "Use Noctra components directly from @noctra/react." },
                { value: "tokens", title: "Tokens", label: "Tokens", content: "Style is driven by Noctra tokens." },
                { value: "accessibility", title: "Accessibility", label: "Accessibility", content: "Keyboard and aria behavior should be documented." }
            ]
        },
        controls: ["value", "multiple", "collapsible", "variant"]
    },
    Menu: {
        title: "Menu",
        description: "Action menu with meaningful items.",
        props: {
            open: true,
            items: [
                { value: "edit", label: "Edit" },
                { value: "duplicate", label: "Duplicate" },
                { value: "archive", label: "Archive" },
                { value: "delete", label: "Delete" }
            ]
        },
        controls: ["open", "disabled"]
    },
    ContextMenu: {
        title: "Context menu",
        description: "Right-click action menu preset.",
        props: {
            open: true,
            items: [
                { value: "open", label: "Open" },
                { value: "rename", label: "Rename" },
                { value: "move", label: "Move" },
                { value: "delete", label: "Delete" }
            ]
        },
        controls: ["open"]
    },
    Command: {
        title: "Command",
        description: "Command list with searchable actions.",
        previewWidth: 420,
        props: {
            value: "",
            items: commandItems,
            data: commandItems,
            placeholder: "Search command"
        },
        controls: ["value", "placeholder", "open"]
    },
    CommandBar: {
        title: "CommandBar",
        description: "Compact command bar with keyboard-like actions.",
        previewWidth: 440,
        props: {
            value: "",
            items: commandItems,
            data: commandItems,
            placeholder: "Run command"
        },
        controls: ["value", "placeholder"]
    },
    Spotlight: {
        title: "Spotlight",
        description: "Spotlight search with iterable actions array.",
        previewWidth: 460,
        props: {
            open: true,
            value: "",
            query: "",
            placeholder: "Search actions",
            actions: [
                {
                    id: "search-docs",
                    value: "search-docs",
                    label: "Search docs",
                    description: "Open documentation search"
                },
                {
                    id: "copy-import",
                    value: "copy-import",
                    label: "Copy import",
                    description: "Copy package import"
                },
                {
                    id: "open-release",
                    value: "open-release",
                    label: "Open release",
                    description: "Review release checklist"
                }
            ],
            items: [
                {
                    id: "search-docs",
                    value: "search-docs",
                    label: "Search docs",
                    description: "Open documentation search"
                },
                {
                    id: "copy-import",
                    value: "copy-import",
                    label: "Copy import",
                    description: "Copy package import"
                },
                {
                    id: "open-release",
                    value: "open-release",
                    label: "Open release",
                    description: "Review release checklist"
                }
            ],
            data: [
                {
                    id: "search-docs",
                    value: "search-docs",
                    label: "Search docs",
                    description: "Open documentation search"
                },
                {
                    id: "copy-import",
                    value: "copy-import",
                    label: "Copy import",
                    description: "Copy package import"
                },
                {
                    id: "open-release",
                    value: "open-release",
                    label: "Open release",
                    description: "Review release checklist"
                }
            ]
        },
        controls: [
            "open",
            "value",
            "placeholder"
        ]
    },
    Tree: {
        title: "Tree",
        description: "Tree with iterable nested nodes array.",
        previewWidth: 360,
        props: {
            nodes: [
                {
                    value: "components",
                    label: "components",
                    children: [
                        {
                            value: "button",
                            label: "Button"
                        },
                        {
                            value: "input",
                            label: "Input"
                        }
                    ]
                },
                {
                    value: "docs",
                    label: "docs",
                    children: [
                        {
                            value: "usage",
                            label: "Usage"
                        },
                        {
                            value: "props",
                            label: "Props"
                        }
                    ]
                }
            ],
            items: [
                {
                    value: "components",
                    label: "components",
                    children: [
                        {
                            value: "button",
                            label: "Button"
                        },
                        {
                            value: "input",
                            label: "Input"
                        }
                    ]
                },
                {
                    value: "docs",
                    label: "docs",
                    children: [
                        {
                            value: "usage",
                            label: "Usage"
                        },
                        {
                            value: "props",
                            label: "Props"
                        }
                    ]
                }
            ],
            data: [
                {
                    value: "components",
                    label: "components",
                    children: [
                        {
                            value: "button",
                            label: "Button"
                        },
                        {
                            value: "input",
                            label: "Input"
                        }
                    ]
                },
                {
                    value: "docs",
                    label: "docs",
                    children: [
                        {
                            value: "usage",
                            label: "Usage"
                        },
                        {
                            value: "props",
                            label: "Props"
                        }
                    ]
                }
            ],
            value: [
                "components"
            ],
            expanded: [
                "components",
                "docs"
            ]
        },
        controls: [
            "value",
            "multiple"
        ]
    },
    TreeSelect: {
        title: "TreeSelect",
        description: "TreeSelect with iterable nested nodes array.",
        previewWidth: 360,
        props: {
            nodes: [
                {
                    value: "components",
                    label: "components",
                    children: [
                        {
                            value: "button",
                            label: "Button"
                        },
                        {
                            value: "input",
                            label: "Input"
                        }
                    ]
                },
                {
                    value: "docs",
                    label: "docs",
                    children: [
                        {
                            value: "usage",
                            label: "Usage"
                        },
                        {
                            value: "props",
                            label: "Props"
                        }
                    ]
                }
            ],
            items: [
                {
                    value: "components",
                    label: "components",
                    children: [
                        {
                            value: "button",
                            label: "Button"
                        },
                        {
                            value: "input",
                            label: "Input"
                        }
                    ]
                },
                {
                    value: "docs",
                    label: "docs",
                    children: [
                        {
                            value: "usage",
                            label: "Usage"
                        },
                        {
                            value: "props",
                            label: "Props"
                        }
                    ]
                }
            ],
            data: [
                {
                    value: "components",
                    label: "components",
                    children: [
                        {
                            value: "button",
                            label: "Button"
                        },
                        {
                            value: "input",
                            label: "Input"
                        }
                    ]
                },
                {
                    value: "docs",
                    label: "docs",
                    children: [
                        {
                            value: "usage",
                            label: "Usage"
                        },
                        {
                            value: "props",
                            label: "Props"
                        }
                    ]
                }
            ],
            value: "button",
            placeholder: "Select node",
            expanded: [
                "components",
                "docs"
            ]
        },
        controls: [
            "value",
            "placeholder",
            "disabled"
        ]
    },
    TransferList: {
        title: "TransferList",
        description: "Source and target lists with transferable items.",
        previewWidth: 520,
        props: {
            data: transferData,
            value: ["button"],
            sourceItems: transferData,
            targetItems: transferData.slice(0, 1)
        },
        controls: ["value", "disabled"]
    },
    Dropzone: {
        title: "Dropzone",
        description: "Dropzone with safe files array.",
        previewWidth: 420,
        props: {
            files: [],
            acceptedFiles: [],
            maxFiles: 3,
            label: "Drop files here"
        },
        controls: ["disabled", "maxFiles"]
    },
    Table: {
        title: "Table",
        description: "Table with real columns and rows.",
        previewWidth: 620,
        props: {
            columns: tableColumns,
            rows: tableRows,
            data: tableRows
        },
        controls: ["striped", "highlightOnHover", "density"]
    },
    DataGrid: {
        title: "DataGrid",
        description: "Data grid with columns and rows.",
        previewWidth: 680,
        props: {
            columns: tableColumns,
            rows: tableRows,
            data: tableRows
        },
        controls: ["striped", "highlightOnHover", "density"]
    },
    Timeline: {
        title: "Timeline",
        description: "Static timeline with real events.",
        props: {
            items: [
                { title: "Project created", description: "Initial package structure was created.", time: "09:00" },
                { title: "Tokens added", description: "Design tokens were mapped.", time: "10:30" },
                { title: "Docs generated", description: "Component docs were generated.", time: "12:00" },
                { title: "Release checked", description: "Release gate validated package status.", time: "14:00" }
            ]
        },
        controls: []
    },
    TableOfContents: {
        title: "Table of contents",
        description: "Single active item preset.",
        props: {
            active: "usage",
            items: [
                { value: "usage", label: "Usage", href: "#usage" },
                { value: "variants", label: "Variants", href: "#variants" },
                { value: "props", label: "Props", href: "#props" }
            ]
        },
        controls: ["active"]
    },
    Toolbar: {
        title: "Toolbar",
        description: "Formatting toolbar with independent items.",
        props: {
            value: ["bold"],
            items: [
                { value: "bold", label: "Bold" },
                { value: "italic", label: "Italic" },
                { value: "link", label: "Link" }
            ]
        },
        controls: ["value"]
    },
    Modal: {
        title: "Modal",
        description: "Open modal with title, body, and actions.",
        props: {
            open: true,
            title: "Confirm release",
            description: "Review the release checklist before publishing."
        },
        controls: ["open", "size"]
    },
    Drawer: {
        title: "Drawer",
        description: "Open drawer with meaningful content.",
        props: {
            open: true,
            title: "Component details",
            description: "Drawer body contains documentation actions.",
            position: "right"
        },
        controls: ["open", "position", "size"]
    },
    Dialog: {
        title: "Dialog",
        description: "Dialog with title, body, and actions.",
        props: {
            open: true,
            title: "Delete component",
            description: "This action is only a documentation preview."
        },
        controls: ["open"]
    },
    ScrollArea: {
        title: "ScrollArea",
        description: "Fixed-height scrollable content.",
        previewWidth: 360,
        previewHeight: 220,
        props: {
            items: Array.from({ length: 18 }, (_, index) => ({ value: String(index + 1), label: `Scrollable item ${index + 1}` }))
        },
        controls: []
    },
    ScrollLock: {
        title: "ScrollLock",
        description: "Isolated scroll lock example. It must not lock the docs page.",
        previewWidth: 360,
        previewHeight: 220,
        props: {
            locked: true,
            isolated: true
        },
        controls: ["locked"]
    },
    Skeleton: {
        title: "Skeleton",
        description: "Visible skeleton layout.",
        previewWidth: 360,
        props: {
            animated: true,
            width: 320,
            height: 96,
            radius: "md"
        },
        controls: ["animated", "width", "height", "radius"]
    },
    Container: {
        title: "Container",
        description: "Container with nested surface content.",
        previewWidth: 520,
        props: {
            children: "Container content",
            size: "md"
        },
        controls: ["size"]
    },
    Flex: {
        title: "Flex",
        description: "Flex layout with three children.",
        previewWidth: 520,
        props: {
            gap: "md",
            align: "center",
            justify: "space-between",
            children: ["Alpha", "Beta", "Gamma"]
        },
        controls: ["gap", "align", "justify", "direction"]
    },
    Grid: {
        title: "Grid",
        description: "Grid layout with six cells.",
        previewWidth: 560,
        props: {
            columns: 3,
            children: ["One", "Two", "Three", "Four", "Five", "Six"]
        },
        controls: ["columns", "gap"]
    },
    Anchor: {
        title: "Anchor",
        description: "Safe anchor/link preview with href, label, children, and list-like fallback data.",
        props: {
            href: "/noctra/components",
            label: "Browse components",
            children: "Browse components",
            items: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            data: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            links: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            value: "/noctra/components"
        },
        controls: [
            "href",
            "children",
            "label",
            "disabled"
        ]
    },
    Avatar: {
        title: "Avatar",
        description: "Avatar with initials fallback and balanced size.",
        props: {
            src: "",
            alt: "Noctra user",
            fallback: "NC",
            children: "NC",
            size: "md"
        },
        controls: ["src", "alt", "fallback", "size", "radius"]
    },
    Clipboard: {
        title: "Clipboard",
        description: "Compact copy action with copied feedback.",
        previewWidth: 320,
        props: {
            value: "npm install @noctra/react",
            label: "Copy install command",
            copiedLabel: "Copied"
        },
        controls: ["value", "label", "disabled", "size"]
    },
    Code: {
        title: "Code",
        description: "Inline code preview with real code content.",
        props: {
            children: "pnpm add @noctra/react"
        },
        controls: ["children"]
    },
    ColorInput: {
        title: "Color input",
        description: "Compact color input with swatch and value.",
        previewWidth: 320,
        props: {
            value: "#7c3aed",
            placeholder: "Pick color",
            label: "Brand color"
        },
        controls: ["value", "placeholder", "disabled", "size", "radius"]
    },
    CreditCard: {
        title: "Credit card",
        description: "Reasonable card preview with realistic content.",
        previewWidth: 380,
        props: {
            number: "4242 4242 4242 4242",
            holder: "NOCTRA USER",
            expiry: "12/28",
            brand: "Visa"
        },
        controls: ["number", "holder", "expiry", "brand"]
    },
    FileInput: {
        title: "File input",
        description: "File input with array-based currentFiles shape.",
        previewWidth: 340,
        props: {
            placeholder: "Choose file",
            label: "Upload file",
            value: [],
            files: [
                {
                    name: "noctra-release-notes.md",
                    size: 12400,
                    type: "text/markdown"
                }
            ],
            currentFiles: [
                {
                    name: "noctra-release-notes.md",
                    size: 12400,
                    type: "text/markdown"
                }
            ],
            selectedFiles: [
                {
                    name: "noctra-release-notes.md",
                    size: 12400,
                    type: "text/markdown"
                }
            ]
        },
        controls: [
            "placeholder",
            "disabled",
            "size",
            "radius"
        ]
    },
    FloatLabel: {
        title: "Float label",
        description: "Floating label with focused and filled input state.",
        previewWidth: 340,
        props: {
            label: "Project name",
            value: "Noctra",
            placeholder: "Project name",
            focused: true
        },
        controls: ["label", "value", "placeholder", "disabled", "size", "radius"]
    },
    ResizablePanel: {
        title: "Resizable panel",
        description: "Two visible panels with a clear resize handle.",
        previewWidth: 560,
        previewHeight: 260,
        props: {
            panels: [
                { value: "left", label: "Navigation", size: 35 },
                { value: "right", label: "Preview", size: 65 }
            ],
            defaultSize: 35
        },
        controls: ["defaultSize", "disabled"]
    },
    SplitPane: {
        title: "Split pane",
        description: "Left and right panes with visible content.",
        previewWidth: 560,
        previewHeight: 260,
        props: {
            left: "Component list",
            right: "Component preview",
            defaultSize: 40
        },
        controls: ["defaultSize", "orientation"]
    },
    VisuallyHidden: {
        title: "Visually hidden",
        description: "Visible explanation for screen-reader-only content.",
        previewWidth: 420,
        props: {
            children: "This text is visually hidden but available to screen readers.",
            label: "Screen reader text"
        },
        controls: ["children", "label"]
    },
    Dock: {
        title: "Dock",
        description: "Dock with five app-like items.",
        previewWidth: 420,
        props: {
            items: [
                { value: "home", label: "Home" },
                { value: "docs", label: "Docs" },
                { value: "tokens", label: "Tokens" },
                { value: "theme", label: "Theme" },
                { value: "release", label: "Release" }
            ],
            value: "docs"
        },
        controls: ["value", "size"]
    },
    ClickOutside: {
        title: "Click outside",
        description: "Card closes when clicking outside the isolated preview area.",
        previewWidth: 360,
        props: {
            open: true,
            title: "Click outside demo",
            description: "Click inside to keep it open, outside to close."
        },
        controls: ["open"]
    },
    Hover: {
        title: "Hover",
        description: "Hover content must be fully readable.",
        props: {
            open: true,
            label: "Hover target",
            content: "Readable hover content"
        },
        controls: ["open", "label", "content"]
    },
    Tooltip: {
        title: "Tooltip",
        description: "Tooltip with readable content.",
        props: {
            open: true,
            label: "Hover me",
            content: "Tooltip content"
        },
        controls: ["open", "label", "content"]
    },
    HoverCard: {
        title: "Hover card",
        description: "Hover card with clear trigger and content.",
        previewWidth: 340,
        props: {
            open: true,
            label: "Noctra",
            title: "Noctra UI",
            description: "Premium React component system."
        },
        controls: ["open", "label", "title", "description"]
    },
    Popover: {
        title: "Popover",
        description: "Open popover with title and content.",
        previewWidth: 340,
        props: {
            open: true,
            label: "Open popover",
            title: "Popover title",
            content: "Popover content"
        },
        controls: ["open", "label", "title", "content"]
    },
    Breadcrumb: {
        title: "Breadcrumb",
        description: "Breadcrumb preview with non-empty items array.",
        props: {
            items: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            data: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            links: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            value: "button"
        },
        controls: []
    },
    Breadcrumbs: {
        title: "Breadcrumbs",
        description: "Breadcrumbs preview with non-empty items array.",
        props: {
            items: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            data: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            links: [
                {
                    label: "Docs",
                    href: "/noctra/"
                },
                {
                    label: "Components",
                    href: "/noctra/components"
                },
                {
                    label: "Button",
                    href: "/noctra/components/button"
                }
            ],
            value: "button"
        },
        controls: []
    },
    SegmentedControl: {
        title: "Segmented control",
        description: "Segmented control with data array and selected value.",
        previewWidth: 360,
        props: {
            value: "docs",
            defaultValue: "docs",
            data: [
                {
                    value: "overview",
                    label: "Overview"
                },
                {
                    value: "docs",
                    label: "Docs"
                },
                {
                    value: "api",
                    label: "API"
                }
            ],
            items: [
                {
                    value: "overview",
                    label: "Overview"
                },
                {
                    value: "docs",
                    label: "Docs"
                },
                {
                    value: "api",
                    label: "API"
                }
            ],
            options: [
                {
                    value: "overview",
                    label: "Overview"
                },
                {
                    value: "docs",
                    label: "Docs"
                },
                {
                    value: "api",
                    label: "API"
                }
            ]
        },
        controls: [
            "value",
            "disabled",
            "size",
            "radius"
        ]
    }
};
export const componentInteractiveDemoPresets = interactiveDemoPresets;
export const componentDemoPresets = interactiveDemoPresets;
export const componentPreviewPresets = interactiveDemoPresets;
export const componentSafePresets = interactiveDemoPresets;
export const safeInteractiveDemoPresets = interactiveDemoPresets;
export const realInteractiveDemoPresets = interactiveDemoPresets;
export const realDemoPresets = interactiveDemoPresets;
export function isRemovedInteractiveDemoComponent(component: string | {
    name: string;
}) {
    const componentName = typeof component === "string" ? component : component.name;
    return removedInteractiveDemoComponents.has(componentName);
}
export function hasInteractiveDemoPreset(component: string | {
    name: string;
}) {
    const componentName = typeof component === "string" ? component : component.name;
    return Object.prototype.hasOwnProperty.call(interactiveDemoPresets, componentName);
}
export function getInteractiveDemoPreset(component: string | {
    name: string;
}): any {
    const componentName = typeof component === "string" ? component : component.name;
    if (isRemovedInteractiveDemoComponent(componentName))
        return undefined;
    return interactiveDemoPresets[componentName];
}
export function getComponentInteractiveDemoPreset(componentName: string): any {
    return getInteractiveDemoPreset(componentName);
}
export function getComponentDemoPreset(componentName: string): any {
    return getInteractiveDemoPreset(componentName);
}
export function getSafeInteractiveDemoPreset(componentName: string): any {
    return getInteractiveDemoPreset(componentName);
}
type DemoComponentLike = {
    name: string;
    props?: readonly {
        name: string;
        type?: string;
        required?: boolean;
    }[];
    variants?: readonly string[];
    sizes?: readonly string[];
};
type DemoStateLike = Record<string, any>;
function getDemoComponentName(component: string | DemoComponentLike) {
    return typeof component === "string" ? component : component.name;
}
function getDemoComponentProps(component: string | DemoComponentLike) {
    return typeof component === "string" ? [] : component.props ?? [];
}
function normalizeDemoValue(value: any) {
    if (Array.isArray(value))
        return value;
    if (value && typeof value === "object")
        return value;
    return value;
}
function shouldRenderCodeProp(key: string, value: any) {
    if (value === undefined || value === null)
        return false;
    if (key === "children")
        return false;
    if (typeof value === "function")
        return false;
    if (Array.isArray(value) && value.length === 0)
        return false;
    if (typeof value === "object" && Object.keys(value).length === 0)
        return false;
    return true;
}
function formatCodeProp(key: string, value: any) {
    if (value === true)
        return key;
    if (value === false)
        return `${key}={false}`;
    if (typeof value === "number")
        return `${key}={${value}}`;
    if (typeof value === "string")
        return `${key}="${value.replace(/"/g, "&quot;")}"`;
    return `${key}={${JSON.stringify(value)}}`;
}
function hasRuntimeProp(component: string | DemoComponentLike, propName: string) {
    const preset = getInteractiveDemoPreset(component);
    const props = getDemoComponentProps(component);
    if (preset?.props && Object.prototype.hasOwnProperty.call(preset.props, propName))
        return true;
    if (preset?.state && Object.prototype.hasOwnProperty.call(preset.state, propName))
        return true;
    if (Array.isArray(preset?.controls) && ((preset.controls) as readonly unknown[]).includes(propName))
        return true;
    return props.some((prop) => prop.name === propName);
}
export function componentSupports(component: string | DemoComponentLike, propName: string) {
    return hasRuntimeProp(component, propName);
}
export function buildInteractiveDemoProps(component: string | DemoComponentLike, state: DemoStateLike = {}) {
    const componentName = getDemoComponentName(component);
    const preset = getInteractiveDemoPreset(componentName);
    const presetProps = preset?.props && typeof preset.props === "object" ? preset.props : {};
    const presetState = preset?.state && typeof preset.state === "object" ? preset.state : {};
    const nextProps: Record<string, any> = {
        ...presetProps,
        ...presetState,
        ...state
    };
    delete nextProps.children;
    delete nextProps.previewWidth;
    delete nextProps.previewHeight;
    delete nextProps.controls;
    for (const [key, value] of Object.entries(nextProps)) {
        nextProps[key] = normalizeDemoValue(value);
    }
    return nextProps;
}
export function getInteractiveDemoCode(component: string | DemoComponentLike, state: DemoStateLike = {}) {
    const componentName = getDemoComponentName(component);
    const preset = getInteractiveDemoPreset(componentName);
    const props = buildInteractiveDemoProps(component, state);
    const propCode = Object.entries(props)
        .filter(([key, value]) => shouldRenderCodeProp(key, value))
        .map(([key, value]) => formatCodeProp(key, value))
        .join(" ");
    const children = state.children ?? preset?.props?.children ?? preset?.children ?? `${componentName} content`;
    const openTag = propCode ? `<${componentName} ${propCode}>` : `<${componentName}>`;
    if (children === false || children === null || children === undefined) {
        return `import { ${componentName} } from "@noctra/react";

export function Demo() {
  return ${propCode ? `<${componentName} ${propCode} />` : `<${componentName} />`};
}`;
    }
    return `import { ${componentName} } from "@noctra/react";

export function Demo() {
  return (
    ${openTag}
      ${typeof children === "string" ? children : JSON.stringify(children)}
    </${componentName}>
  );
}`;
}
export function getComponentInteractiveDemoCode(component: string | DemoComponentLike, state: DemoStateLike = {}) {
    return getInteractiveDemoCode(component, state);
}
export function buildComponentInteractiveDemoProps(component: string | DemoComponentLike, state: DemoStateLike = {}) {
    return buildInteractiveDemoProps(component, state);
}
