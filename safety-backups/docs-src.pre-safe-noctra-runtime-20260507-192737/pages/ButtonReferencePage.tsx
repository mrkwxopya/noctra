import {
  createElement,
  useMemo,
  useState,
  type ComponentType,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from "react";
import * as NoctraReact from "@noctra/react";
import {
  NoctraCodeBlock,
  NoctraDocsBooleanControl,
  NoctraDocsControlGroup,
  NoctraDocsDemo,
  NoctraDocsExampleCard,
  NoctraDocsExampleGrid,
  NoctraDocsPage,
  NoctraDocsPreviousNext,
  NoctraDocsPropsPanel,
  NoctraDocsSection,
  NoctraDocsSimpleTable,
  NoctraDocsStylesApiPanel,
  type NoctraDocsPropRow
} from "../components/docs-system";
import { getPropDescription } from "../data/propDescriptions";
import type { NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";
import { docsHref } from "../lib/docsRouting";

type ButtonVariant = "filled" | "light" | "outline" | "subtle" | "ghost";
type ButtonTone = "primary" | "neutral" | "success" | "warning" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";

type ButtonPlaygroundState = {
  children: string;
  variant: ButtonVariant;
  tone: ButtonTone;
  size: ButtonSize;
  radius: ButtonRadius;
  disabled: boolean;
  loading: boolean;
};

const ButtonRuntime = NoctraReact.Button as ComponentType<Record<string, unknown>>;

const defaultButtonState: ButtonPlaygroundState = {
  children: "Button",
  variant: "filled",
  tone: "primary",
  size: "md",
  radius: "md",
  disabled: false,
  loading: false
};

const variants = ["filled", "light", "outline", "subtle", "ghost"] as const satisfies readonly ButtonVariant[];
const tones = ["primary", "neutral", "success", "warning", "danger"] as const satisfies readonly ButtonTone[];
const sizes = ["xs", "sm", "md", "lg", "xl"] as const satisfies readonly ButtonSize[];
const radii = ["none", "sm", "md", "lg", "xl", "full"] as const satisfies readonly ButtonRadius[];
const labels = ["Button", "Save changes", "Continue", "Delete"] as const;

const buttonStateExamples: Array<{ label: string; state: ButtonPlaygroundState }> = [
  { label: "Default", state: { ...defaultButtonState, children: "Default" } },
  { label: "Disabled", state: { ...defaultButtonState, disabled: true, children: "Disabled" } },
  { label: "Loading", state: { ...defaultButtonState, loading: true, children: "Loading" } },
  { label: "Danger", state: { ...defaultButtonState, tone: "danger", children: "Delete" } }
];

const toc = [
  { href: "#usage", label: "Usage" },
  { href: "#configurator", label: "Configurator" },
  { href: "#variants", label: "Variants" },
  { href: "#tones", label: "Tones" },
  { href: "#sizes", label: "Sizes" },
  { href: "#radius", label: "Radius" },
  { href: "#states", label: "States" },
  { href: "#accessibility", label: "Accessibility" }
] as const;

function cleanButtonProps(state: ButtonPlaygroundState) {
  const props: Record<string, unknown> = {
    variant: state.variant,
    tone: state.tone,
    size: state.size,
    radius: state.radius
  };

  if (state.disabled) props.disabled = true;
  if (state.loading) props.loading = true;

  return props;
}

function getButtonCode(state: ButtonPlaygroundState) {
  const props: string[] = [];

  if (state.variant !== defaultButtonState.variant) props.push(`variant="${state.variant}"`);
  if (state.tone !== defaultButtonState.tone) props.push(`tone="${state.tone}"`);
  if (state.size !== defaultButtonState.size) props.push(`size="${state.size}"`);
  if (state.radius !== defaultButtonState.radius) props.push(`radius="${state.radius}"`);
  if (state.disabled) props.push("disabled");
  if (state.loading) props.push("loading");

  const propText = props.length > 0 ? ` ${props.join(" ")}` : "";

  return `import { Button } from "@noctra/react";

export function Demo() {
  return (
    <Button${propText}>
      ${state.children || "Button"}
    </Button>
  );
}`;
}

function ButtonPreview({
  state,
  children
}: {
  state: ButtonPlaygroundState;
  children?: ReactNode;
}) {
  return createElement(
    ButtonRuntime,
    cleanButtonProps(state),
    children ?? state.children
  );
}

function ExampleRow({
  title,
  description,
  examples
}: {
  title: string;
  description: string;
  examples: Array<{ label: string; state: ButtonPlaygroundState }>;
}) {
  return (
    <NoctraDocsSection id={title.toLowerCase().replace(/\s+/g, "-")} eyebrow="Example" title={title} description={description}>
      <NoctraDocsExampleGrid>
        {examples.map((example) => (
          <NoctraDocsExampleCard key={example.label} label={example.label}>
            <ButtonPreview state={example.state}>{example.state.children}</ButtonPreview>
          </NoctraDocsExampleCard>
        ))}
      </NoctraDocsExampleGrid>
    </NoctraDocsSection>
  );
}

function DocumentationTab({
  state,
  setState,
  code
}: {
  state: ButtonPlaygroundState;
  setState: Dispatch<SetStateAction<ButtonPlaygroundState>>;
  code: string;
}) {
  return (
    <>
      <NoctraDocsSection
        id="usage"
        eyebrow="Usage"
        title="Usage"
        description="Use Button for direct actions such as save, continue, submit, open, or delete."
      >
        <NoctraDocsDemo
          title="Basic usage"
          description="A basic Button renders at natural content width and uses the default visual contract."
          preview={
            <>
              <ButtonPreview state={defaultButtonState} />
              <ButtonPreview state={{ ...defaultButtonState, variant: "outline", tone: "neutral", children: "Secondary" }} />
            </>
          }
          code={`import { Button } from "@noctra/react";

export function Demo() {
  return <Button>Button</Button>;
}`}
        />
      </NoctraDocsSection>

      <NoctraDocsSection
        id="configurator"
        eyebrow="Configurator"
        title="Configurator"
        description="Preview and code are generated from the same state. Default, empty, and unsupported props are omitted from the code output."
      >
        <NoctraDocsDemo
          title="Interactive Button"
          description="Change variant, tone, size, radius, label, disabled, and loading state."
          preview={<ButtonPreview state={state} />}
          code={code}
          controls={
            <div className="ncd2-controls-grid">
              <NoctraDocsControlGroup label="Variant" value={state.variant} options={variants} onChange={(variant) => setState((current) => ({ ...current, variant }))} />
              <NoctraDocsControlGroup label="Tone" value={state.tone} options={tones} onChange={(tone) => setState((current) => ({ ...current, tone }))} />
              <NoctraDocsControlGroup label="Size" value={state.size} options={sizes} onChange={(size) => setState((current) => ({ ...current, size }))} />
              <NoctraDocsControlGroup label="Radius" value={state.radius} options={radii} onChange={(radius) => setState((current) => ({ ...current, radius }))} />
              <NoctraDocsControlGroup label="Label" value={state.children} options={labels} onChange={(children) => setState((current) => ({ ...current, children }))} />
              <NoctraDocsBooleanControl label="Disabled" checked={state.disabled} onChange={(disabled) => setState((current) => ({ ...current, disabled }))} />
              <NoctraDocsBooleanControl label="Loading" checked={state.loading} onChange={(loading) => setState((current) => ({ ...current, loading }))} />
            </div>
          }
        />
      </NoctraDocsSection>

      <section id="variants">
        <ExampleRow
          title="Variants"
          description="Variants change visual emphasis without changing the action contract."
          examples={variants.map((variant) => ({
            label: variant,
            state: { ...defaultButtonState, variant, children: variant }
          }))}
        />
      </section>

      <section id="tones">
        <ExampleRow
          title="Tones"
          description="Tones express semantic intent. Avoid danger or warning unless the action truly needs that meaning."
          examples={tones.map((tone) => ({
            label: tone,
            state: { ...defaultButtonState, tone, children: tone }
          }))}
        />
      </section>

      <section id="sizes">
        <ExampleRow
          title="Sizes"
          description="Button size should match the density of the surrounding surface."
          examples={sizes.map((size) => ({
            label: size,
            state: { ...defaultButtonState, size, children: size }
          }))}
        />
      </section>

      <section id="radius">
        <ExampleRow
          title="Radius"
          description="Radius should follow the product surface system and remain consistent inside the same UI area."
          examples={radii.map((radius) => ({
            label: radius,
            state: { ...defaultButtonState, radius, children: radius }
          }))}
        />
      </section>

      <NoctraDocsSection
        id="states"
        eyebrow="Interaction"
        title="States"
        description="Button states must remain visible and understandable in dark and light themes."
      >
        <NoctraDocsExampleGrid>
          {buttonStateExamples.map((example) => (
            <NoctraDocsExampleCard key={example.label} label={example.label}>
              <ButtonPreview state={example.state}>{example.state.children}</ButtonPreview>
            </NoctraDocsExampleCard>
          ))}
        </NoctraDocsExampleGrid>
      </NoctraDocsSection>

      <NoctraDocsSection
        id="accessibility"
        eyebrow="Accessibility"
        title="Accessibility"
        description="Button should remain keyboard reachable, semantically clear, and visually understandable."
      >
        <NoctraDocsSimpleTable
          title="Accessibility checklist"
          columns={["Area", "Requirement"]}
          rows={[
            ["Keyboard", "Enter and Space should activate the action."],
            ["Disabled", "Disabled buttons should not be interactive."],
            ["Loading", "Loading buttons should communicate pending state."],
            ["Labels", "Icon-only buttons need an accessible label."],
            ["Semantics", "Use native button semantics for actions."]
          ]}
        />
      </NoctraDocsSection>

      <NoctraDocsPreviousNext
        previous={{ label: "Badge", href: docsHref("/components/badge") }}
        next={{ label: "Card", href: docsHref("/components/card") }}
      />
    </>
  );
}

function PropsTab({ component }: { component: NoctraDocsComponent }) {
  const rows: NoctraDocsPropRow[] = component.props.map((prop) => {
    const metadata = getPropDescription(component.name, prop.name);

    return {
      name: prop.name,
      type: <code>{prop.type}</code>,
      required: prop.required,
      defaultValue: "—",
      description: metadata.description
    };
  });

  return <NoctraDocsPropsPanel title="Button props" rows={rows} />;
}

function StylesApiTab({ component }: { component: NoctraDocsComponent }) {
  const selectors = component.anatomy.length > 0
    ? component.anatomy.map((slot) => ({
        selector: `[data-slot="${slot}"]`,
        description: `${slot} slot element.`
      }))
    : [
        { selector: "[data-slot=\"root\"]", description: "Root button element." },
        { selector: "[data-slot=\"label\"]", description: "Button label element." }
      ];

  return (
    <NoctraDocsStylesApiPanel
      selectors={selectors}
      variables={component.tokens.map((token) => ({
        variable: token,
        description: "Component design token."
      }))}
      dataAttributes={[
        { attribute: "data-variant", description: "Current visual variant." },
        { attribute: "data-tone", description: "Current semantic tone." },
        { attribute: "data-size", description: "Current component size." },
        { attribute: "data-disabled", description: "Present when the button is disabled." },
        { attribute: "data-loading", description: "Present when the button is loading." }
      ]}
    />
  );
}

export function ButtonReferencePage({ component }: { component: NoctraDocsComponent }) {
  const [state, setState] = useState<ButtonPlaygroundState>(defaultButtonState);
  const code = useMemo(() => getButtonCode(state), [state]);

  return (
    <NoctraDocsPage
      title="Button"
      description="Button is the primary action component in Noctra. This page uses the Noctra UI based documentation system with Documentation, Props, and Styles API tabs."
      links={[
        { label: "Source", value: "View source", href: docsHref("/components/button") },
        { label: "Package", value: "@noctra/react" },
        { label: "Import", value: "Button" }
      ]}
      toc={toc}
      documentation={<DocumentationTab state={state} setState={setState} code={code} />}
      props={<PropsTab component={component} />}
      styles={<StylesApiTab component={component} />}
    />
  );
}
