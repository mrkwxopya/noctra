export type ComponentDocsExampleEntry = {
  code: string;
};

export const componentDocsExamplesMap = {
  "accordion": { code: "import { Accordion } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Accordion defaultValue=\"usage\">\n      <Accordion.Item value=\"usage\">Usage</Accordion.Item>\n    </Accordion>\n  );\n}\n" },
  "alert": { code: "import { Alert } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Alert tone=\"success\" title=\"Build passed\">All checks completed successfully.</Alert>;\n}\n" },
  "autocomplete": { code: "import { Autocomplete } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Autocomplete label=\"Framework\" data={[\"React\", \"Vue\", \"Svelte\"]} />;\n}\n" },
  "avatar": { code: "import { Avatar } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Avatar radius=\"full\">NC</Avatar>;\n}\n" },
  "badge": { code: "import { Badge } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Badge tone=\"primary\" variant=\"light\">Stable</Badge>;\n}\n" },
  "button": { code: "import { Button } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Button variant=\"filled\" tone=\"primary\" size=\"md\" radius=\"md\">\n      Save changes\n    </Button>\n  );\n}\n" },
  "card": { code: "import { Card, Button } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Card withBorder padding=\"md\" radius=\"lg\">\n      <Card.Header>Project status</Card.Header>\n      <Card.Body>Production-ready docs shell.</Card.Body>\n      <Card.Footer><Button>Open</Button></Card.Footer>\n    </Card>\n  );\n}\n" },
  "checkbox": { code: "import { Checkbox } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Checkbox label=\"Accept terms\" defaultChecked />;\n}\n" },
  "clipboard": { code: "import { Clipboard } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Clipboard value=\"npm install @noctra/react\">Copy install command</Clipboard>;\n}\n" },
  "color-picker": { code: "import { ColorPicker } from \"@noctra/react\";\n\nexport function Demo() {\n  return <ColorPicker defaultValue=\"#8b5cf6\" />;\n}\n" },
  "combobox": { code: "import { Combobox } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Combobox data={[\"Button\", \"Input\", \"Modal\"]} placeholder=\"Search component\" />;\n}\n" },
  "command": { code: "import { Command } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Command placeholder=\"Search commands\" />;\n}\n" },
  "command-bar": { code: "import { CommandBar } from \"@noctra/react\";\n\nexport function Demo() {\n  return <CommandBar placeholder=\"Type a command or search\" />;\n}\n" },
  "data-grid": { code: "import { DataGrid } from \"@noctra/react\";\n\nexport function Demo() {\n  return <DataGrid columns={[]} data={[]} stickyHeader />;\n}\n" },
  "drawer": { code: "import { Drawer } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Drawer opened title=\"Navigation\" onClose={() => {}}>Drawer content</Drawer>;\n}\n" },
  "dropzone": { code: "import { Dropzone } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Dropzone accept={[\"image/png\", \"image/jpeg\"]}>Drop files here</Dropzone>;\n}\n" },
  "grid": { code: "import { Grid } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Grid cols={3} gap=\"md\">\n      <div>One</div>\n      <div>Two</div>\n      <div>Three</div>\n    </Grid>\n  );\n}\n" },
  "group": { code: "import { Group, Button } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Group gap=\"sm\"><Button>Save</Button><Button variant=\"outline\">Cancel</Button></Group>;\n}\n" },
  "icon-button": { code: "import { IconButton } from \"@noctra/react\";\n\nexport function Demo() {\n  return <IconButton aria-label=\"Open settings\">⚙</IconButton>;\n}\n" },
  "input": { code: "import { Input } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Input placeholder=\"Enter value\" />;\n}\n" },
  "link": { code: "import { Link } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Link href=\"/docs\">Open documentation</Link>;\n}\n" },
  "list-box": { code: "import { ListBox } from \"@noctra/react\";\n\nexport function Demo() {\n  return <ListBox data={[\"Documentation\", \"Props\", \"Styles API\"]} />;\n}\n" },
  "menu": { code: "import { Menu, Button } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Menu>\n      <Menu.Target><Button>Actions</Button></Menu.Target>\n      <Menu.Dropdown>\n        <Menu.Item>Edit</Menu.Item>\n        <Menu.Item>Delete</Menu.Item>\n      </Menu.Dropdown>\n    </Menu>\n  );\n}\n" },
  "modal": { code: "import { Modal, Button } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Modal opened title=\"Confirm action\" onClose={() => {}}>\n      Modal content goes here.\n    </Modal>\n  );\n}\n" },
  "multi-select": { code: "import { MultiSelect } from \"@noctra/react\";\n\nexport function Demo() {\n  return <MultiSelect label=\"Features\" data={[\"Docs\", \"Tokens\", \"Themes\"]} />;\n}\n" },
  "native-select": { code: "import { NativeSelect } from \"@noctra/react\";\n\nexport function Demo() {\n  return <NativeSelect label=\"Density\" data={[\"Compact\", \"Default\", \"Comfortable\"]} />;\n}\n" },
  "notification": { code: "import { Notification } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Notification title=\"Saved\">Your changes were saved.</Notification>;\n}\n" },
  "number-input": { code: "import { NumberInput } from \"@noctra/react\";\n\nexport function Demo() {\n  return <NumberInput label=\"Quantity\" defaultValue={3} min={0} />;\n}\n" },
  "pagination": { code: "import { Pagination } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Pagination total={8} value={2} />;\n}\n" },
  "paper": { code: "import { Paper } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Paper withBorder padding=\"md\">Surface content</Paper>;\n}\n" },
  "password-input": { code: "import { PasswordInput } from \"@noctra/react\";\n\nexport function Demo() {\n  return <PasswordInput label=\"Password\" placeholder=\"Enter password\" />;\n}\n" },
  "popover": { code: "import { Popover, Button } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Popover opened>\n      <Popover.Target><Button>Open</Button></Popover.Target>\n      <Popover.Dropdown>Popover content</Popover.Dropdown>\n    </Popover>\n  );\n}\n" },
  "progress": { code: "import { Progress } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Progress value={72} tone=\"primary\" />;\n}\n" },
  "radio": { code: "import { Radio } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Radio label=\"Use default theme\" defaultChecked />;\n}\n" },
  "search-input": { code: "import { SearchInput } from \"@noctra/react\";\n\nexport function Demo() {\n  return <SearchInput placeholder=\"Search components\" />;\n}\n" },
  "segmented-control": { code: "import { SegmentedControl } from \"@noctra/react\";\n\nexport function Demo() {\n  return <SegmentedControl data={[\"Preview\", \"Code\", \"Props\"]} defaultValue=\"Preview\" />;\n}\n" },
  "select": { code: "import { Select } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Select\n      label=\"Library\"\n      placeholder=\"Pick one\"\n      data={[\"Noctra\", \"Mantine\", \"Radix\"]}\n      clearable\n    />\n  );\n}\n" },
  "slider": { code: "import { Slider } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Slider defaultValue={40} />;\n}\n" },
  "stack": { code: "import { Stack } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Stack gap=\"sm\"><div>First</div><div>Second</div></Stack>;\n}\n" },
  "status-bar": { code: "import { StatusBar } from \"@noctra/react\";\n\nexport function Demo() {\n  return <StatusBar items={[\"Ready\", \"3 warnings\", \"v0.0.0\"]} />;\n}\n" },
  "switch": { code: "import { Switch } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Switch label=\"Enable notifications\" defaultChecked />;\n}\n" },
  "table": { code: "import { Table } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Table striped highlightOnHover>\n      <thead><tr><th>Name</th><th>Status</th></tr></thead>\n      <tbody><tr><td>Noctra Docs</td><td>Ready</td></tr></tbody>\n    </Table>\n  );\n}\n" },
  "tabs": { code: "import { Tabs } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Tabs defaultValue=\"documentation\">\n      <Tabs.List>\n        <Tabs.Tab value=\"documentation\">Documentation</Tabs.Tab>\n        <Tabs.Tab value=\"props\">Props</Tabs.Tab>\n      </Tabs.List>\n      <Tabs.Panel value=\"documentation\">Usage content</Tabs.Panel>\n      <Tabs.Panel value=\"props\">Props content</Tabs.Panel>\n    </Tabs>\n  );\n}\n" },
  "tags-input": { code: "import { TagsInput } from \"@noctra/react\";\n\nexport function Demo() {\n  return <TagsInput label=\"Tags\" placeholder=\"Add tag\" data={[\"docs\", \"ui\", \"react\"]} />;\n}\n" },
  "text-input": { code: "import { TextInput } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <TextInput\n      label=\"Email\"\n      placeholder=\"name@example.com\"\n      description=\"Use your work email address\"\n    />\n  );\n}\n" },
  "textarea": { code: "import { Textarea } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Textarea label=\"Message\" placeholder=\"Write your message\" />;\n}\n" },
  "toast": { code: "import { Toast } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Toast tone=\"success\">Deployment completed</Toast>;\n}\n" },
  "toolbar": { code: "import { Toolbar, Button } from \"@noctra/react\";\n\nexport function Demo() {\n  return (\n    <Toolbar>\n      <Button>Save</Button>\n      <Button variant=\"outline\">Preview</Button>\n    </Toolbar>\n  );\n}\n" },
  "tooltip": { code: "import { Tooltip, Button } from \"@noctra/react\";\n\nexport function Demo() {\n  return <Tooltip label=\"Helpful information\"><Button>Hover me</Button></Tooltip>;\n}\n" }
} as const satisfies Record<string, ComponentDocsExampleEntry>;

export type ComponentDocsExampleSlug = keyof typeof componentDocsExamplesMap;

export function getComponentDocsExampleCode(slug: string): string | undefined {
  return (componentDocsExamplesMap as Record<string, ComponentDocsExampleEntry>)[slug]?.code;
}
