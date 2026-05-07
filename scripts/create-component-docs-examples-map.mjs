import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const examplesPath = "apps/docs/src/data/componentDocsExamplesMap.ts";
const reportPath = "component-docs-examples-map-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const beforePage = readText(pagePath);
const beforeExamples = readText(examplesPath);

const examples = {
  button: [
    'import { Button } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    '    <Button variant="filled" tone="primary" size="md" radius="md">',
    "      Save changes",
    "    </Button>",
    "  );",
    "}"
  ],
  "icon-button": [
    'import { IconButton } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <IconButton aria-label=\"Open settings\">⚙</IconButton>;",
    "}"
  ],
  clipboard: [
    'import { Clipboard } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Clipboard value=\"npm install @noctra/react\">Copy install command</Clipboard>;",
    "}"
  ],
  link: [
    'import { Link } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Link href=\"/docs\">Open documentation</Link>;",
    "}"
  ],
  toolbar: [
    'import { Toolbar, Button } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Toolbar>",
    "      <Button>Save</Button>",
    "      <Button variant=\"outline\">Preview</Button>",
    "    </Toolbar>",
    "  );",
    "}"
  ],
  command: [
    'import { Command } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Command placeholder=\"Search commands\" />;",
    "}"
  ],
  "command-bar": [
    'import { CommandBar } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <CommandBar placeholder=\"Type a command or search\" />;",
    "}"
  ],
  input: [
    'import { Input } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Input placeholder=\"Enter value\" />;",
    "}"
  ],
  "text-input": [
    'import { TextInput } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <TextInput",
    "      label=\"Email\"",
    "      placeholder=\"name@example.com\"",
    "      description=\"Use your work email address\"",
    "    />",
    "  );",
    "}"
  ],
  textarea: [
    'import { Textarea } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Textarea label=\"Message\" placeholder=\"Write your message\" />;",
    "}"
  ],
  "password-input": [
    'import { PasswordInput } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <PasswordInput label=\"Password\" placeholder=\"Enter password\" />;",
    "}"
  ],
  "number-input": [
    'import { NumberInput } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <NumberInput label=\"Quantity\" defaultValue={3} min={0} />;",
    "}"
  ],
  "search-input": [
    'import { SearchInput } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <SearchInput placeholder=\"Search components\" />;",
    "}"
  ],
  autocomplete: [
    'import { Autocomplete } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Autocomplete label=\"Framework\" data={[\"React\", \"Vue\", \"Svelte\"]} />;",
    "}"
  ],
  "tags-input": [
    'import { TagsInput } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <TagsInput label=\"Tags\" placeholder=\"Add tag\" data={[\"docs\", \"ui\", \"react\"]} />;",
    "}"
  ],
  select: [
    'import { Select } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Select",
    "      label=\"Library\"",
    "      placeholder=\"Pick one\"",
    "      data={[\"Noctra\", \"Mantine\", \"Radix\"]}",
    "      clearable",
    "    />",
    "  );",
    "}"
  ],
  "multi-select": [
    'import { MultiSelect } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <MultiSelect label=\"Features\" data={[\"Docs\", \"Tokens\", \"Themes\"]} />;",
    "}"
  ],
  "native-select": [
    'import { NativeSelect } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <NativeSelect label=\"Density\" data={[\"Compact\", \"Default\", \"Comfortable\"]} />;",
    "}"
  ],
  combobox: [
    'import { Combobox } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Combobox data={[\"Button\", \"Input\", \"Modal\"]} placeholder=\"Search component\" />;",
    "}"
  ],
  "list-box": [
    'import { ListBox } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <ListBox data={[\"Documentation\", \"Props\", \"Styles API\"]} />;",
    "}"
  ],
  "segmented-control": [
    'import { SegmentedControl } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <SegmentedControl data={[\"Preview\", \"Code\", \"Props\"]} defaultValue=\"Preview\" />;",
    "}"
  ],
  modal: [
    'import { Modal, Button } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Modal opened title=\"Confirm action\" onClose={() => {}}>",
    "      Modal content goes here.",
    "    </Modal>",
    "  );",
    "}"
  ],
  drawer: [
    'import { Drawer } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Drawer opened title=\"Navigation\" onClose={() => {}}>Drawer content</Drawer>;",
    "}"
  ],
  popover: [
    'import { Popover, Button } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Popover opened>",
    "      <Popover.Target><Button>Open</Button></Popover.Target>",
    "      <Popover.Dropdown>Popover content</Popover.Dropdown>",
    "    </Popover>",
    "  );",
    "}"
  ],
  tooltip: [
    'import { Tooltip, Button } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Tooltip label=\"Helpful information\"><Button>Hover me</Button></Tooltip>;",
    "}"
  ],
  menu: [
    'import { Menu, Button } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Menu>",
    "      <Menu.Target><Button>Actions</Button></Menu.Target>",
    "      <Menu.Dropdown>",
    "        <Menu.Item>Edit</Menu.Item>",
    "        <Menu.Item>Delete</Menu.Item>",
    "      </Menu.Dropdown>",
    "    </Menu>",
    "  );",
    "}"
  ],
  card: [
    'import { Card, Button } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Card withBorder padding=\"md\" radius=\"lg\">",
    "      <Card.Header>Project status</Card.Header>",
    "      <Card.Body>Production-ready docs shell.</Card.Body>",
    "      <Card.Footer><Button>Open</Button></Card.Footer>",
    "    </Card>",
    "  );",
    "}"
  ],
  paper: [
    'import { Paper } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Paper withBorder padding=\"md\">Surface content</Paper>;",
    "}"
  ],
  alert: [
    'import { Alert } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Alert tone=\"success\" title=\"Build passed\">All checks completed successfully.</Alert>;",
    "}"
  ],
  notification: [
    'import { Notification } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Notification title=\"Saved\">Your changes were saved.</Notification>;",
    "}"
  ],
  toast: [
    'import { Toast } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Toast tone=\"success\">Deployment completed</Toast>;",
    "}"
  ],
  badge: [
    'import { Badge } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Badge tone=\"primary\" variant=\"light\">Stable</Badge>;",
    "}"
  ],
  table: [
    'import { Table } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Table striped highlightOnHover>",
    "      <thead><tr><th>Name</th><th>Status</th></tr></thead>",
    "      <tbody><tr><td>Noctra Docs</td><td>Ready</td></tr></tbody>",
    "    </Table>",
    "  );",
    "}"
  ],
  "data-grid": [
    'import { DataGrid } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <DataGrid columns={[]} data={[]} stickyHeader />;",
    "}"
  ],
  tabs: [
    'import { Tabs } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Tabs defaultValue=\"documentation\">",
    "      <Tabs.List>",
    "        <Tabs.Tab value=\"documentation\">Documentation</Tabs.Tab>",
    "        <Tabs.Tab value=\"props\">Props</Tabs.Tab>",
    "      </Tabs.List>",
    "      <Tabs.Panel value=\"documentation\">Usage content</Tabs.Panel>",
    "      <Tabs.Panel value=\"props\">Props content</Tabs.Panel>",
    "    </Tabs>",
    "  );",
    "}"
  ],
  grid: [
    'import { Grid } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Grid cols={3} gap=\"md\">",
    "      <div>One</div>",
    "      <div>Two</div>",
    "      <div>Three</div>",
    "    </Grid>",
    "  );",
    "}"
  ],
  stack: [
    'import { Stack } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Stack gap=\"sm\"><div>First</div><div>Second</div></Stack>;",
    "}"
  ],
  group: [
    'import { Group, Button } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Group gap=\"sm\"><Button>Save</Button><Button variant=\"outline\">Cancel</Button></Group>;",
    "}"
  ],
  checkbox: [
    'import { Checkbox } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Checkbox label=\"Accept terms\" defaultChecked />;",
    "}"
  ],
  radio: [
    'import { Radio } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Radio label=\"Use default theme\" defaultChecked />;",
    "}"
  ],
  switch: [
    'import { Switch } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Switch label=\"Enable notifications\" defaultChecked />;",
    "}"
  ],
  progress: [
    'import { Progress } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Progress value={72} tone=\"primary\" />;",
    "}"
  ],
  slider: [
    'import { Slider } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Slider defaultValue={40} />;",
    "}"
  ],
  avatar: [
    'import { Avatar } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Avatar radius=\"full\">NC</Avatar>;",
    "}"
  ],
  pagination: [
    'import { Pagination } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Pagination total={8} value={2} />;",
    "}"
  ],
  accordion: [
    'import { Accordion } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return (",
    "    <Accordion defaultValue=\"usage\">",
    "      <Accordion.Item value=\"usage\">Usage</Accordion.Item>",
    "    </Accordion>",
    "  );",
    "}"
  ],
  dropzone: [
    'import { Dropzone } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <Dropzone accept={[\"image/png\", \"image/jpeg\"]}>Drop files here</Dropzone>;",
    "}"
  ],
  "color-picker": [
    'import { ColorPicker } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <ColorPicker defaultValue=\"#8b5cf6\" />;",
    "}"
  ],
  "status-bar": [
    'import { StatusBar } from "@noctra/react";',
    "",
    "export function Demo() {",
    "  return <StatusBar items={[\"Ready\", \"3 warnings\", \"v0.0.0\"]} />;",
    "}"
  ]
};

