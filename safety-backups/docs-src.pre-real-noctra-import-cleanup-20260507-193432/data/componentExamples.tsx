import type { ReactNode } from "react";
import { Box,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Section,
  Spacer,
  Stack } from "../components/docs-system/NoctraRuntimeMock";

export type ComponentExample = {
  id: string;
  title: string;
  description: string;
  code: string;
  preview: ReactNode;
};

export type ComponentExampleRegistry = Record<string, ComponentExample[]>;

function PreviewShell({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Paper>
      <Stack>
        <Group>
          <strong>{title}</strong>
          {description ? <span className="nd-preview-muted">{description}</span> : null}
        </Group>
        <Divider />
        {children}
      </Stack>
    </Paper>
  );
}

function MockField({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <label className="nd-mock-field">
      <span>{label}</span>
      <div>{value}</div>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function MockButton({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return <span className="nd-mock-button" data-muted={muted || undefined}>{children}</span>;
}

function MockBadge({ children, tone }: { children: ReactNode; tone?: string }) {
  return <span className="nd-mock-badge" data-tone={tone}>{children}</span>;
}

function MockPanel({ children }: { children: ReactNode }) {
  return <div className="nd-mock-panel">{children}</div>;
}

function MockRow({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="nd-mock-row">
      <span>{left}</span>
      {right ? <strong>{right}</strong> : null}
    </div>
  );
}

export const componentExamples: ComponentExampleRegistry = {
  Button: [
    {
      id: "button-basic",
      title: "Basic actions",
      description: "Primary and disabled action examples.",
      code: `import { Button, Group } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Group>
      <Button>Primary action</Button>
      <Button disabled>Disabled action</Button>
    </Group>
  );
}`,
      preview: (
        <Group>
          <Button>Primary action</Button>
          <Button disabled>Disabled action</Button>
        </Group>
      )
    },
    {
      id: "button-toolbar",
      title: "Toolbar actions",
      description: "A compact action row for headers, cards, and settings panels.",
      code: `import { Button, Group } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Group>
      <Button>Save changes</Button>
      <Button>Preview</Button>
      <Button disabled>Publish</Button>
    </Group>
  );
}`,
      preview: (
        <PreviewShell title="Toolbar">
          <Group>
            <Button>Save changes</Button>
            <Button>Preview</Button>
            <Button disabled>Publish</Button>
          </Group>
        </PreviewShell>
      )
    }
  ],

  Card: [
    {
      id: "card-product",
      title: "Product card",
      description: "A complete card composition with header, description, body, and footer.",
      code: `import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Noctra Card</CardTitle>
        <CardDescription>Composable surface for product UI.</CardDescription>
      </CardHeader>
      <CardBody>
        Use Card for dashboards, settings panels, docs blocks, and feature previews.
      </CardBody>
    </Card>
  );
}`,
      preview: (
        <Card>
          <CardHeader>
            <CardTitle>Noctra Card</CardTitle>
            <CardDescription>Composable surface for product UI.</CardDescription>
          </CardHeader>
          <CardBody>
            Use Card for dashboards, settings panels, docs blocks, and feature previews.
          </CardBody>
        </Card>
      )
    },
    {
      id: "card-metrics",
      title: "Metrics card",
      description: "A dashboard-style card for operational stats.",
      code: `import { Card, CardBody, Group, Stack } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Card>
      <CardBody>
        <Stack>
          <Group>
            <strong>Release health</strong>
            <span>Passing</span>
          </Group>
          <strong>417 checks</strong>
          <span>Final quality gate completed.</span>
        </Stack>
      </CardBody>
    </Card>
  );
}`,
      preview: (
        <Card>
          <CardBody>
            <Stack>
              <Group>
                <strong>Release health</strong>
                <MockBadge tone="success">Passing</MockBadge>
              </Group>
              <div className="nd-mock-number">417 checks</div>
              <span className="nd-preview-muted">Final quality gate completed.</span>
            </Stack>
          </CardBody>
        </Card>
      )
    }
  ],

  Paper: [
    {
      id: "paper-surface",
      title: "Elevated paper surface",
      description: "Paper provides a neutral low-level surface for layout and documentation panels.",
      code: `import { Paper, Stack, Divider } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Paper>
      <Stack>
        <strong>Paper surface</strong>
        <Divider />
        <span>Use Paper for simple bounded content regions.</span>
      </Stack>
    </Paper>
  );
}`,
      preview: (
        <Paper>
          <Stack>
            <strong>Paper surface</strong>
            <Divider />
            <span>Use Paper for simple bounded content regions.</span>
          </Stack>
        </Paper>
      )
    }
  ],

  Stack: [
    {
      id: "stack-spacing",
      title: "Vertical rhythm",
      description: "Stack controls vertical spacing for forms, documentation sections, and page blocks.",
      code: `import { Stack, Card } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Stack>
      <Card title="First item" description="Stacked content block." />
      <Card title="Second item" description="Consistent vertical rhythm." />
      <Card title="Third item" description="Composable layout primitive." />
    </Stack>
  );
}`,
      preview: (
        <Stack>
          <Card title="First item" description="Stacked content block." />
          <Card title="Second item" description="Consistent vertical rhythm." />
          <Card title="Third item" description="Composable layout primitive." />
        </Stack>
      )
    }
  ],

  Group: [
    {
      id: "group-toolbar",
      title: "Toolbar group",
      description: "Group aligns actions horizontally.",
      code: `import { Button, Group } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Group>
      <strong>Toolbar</strong>
      <Button>Save</Button>
      <Button>Preview</Button>
    </Group>
  );
}`,
      preview: (
        <Group>
          <strong>Toolbar</strong>
          <Button>Save</Button>
          <Button>Preview</Button>
        </Group>
      )
    }
  ],

  Grid: [
    {
      id: "grid-cards",
      title: "Responsive card grid",
      description: "Grid is used for dashboards, docs cards, settings surfaces, and feature layouts.",
      code: `import { Grid, Card } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Grid>
      <Card title="React" description="Component exports." />
      <Card title="Styles" description="CSS package." />
      <Card title="Tokens" description="Design variables." />
    </Grid>
  );
}`,
      preview: (
        <Grid>
          <Card title="React" description="Component exports." />
          <Card title="Styles" description="CSS package." />
          <Card title="Tokens" description="Design variables." />
        </Grid>
      )
    }
  ],

  Flex: [
    {
      id: "flex-wrap",
      title: "Flexible wrapping",
      description: "Flex is useful for small adaptive clusters where Grid is too strict.",
      code: `import { Box, Flex } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Flex>
      <Box>Alpha</Box>
      <Box>Beta</Box>
      <Box>Gamma</Box>
    </Flex>
  );
}`,
      preview: (
        <Flex>
          <Box>Alpha</Box>
          <Box>Beta</Box>
          <Box>Gamma</Box>
        </Flex>
      )
    }
  ],

  Box: [
    {
      id: "box-primitive",
      title: "Box primitive",
      description: "Box is the low-level escape hatch for surfaces, wrappers, and custom layouts.",
      code: `import { Box } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Box>
      Box can wrap any custom content while keeping Noctra tokens.
    </Box>
  );
}`,
      preview: (
        <Box>
          Box can wrap any custom content while keeping Noctra tokens.
        </Box>
      )
    }
  ],

  Divider: [
    {
      id: "divider-labeled",
      title: "Labeled divider",
      description: "Divider separates content regions and can include a label.",
      code: `import { Divider, Stack } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Stack>
      <span>Before</span>
      <Divider label="Section break" />
      <span>After</span>
    </Stack>
  );
}`,
      preview: (
        <Stack>
          <span>Before</span>
          <Divider label="Section break" />
          <span>After</span>
        </Stack>
      )
    }
  ],

  Spacer: [
    {
      id: "spacer-inline",
      title: "Controlled spacing",
      description: "Spacer adds explicit layout breathing room without one-off margins.",
      code: `import { Group, Spacer, Box } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Group>
      <Box>Left</Box>
      <Spacer />
      <Box>Right</Box>
    </Group>
  );
}`,
      preview: (
        <Group>
          <Box>Left</Box>
          <Spacer />
          <Box>Right</Box>
        </Group>
      )
    }
  ],

  Section: [
    {
      id: "section-docs",
      title: "Documentation section",
      description: "Section provides a semantic content region with title and description.",
      code: `import { Card, Grid, Section } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Section title="Section title" description="Use Section for meaningful regions inside a page.">
      <Grid>
        <Card title="Overview" description="High-level content." />
        <Card title="Details" description="Supporting content." />
      </Grid>
    </Section>
  );
}`,
      preview: (
        <Section title="Section title" description="Use Section for meaningful regions inside a page.">
          <Grid>
            <Card title="Overview" description="High-level content." />
            <Card title="Details" description="Supporting content." />
          </Grid>
        </Section>
      )
    }
  ],

  Alert: [
    {
      id: "alert-status",
      title: "Status alert",
      description: "Communicate success, warning, danger, or information states.",
      code: `import { Alert } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Alert title="Build passed" tone="success">
      All release checks completed successfully.
    </Alert>
  );
}`,
      preview: (
        <PreviewShell title="Alert preview">
          <MockPanel>
            <MockBadge tone="success">Success</MockBadge>
            <strong>Build passed</strong>
            <span>All release checks completed successfully.</span>
          </MockPanel>
        </PreviewShell>
      )
    }
  ],

  Badge: [
    {
      id: "badge-tones",
      title: "Badge tones",
      description: "Small status indicators for tables, cards, and headers.",
      code: `import { Badge, Group } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Group>
      <Badge tone="success">Published</Badge>
      <Badge tone="warning">Draft</Badge>
      <Badge tone="danger">Blocked</Badge>
    </Group>
  );
}`,
      preview: (
        <Group>
          <MockBadge tone="success">Published</MockBadge>
          <MockBadge tone="warning">Draft</MockBadge>
          <MockBadge tone="danger">Blocked</MockBadge>
        </Group>
      )
    }
  ],

  TextInput: [
    {
      id: "text-input-form",
      title: "Text input field",
      description: "Common text input pattern with label, value, and helper copy.",
      code: `import { TextInput, Stack } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Stack>
      <TextInput label="Project name" placeholder="Noctra" />
      <TextInput label="Package scope" placeholder="@noctra" />
    </Stack>
  );
}`,
      preview: (
        <PreviewShell title="Form fields">
          <Stack>
            <MockField label="Project name" value="Noctra" hint="Public package display name." />
            <MockField label="Package scope" value="@noctra" hint="Used for npm package namespace." />
          </Stack>
        </PreviewShell>
      )
    }
  ],

  Textarea: [
    {
      id: "textarea-content",
      title: "Textarea content",
      description: "Long-form input for descriptions, issue notes, and release summaries.",
      code: `import { Textarea } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Textarea
      label="Release summary"
      placeholder="Describe what changed in this release..."
    />
  );
}`,
      preview: (
        <PreviewShell title="Textarea preview">
          <label className="nd-mock-field">
            <span>Release summary</span>
            <div className="nd-mock-textarea">Describe what changed in this release...</div>
          </label>
        </PreviewShell>
      )
    }
  ],

  Select: [
    {
      id: "select-status",
      title: "Select field",
      description: "Choice input for state, filters, and settings.",
      code: `import { Select } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Select
      label="Release channel"
      placeholder="Select channel"
      options={[
        { value: "alpha", label: "Alpha" },
        { value: "beta", label: "Beta" },
        { value: "stable", label: "Stable" }
      ]}
    />
  );
}`,
      preview: (
        <PreviewShell title="Select preview">
          <MockField label="Release channel" value="Alpha" hint="Select channel" />
        </PreviewShell>
      )
    }
  ],

  Checkbox: [
    {
      id: "checkbox-settings",
      title: "Checkbox settings",
      description: "Use checkboxes for independent boolean options.",
      code: `import { Checkbox, Stack } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Stack>
      <Checkbox label="Enable docs search" />
      <Checkbox label="Include release reports" />
    </Stack>
  );
}`,
      preview: (
        <PreviewShell title="Checkbox preview">
          <Stack>
            <MockRow left="☑ Enable docs search" />
            <MockRow left="☐ Include release reports" />
          </Stack>
        </PreviewShell>
      )
    }
  ],

  Switch: [
    {
      id: "switch-settings",
      title: "Switch settings",
      description: "Switches communicate immediate on/off configuration.",
      code: `import { Switch, Stack } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Stack>
      <Switch label="Dark mode" checked />
      <Switch label="Reduced motion" />
    </Stack>
  );
}`,
      preview: (
        <PreviewShell title="Switch preview">
          <Stack>
            <MockRow left="Dark mode" right="On" />
            <MockRow left="Reduced motion" right="Off" />
          </Stack>
        </PreviewShell>
      )
    }
  ],

  Radio: [
    {
      id: "radio-options",
      title: "Radio options",
      description: "Use radio controls for mutually exclusive choices.",
      code: `import { Radio, Stack } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Stack>
      <Radio label="Compact density" name="density" />
      <Radio label="Default density" name="density" />
      <Radio label="Comfortable density" name="density" />
    </Stack>
  );
}`,
      preview: (
        <PreviewShell title="Radio preview">
          <Stack>
            <MockRow left="○ Compact density" />
            <MockRow left="● Default density" />
            <MockRow left="○ Comfortable density" />
          </Stack>
        </PreviewShell>
      )
    }
  ],

  Modal: [
    {
      id: "modal-confirm",
      title: "Confirmation modal",
      description: "Modal surfaces should focus attention on a blocking decision or short form.",
      code: `import { Button, Modal } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Modal open title="Publish package">
      Confirm that all release gates passed before publishing.
      <Button>Publish</Button>
    </Modal>
  );
}`,
      preview: (
        <PreviewShell title="Modal preview">
          <div className="nd-mock-modal">
            <strong>Publish package</strong>
            <span>Confirm that all release gates passed before publishing.</span>
            <Group>
              <MockButton muted>Cancel</MockButton>
              <MockButton>Publish</MockButton>
            </Group>
          </div>
        </PreviewShell>
      )
    }
  ],

  Drawer: [
    {
      id: "drawer-settings",
      title: "Settings drawer",
      description: "Drawers are useful for secondary panels that preserve page context.",
      code: `import { Drawer } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Drawer open title="Component settings">
      Configure density, radius, tone, and variant.
    </Drawer>
  );
}`,
      preview: (
        <PreviewShell title="Drawer preview">
          <div className="nd-mock-drawer">
            <strong>Component settings</strong>
            <span>Configure density, radius, tone, and variant.</span>
          </div>
        </PreviewShell>
      )
    }
  ],

  Tabs: [
    {
      id: "tabs-docs",
      title: "Docs tabs",
      description: "Tabs organize related panels without leaving the current route.",
      code: `import { Tabs } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Tabs
      items={[
        { value: "preview", label: "Preview", content: "Live preview" },
        { value: "code", label: "Code", content: "Source code" },
        { value: "props", label: "Props", content: "API table" }
      ]}
    />
  );
}`,
      preview: (
        <PreviewShell title="Tabs preview">
          <div className="nd-mock-tabs">
            <span data-active>Preview</span>
            <span>Code</span>
            <span>Props</span>
          </div>
          <MockPanel>Live preview panel</MockPanel>
        </PreviewShell>
      )
    }
  ],

  Table: [
    {
      id: "table-api",
      title: "API table",
      description: "Tables are used for props, tokens, release reports, and package metadata.",
      code: `import { Table } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Table
      columns={["Package", "Status"]}
      rows={[
        ["../components/docs-system/NoctraRuntimeMock", "Ready"],
        ["@noctra/styles", "Ready"]
      ]}
    />
  );
}`,
      preview: (
        <PreviewShell title="Table preview">
          <table className="nd-mock-table">
            <thead>
              <tr><th>Package</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>@noctra/react</td><td>Ready</td></tr>
              <tr><td>@noctra/styles</td><td>Ready</td></tr>
            </tbody>
          </table>
        </PreviewShell>
      )
    }
  ],

  Accordion: [
    {
      id: "accordion-faq",
      title: "Accordion FAQ",
      description: "Accordions reveal secondary information while keeping pages compact.",
      code: `import { Accordion } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Accordion
      items={[
        { value: "install", label: "Install", content: "Install @noctra/react and @noctra/styles." },
        { value: "theme", label: "Theme", content: "Override CSS variables." }
      ]}
    />
  );
}`,
      preview: (
        <PreviewShell title="Accordion preview">
          <Stack>
            <MockRow left="▾ Install" />
            <MockPanel>Install @noctra/react and @noctra/styles.</MockPanel>
            <MockRow left="▸ Theme" />
          </Stack>
        </PreviewShell>
      )
    }
  ],

  Tooltip: [
    {
      id: "tooltip-help",
      title: "Tooltip help",
      description: "Tooltips provide short contextual help for controls.",
      code: `import { Button, Tooltip } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Tooltip label="Copy import statement">
      <Button>Copy</Button>
    </Tooltip>
  );
}`,
      preview: (
        <PreviewShell title="Tooltip preview">
          <Group>
            <MockButton>Copy</MockButton>
            <span className="nd-mock-tooltip">Copy import statement</span>
          </Group>
        </PreviewShell>
      )
    }
  ],

  Progress: [
    {
      id: "progress-release",
      title: "Release progress",
      description: "Progress communicates completion for tasks and workflows.",
      code: `import { Progress } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return <Progress value={72} label="Release readiness" />;
}`,
      preview: (
        <PreviewShell title="Progress preview">
          <div className="nd-mock-progress">
            <span style={{ width: "72%" }} />
          </div>
          <span className="nd-preview-muted">Release readiness: 72%</span>
        </PreviewShell>
      )
    }
  ],

  Skeleton: [
    {
      id: "skeleton-loading",
      title: "Loading skeleton",
      description: "Skeletons reserve layout space while async content loads.",
      code: `import { Skeleton, Stack } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Stack>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Stack>
  );
}`,
      preview: (
        <PreviewShell title="Skeleton preview">
          <Stack>
            <span className="nd-mock-skeleton" />
            <span className="nd-mock-skeleton" />
            <span className="nd-mock-skeleton" />
          </Stack>
        </PreviewShell>
      )
    }
  ],

  CodeBlock: [
    {
      id: "code-block-example",
      title: "Code example",
      description: "CodeBlock renders copyable or readable code examples in docs.",
      code: `import { CodeBlock } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return <CodeBlock code={'import { Button } from "../components/docs-system/NoctraRuntimeMock";'} />;
}`,
      preview: (
        <PreviewShell title="Inline code example">
          <pre className="nd-code"><code>{`import { Button } from "../components/docs-system/NoctraRuntimeMock";`}</code></pre>
        </PreviewShell>
      )
    }
  ]
};


const docsAuditSupplementalExamples: ComponentExampleRegistry = {
  Loader: [
    {
      id: "loader-inline",
      title: "Inline loading",
      description: "Use Loader to communicate pending asynchronous work.",
      code: `import { Loader } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return <Loader label="Loading package metadata..." />;
}`,
      preview: (
        <PreviewShell title="Loader preview">
          <Group>
            <span className="nd-mock-loader" />
            <span className="nd-preview-muted">Loading package metadata...</span>
          </Group>
        </PreviewShell>
      )
    }
  ],

  EmptyState: [
    {
      id: "empty-state-docs",
      title: "Empty documentation state",
      description: "Use EmptyState when a page or collection has no content yet.",
      code: `import { EmptyState } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <EmptyState
      title="No examples yet"
      description="Add curated examples to improve this component page."
    />
  );
}`,
      preview: (
        <PreviewShell title="Empty state preview">
          <MockPanel>
            <strong>No examples yet</strong>
            <span>Add curated examples to improve this component page.</span>
            <MockButton>Add example</MockButton>
          </MockPanel>
        </PreviewShell>
      )
    }
  ],

  Pagination: [
    {
      id: "pagination-basic",
      title: "Pagination controls",
      description: "Use Pagination to move across paged data or documentation lists.",
      code: `import { Pagination } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return <Pagination page={2} total={8} />;
}`,
      preview: (
        <PreviewShell title="Pagination preview">
          <Group>
            <MockButton muted>Previous</MockButton>
            <MockBadge>1</MockBadge>
            <MockBadge tone="success">2</MockBadge>
            <MockBadge>3</MockBadge>
            <MockButton>Next</MockButton>
          </Group>
        </PreviewShell>
      )
    }
  ],

  Menu: [
    {
      id: "menu-actions",
      title: "Action menu",
      description: "Use Menu for grouped actions in cards, tables, and toolbars.",
      code: `import { Menu } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <Menu
      items={[
        { value: "copy", label: "Copy import" },
        { value: "open", label: "Open docs" }
      ]}
    />
  );
}`,
      preview: (
        <PreviewShell title="Menu preview">
          <MockPanel>
            <MockRow left="Copy import" />
            <MockRow left="Open docs" />
          </MockPanel>
        </PreviewShell>
      )
    }
  ]
};

for (const [componentName, examples] of Object.entries(docsAuditSupplementalExamples)) {
  componentExamples[componentName] = componentExamples[componentName] ?? examples;
}

export function getComponentExamples(componentName: string): ComponentExample[] {
  return componentExamples[componentName] ?? [];
}

export function getFallbackExample(componentName: string): ComponentExample {
  return {
    id: `${componentName}-fallback`,
    title: "Basic generated example",
    description: "This component does not have a curated showcase example yet. The generated usage block documents the import pattern and baseline JSX shape.",
    code: `import { ${componentName} } from "../components/docs-system/NoctraRuntimeMock";

export function Example() {
  return (
    <${componentName}>
      ${componentName} content
    </${componentName}>
  );
}`,
    preview: (
      <Card>
        <CardHeader>
          <CardTitle>{componentName}</CardTitle>
          <CardDescription>Curated live preview is not added yet.</CardDescription>
        </CardHeader>
        <CardBody>
          Add a component-specific example to <code>componentExamples.tsx</code>.
        </CardBody>
      </Card>
    )
  };
}
