import {
  createElement,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode
} from "react";
import * as NoctraReact from "@noctra/react";
import {
  AnchorList,
  CodeBlock,
  DataTable,
  DocCard,
  PageHero,
  SectionTitle,
  StatCard,
  TagList
} from "../components/DocsChrome";
import { getCategoryLabel, getPropDescription } from "../data/propDescriptions";
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

const buttonAnchors = [
  { href: "#usage", label: "Usage", description: "Import and basic usage" },
  { href: "#playground", label: "Playground", description: "Live configurable button" },
  { href: "#variants", label: "Variants", description: "Visual styles" },
  { href: "#tones", label: "Tones", description: "Semantic color roles" },
  { href: "#sizes", label: "Sizes", description: "Button scale" },
  { href: "#radius", label: "Radius", description: "Corner system" },
  { href: "#states", label: "States", description: "Disabled and loading" },
  { href: "#props", label: "Props", description: "Typed API" },
  { href: "#accessibility", label: "Accessibility", description: "Keyboard and labels" },
  { href: "#related", label: "Related", description: "Nearby components" }
] as const;

const defaultButtonState: ButtonPlaygroundState = {
  children: "Button",
  variant: "filled",
  tone: "primary",
  size: "md",
  radius: "md",
  disabled: false,
  loading: false
};

const variants: ButtonVariant[] = ["filled", "light", "outline", "subtle", "ghost"];
const tones: ButtonTone[] = ["primary", "neutral", "success", "warning", "danger"];
const sizes: ButtonSize[] = ["xs", "sm", "md", "lg", "xl"];
const radii: ButtonRadius[] = ["none", "sm", "md", "lg", "xl", "full"];

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

function PreviewSurface({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="nd-related-card">
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", paddingTop: 12 }}>
        {children}
      </div>
    </div>
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
    <DocCard title={title}>
      <p>{description}</p>
      <div className="nd-related-grid">
        {examples.map((example) => (
          <PreviewSurface key={example.label} title={example.label}>
            <ButtonPreview state={example.state}>{example.state.children}</ButtonPreview>
          </PreviewSurface>
        ))}
      </div>
    </DocCard>
  );
}