function codeValue(lines) {
  return `${lines.join("\n")}\n`;
}

const entries = Object.entries(examples)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([slug, lines]) => `  ${JSON.stringify(slug)}: { code: ${JSON.stringify(codeValue(lines))} }`)
  .join(",\n");

const examplesContent = `export type ComponentDocsExampleEntry = {
  code: string;
};

export const componentDocsExamplesMap = {
${entries}
} as const satisfies Record<string, ComponentDocsExampleEntry>;

export type ComponentDocsExampleSlug = keyof typeof componentDocsExamplesMap;

export function getComponentDocsExampleCode(slug: string): string | undefined {
  return (componentDocsExamplesMap as Record<string, ComponentDocsExampleEntry>)[slug]?.code;
}
`;

let page = beforePage;

const importLine = 'import { getComponentDocsExampleCode } from "../data/componentDocsExamplesMap";';

if (!page.includes(importLine)) {
  if (page.includes('import { getComponentDocsApiEntry } from "../data/componentDocsApiMap";')) {
    page = page.replace(
      'import { getComponentDocsApiEntry } from "../data/componentDocsApiMap";',
      `import { getComponentDocsApiEntry } from "../data/componentDocsApiMap";\n${importLine}`
    );
  } else {
    const lastImport = [...page.matchAll(/^import .*?;$/gm)].at(-1);

    if (!lastImport) {
      throw new Error("Could not find import insertion point.");
    }

    const insertAt = lastImport.index + lastImport[0].length;
    page = `${page.slice(0, insertAt)}\n${importLine}${page.slice(insertAt)}`;
  }
}

