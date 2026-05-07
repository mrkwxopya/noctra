export type DocsSidebarLink = {
  label: string;
  href: string;
};

export type DocsSidebarSection = {
  title: string;
  links: readonly DocsSidebarLink[];
};

export const docsSidebarSections = [
  {
    "title": "Docs",
    "links": [
      {
        "label": "Overview",
        "href": "/"
      },
      {
        "label": "Components",
        "href": "/components"
      },
      {
        "label": "Architecture",
        "href": "/architecture"
      },
      {
        "label": "Theming",
        "href": "/theming"
      },
      {
        "label": "Tokens",
        "href": "/tokens"
      },
      {
        "label": "Quality",
        "href": "/quality"
      },
      {
        "label": "Release",
        "href": "/release"
      }
    ]
  },
  {
    "title": "Components",
    "links": [
      {
        "label": "Accordion",
        "href": "/components/accordion"
      },
      {
        "label": "Alert",
        "href": "/components/alert"
      },
      {
        "label": "App Shell",
        "href": "/components/app-shell"
      },
      {
        "label": "Aspect Ratio",
        "href": "/components/aspect-ratio"
      },
      {
        "label": "Autocomplete",
        "href": "/components/autocomplete"
      },
      {
        "label": "Avatar",
        "href": "/components/avatar"
      },
      {
        "label": "Badge",
        "href": "/components/badge"
      },
      {
        "label": "Blockquote",
        "href": "/components/blockquote"
      },
      {
        "label": "Box",
        "href": "/components/box"
      },
      {
        "label": "Breadcrumb",
        "href": "/components/breadcrumb"
      },
      {
        "label": "Button",
        "href": "/components/button"
      },
      {
        "label": "Card",
        "href": "/components/card"
      },
      {
        "label": "Center",
        "href": "/components/center"
      },
      {
        "label": "Checkbox",
        "href": "/components/checkbox"
      },
      {
        "label": "Clipboard",
        "href": "/components/clipboard"
      },
      {
        "label": "Code",
        "href": "/components/code"
      },
      {
        "label": "Color Input",
        "href": "/components/color-input"
      },
      {
        "label": "Color Picker",
        "href": "/components/color-picker"
      },
      {
        "label": "Combobox",
        "href": "/components/combobox"
      },
      {
        "label": "Command",
        "href": "/components/command"
      },
      {
        "label": "Container",
        "href": "/components/container"
      },
      {
        "label": "Context Menu",
        "href": "/components/context-menu"
      },
      {
        "label": "Credit Card",
        "href": "/components/credit-card"
      },
      {
        "label": "Data Grid",
        "href": "/components/data-grid"
      },
      {
        "label": "Dialog",
        "href": "/components/dialog"
      },
      {
        "label": "Divider",
        "href": "/components/divider"
      },
      {
        "label": "Dock",
        "href": "/components/dock"
      },
      {
        "label": "Drawer",
        "href": "/components/drawer"
      },
      {
        "label": "Dropzone",
        "href": "/components/dropzone"
      },
      {
        "label": "Empty State",
        "href": "/components/empty-state"
      },
      {
        "label": "Flex",
        "href": "/components/flex"
      },
      {
        "label": "Float Label",
        "href": "/components/float-label"
      },
      {
        "label": "Grid",
        "href": "/components/grid"
      },
      {
        "label": "Group",
        "href": "/components/group"
      },
      {
        "label": "Hover Card",
        "href": "/components/hover-card"
      },
      {
        "label": "Icon Button",
        "href": "/components/icon-button"
      },
      {
        "label": "Input",
        "href": "/components/input"
      },
      {
        "label": "Kbd",
        "href": "/components/kbd"
      },
      {
        "label": "Layout Shell",
        "href": "/components/layout-shell"
      },
      {
        "label": "Link",
        "href": "/components/link"
      },
      {
        "label": "List Box",
        "href": "/components/list-box"
      },
      {
        "label": "Loader",
        "href": "/components/loader"
      },
      {
        "label": "Menu",
        "href": "/components/menu"
      },
      {
        "label": "Modal",
        "href": "/components/modal"
      },
      {
        "label": "Multi Select",
        "href": "/components/multi-select"
      },
      {
        "label": "Native Select",
        "href": "/components/native-select"
      },
      {
        "label": "Notification",
        "href": "/components/notification"
      },
      {
        "label": "Number Input",
        "href": "/components/number-input"
      },
      {
        "label": "Pagination",
        "href": "/components/pagination"
      },
      {
        "label": "Paper",
        "href": "/components/paper"
      },
      {
        "label": "Password Input",
        "href": "/components/password-input"
      },
      {
        "label": "Pin Code",
        "href": "/components/pin-code"
      },
      {
        "label": "Popover",
        "href": "/components/popover"
      },
      {
        "label": "Progress",
        "href": "/components/progress"
      },
      {
        "label": "Radio",
        "href": "/components/radio"
      },
      {
        "label": "Range Slider",
        "href": "/components/range-slider"
      },
      {
        "label": "Rating",
        "href": "/components/rating"
      },
      {
        "label": "Scroll Area",
        "href": "/components/scroll-area"
      },
      {
        "label": "Search Input",
        "href": "/components/search-input"
      },
      {
        "label": "Segmented Control",
        "href": "/components/segmented-control"
      },
      {
        "label": "Select",
        "href": "/components/select"
      },
      {
        "label": "Simple Grid",
        "href": "/components/simple-grid"
      },
      {
        "label": "Skeleton",
        "href": "/components/skeleton"
      },
      {
        "label": "Slider",
        "href": "/components/slider"
      },
      {
        "label": "Spinner",
        "href": "/components/spinner"
      },
      {
        "label": "Stack",
        "href": "/components/stack"
      },
      {
        "label": "Stepper",
        "href": "/components/stepper"
      },
      {
        "label": "Switch",
        "href": "/components/switch"
      },
      {
        "label": "Table",
        "href": "/components/table"
      },
      {
        "label": "Tabs",
        "href": "/components/tabs"
      },
      {
        "label": "Tags Input",
        "href": "/components/tags-input"
      },
      {
        "label": "Text Input",
        "href": "/components/text-input"
      },
      {
        "label": "Textarea",
        "href": "/components/textarea"
      },
      {
        "label": "Timeline",
        "href": "/components/timeline"
      },
      {
        "label": "Toast",
        "href": "/components/toast"
      },
      {
        "label": "Toolbar",
        "href": "/components/toolbar"
      },
      {
        "label": "Tooltip",
        "href": "/components/tooltip"
      },
      {
        "label": "Transfer List",
        "href": "/components/transfer-list"
      },
      {
        "label": "Tree",
        "href": "/components/tree"
      },
      {
        "label": "Tree Select",
        "href": "/components/tree-select"
      },
      {
        "label": "Visually Hidden",
        "href": "/components/visually-hidden"
      }
    ]
  }
] as const satisfies readonly DocsSidebarSection[];

export const docsComponentLinks = docsSidebarSections.find((section) => section.title === "Components")?.links ?? [];

export default docsSidebarSections;