function SelectControl<TValue extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: TValue;
  options: readonly TValue[];
  onChange: (value: TValue) => void;
}) {
  return (
    <label className="nd-related-card">
      <strong>{label}</strong>
      <select value={value} onChange={(event) => onChange(event.currentTarget.value as TValue)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextControl({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="nd-related-card">
      <strong>{label}</strong>
      <input value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}

function ToggleControl({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="nd-related-card">
      <strong>{label}</strong>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} />
        {checked ? "Enabled" : "Disabled"}
      </span>
    </label>
  );
}

export function ButtonReferencePage({ component }: { component: NoctraDocsComponent }) {
  const [state, setState] = useState<ButtonPlaygroundState>(defaultButtonState);
  const code = useMemo(() => getButtonCode(state), [state]);

  const propRows = component.props.map((prop) => {
    const metadata = getPropDescription(component.name, prop.name);

    return [
      <code>{prop.name}</code>,
      <code>{prop.type}</code>,
      prop.required ? "Required" : "Optional",
      getCategoryLabel(metadata.category),
      metadata.description
    ];
  });

  return (
    <div className="nd-detail-layout">
      <div className="nd-detail-main">
        <PageHero
          eyebrow="Core component"
          title="Button"
          description="Button is the primary action component in Noctra. This curated page is the reference quality target for the rest of the documentation system."
        >
          <div className="nd-stats-grid">
            <StatCard label="Package" value="@noctra/react" />
            <StatCard label="Import" value="Button" />
            <StatCard label="Props" value={component.props.length} />
            <StatCard label="Status" value="Curated reference" />
          </div>
        </PageHero>

        <section id="usage" className="nd-doc-section">
          <SectionTitle
            id="usage-title"
            eyebrow="Usage"
            title="Import and basic usage"
            description="Use Button for primary and secondary actions across forms, dialogs, toolbars, cards, and page flows."
          />

          <div className="nd-two-grid">
            <DocCard title="Import">
              <CodeBlock>{`import { Button } from "@noctra/react";`}</CodeBlock>
            </DocCard>

            <DocCard title="Basic example">
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                <ButtonPreview state={defaultButtonState} />
                <ButtonPreview state={{ ...defaultButtonState, variant: "outline", children: "Secondary" }} />
              </div>
              <CodeBlock>{`<Button>Button</Button>`}</CodeBlock>
            </DocCard>
          </div>
        </section>

        <section id="playground" className="nd-doc-section">
          <SectionTitle
            id="playground-title"
            eyebrow="Playground"
            title="Configurator"
            description="The preview and code are generated from the same state. Empty, default, and unsupported props are not written to the code block."
          />

          <DocCard title="Live demo">
            <div className="nd-two-grid">
              <PreviewSurface title="Preview" description="Rendered with the current playground state.">
                <ButtonPreview state={state} />
              </PreviewSurface>

              <div>
                <p>Controls are specific to Button. There is no generic Canvas, Density, or unsupported prop control here.</p>
                <div className="nd-related-grid">
                  <SelectControl label="Variant" value={state.variant} options={variants} onChange={(variant) => setState((current) => ({ ...current, variant }))} />
                  <SelectControl label="Tone" value={state.tone} options={tones} onChange={(tone) => setState((current) => ({ ...current, tone }))} />
                  <SelectControl label="Size" value={state.size} options={sizes} onChange={(size) => setState((current) => ({ ...current, size }))} />
                  <SelectControl label="Radius" value={state.radius} options={radii} onChange={(radius) => setState((current) => ({ ...current, radius }))} />
                  <TextControl label="Label" value={state.children} onChange={(children) => setState((current) => ({ ...current, children }))} />
                  <ToggleControl label="Disabled" checked={state.disabled} onChange={(disabled) => setState((current) => ({ ...current, disabled }))} />
                  <ToggleControl label="Loading" checked={state.loading} onChange={(loading) => setState((current) => ({ ...current, loading }))} />
                </div>
              </div>
            </div>

            <CodeBlock>{code}</CodeBlock>
          </DocCard>
        </section>

        <section id="variants" className="nd-doc-section">
          <SectionTitle
            id="variants-title"
            eyebrow="Examples"
            title="Variants"
            description="Variants change visual emphasis without changing the action contract."
          />

          <ExampleRow
            title="Button variants"
            description="Use stronger variants for primary actions and softer variants for secondary actions."
            examples={variants.map((variant) => ({
              label: variant,
              state: { ...defaultButtonState, variant, children: variant }
            }))}
          />
        </section>

        <section id="tones" className="nd-doc-section">
          <SectionTitle
            id="tones-title"
            eyebrow="Color system"
            title="Tones"
            description="Tones express semantic intent. Avoid danger or warning unless the action truly needs that meaning."
          />

          <ExampleRow
            title="Semantic tones"
            description="Tone should come from meaning, not decoration."
            examples={tones.map((tone) => ({
              label: tone,
              state: { ...defaultButtonState, tone, children: tone }
            }))}
          />
        </section>

        <section id="sizes" className="nd-doc-section">
          <SectionTitle
            id="sizes-title"
            eyebrow="Scale"
            title="Sizes"
            description="Button size should match the density of the surrounding surface."
          />

          <ExampleRow
            title="Button sizes"
            description="Use smaller sizes in dense toolbars and larger sizes for page-level calls to action."
            examples={sizes.map((size) => ({
              label: size,
              state: { ...defaultButtonState, size, children: size }
            }))}
          />
        </section>

        <section id="radius" className="nd-doc-section">
          <SectionTitle
            id="radius-title"
            eyebrow="Shape"
            title="Radius"
            description="Radius should follow the product surface system and remain consistent inside the same UI area."
          />

          <ExampleRow
            title="Button radius"
            description="Use full radius for pill actions, medium radius for app controls, and lower radius for dense tooling."
            examples={radii.map((radius) => ({
              label: radius,
              state: { ...defaultButtonState, radius, children: radius }
            }))}
          />
        </section>

        <section id="states" className="nd-doc-section">
          <SectionTitle
            id="states-title"
            eyebrow="Interaction"
            title="States"
            description="Button states must remain visible and understandable in dark and light themes."
          />

          <ExampleRow
            title="Button states"
            description="Disabled and loading states should never look like normal clickable actions."
            examples={[
              { label: "Default", state: { ...defaultButtonState, children: "Default" } },
              { label: "Disabled", state: { ...defaultButtonState, disabled: true, children: "Disabled" } },
              { label: "Loading", state: { ...defaultButtonState, loading: true, children: "Loading" } },
              { label: "Danger", state: { ...defaultButtonState, tone: "danger", children: "Delete" } }
            ]}
          />
        </section>

        <section id="props" className="nd-doc-section">
          <SectionTitle
            id="props-title"
            eyebrow="API"
            title="Props"
            description="The props table is generated from the public component type metadata and enhanced with documentation descriptions."
          />

          <DocCard title="Button props">
            <DataTable columns={["Prop", "Type", "Required", "Category", "Description"]} rows={propRows} />
          </DocCard>
        </section>

        <section id="accessibility" className="nd-doc-section">
          <SectionTitle
            id="accessibility-title"
            eyebrow="Accessibility"
            title="Accessibility"
            description="Button should behave like a button, remain keyboard reachable, and keep focus states visible."
          />

          <div className="nd-two-grid">
            <DocCard title="Keyboard">
              <ul>
                <li>Use native button semantics for actions.</li>
                <li>Enter and Space should activate the action.</li>
                <li>Disabled buttons should not be interactive.</li>
                <li>Loading buttons should communicate pending state.</li>
              </ul>
            </DocCard>

            <DocCard title="Labels">
              <ul>
                <li>Use clear visible text for most buttons.</li>
                <li>Icon-only buttons need an accessible label.</li>
                <li>Do not rely only on color to communicate danger.</li>
                <li>Keep copy short and action-oriented.</li>
              </ul>
            </DocCard>
          </div>
        </section>

        <section id="related" className="nd-doc-section">
          <SectionTitle
            id="related-title"
            eyebrow="Related"
            title="Related components"
            description="Use these components when Button is not the right primitive."
          />

          <div className="nd-related-grid">
            {["IconButton", "Anchor", "Clipboard", "Menu", "Toolbar"].map((name) => (
              <a key={name} className="nd-related-card" href={docsHref(`/components/${name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`)}>
                <strong>{name}</strong>
                <span>Related action pattern</span>
              </a>
            ))}
          </div>

          <div className="nd-two-grid">
            <DocCard title="Anatomy">
              <TagList items={component.anatomy} />
            </DocCard>

            <DocCard title="Tokens">
              <TagList items={component.tokens} />
            </DocCard>
          </div>
        </section>
      </div>

      <aside className="nd-detail-aside">
        <AnchorList items={buttonAnchors} />
      </aside>
    </div>
  );
}