if (!page.includes("const mappedExample = getComponentDocsExampleCode(slug);")) {
  page = page.replace(
    /function buildCode\(slug: string, label: string, state: VisualState\) \{\s*\n\s*const name = pascalCase\(slug\);/,
    `function buildCode(slug: string, label: string, state: VisualState) {
  const mappedExample = getComponentDocsExampleCode(slug);

  if (mappedExample) {
    return mappedExample;
  }

  const name = pascalCase(slug);`
  );
}

writeText(examplesPath, examplesContent);
writeText(pagePath, page);

const afterPage = readText(pagePath);
const afterExamples = readText(examplesPath);

const problems = [];

const keyCount = (afterExamples.match(/^\s{2}"?[a-z0-9-]+"?: \{ code:/gm) ?? []).length;

for (const required of [
  "export const componentDocsExamplesMap",
  "export function getComponentDocsExampleCode",
  "button",
  "text-input",
  "select",
  "modal",
  "card",
  "table",
  "tabs",
  "dropzone",
  "color-picker",
  "status-bar"
]) {
  if (!afterExamples.includes(required)) {
    problems.push(`Missing examples map marker: ${required}`);
  }
}

for (const required of [
  importLine,
  "const mappedExample = getComponentDocsExampleCode(slug);",
  "if (mappedExample)",
  "return mappedExample;"
]) {
  if (!afterPage.includes(required)) {
    problems.push(`Missing UniversalComponentDocPage example integration marker: ${required}`);
  }
}

if (keyCount < 40) {
  problems.push(`Examples map key count too low: ${keyCount}`);
}

for (const [file, source, kind] of [
  [examplesPath, afterExamples, ts.ScriptKind.TS],
  [pagePath, afterPage, ts.ScriptKind.TSX]
]) {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    kind
  );

  for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Component Docs Examples Map Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `UniversalComponentDocPage changed: ${beforePage === afterPage ? "no" : "yes"}`,
  `componentDocsExamplesMap changed: ${beforeExamples === afterExamples ? "no" : "yes"}`,
  `Examples key count: ${keyCount}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added componentDocsExamplesMap.ts as central component-specific code example source.",
  "- Integrated getComponentDocsExampleCode into buildCode fallback flow.",
  "- Added component-specific code examples for core buttons, fields, selections, overlays, surfaces, data, layout, feedback and special components.",
  "- Kept existing category-aware buildCode fallback for unmapped components."
].join("\n");

writeText(reportPath, report);

console.log(`Component docs examples map completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Component docs examples map failed.");
}
