import { createElement, useMemo, type ComponentType, type ReactNode } from "react";
import * as NoctraReact from "./docs-system/NoctraRuntimeMock";
import type { NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";
import { PreviewFrame } from "./PreviewFrame";
import { CodeBlock, CopyButton, DocCard, SectionTitle, TagList } from "./DocsChrome";
import { createRealDemoAdapter, hasProp, type DemoState } from "../data/realDemoAdapters";

type RuntimeComponent = ComponentType<Record<string, unknown>>;

const fallbackVariants = ["default"];
const fallbackSizes = ["sm", "md", "lg"];
const fallbackTones = ["primary", "neutral", "success", "danger", "warning", "info"];
const fallbackRadii = ["none", "sm", "md", "lg", "xl", "full"];
const fallbackDensities = ["compact", "default", "comfortable"];

function unique(values: readonly string[], fallback: readonly string[]) {
  const source = values.length > 0 ? values : fallback;

  return Array.from(new Set(source)).filter((item): item is string => {
    return typeof item === "string" && item.length > 0;
  });
}

function firstValue(values: readonly string[], fallback: string) {
  return values[0] ?? fallback;
}

function extractLiteralValues(type: string) {
  const values = new Set<string>();

  for (const match of type.matchAll(/["']([^"']+)["']/g)) {
    const value = match[1];

    if (value) values.add(value);
  }

  return Array.from(values);
}

function valuesFromProp(component: NoctraDocsComponent, propName: string, fallback: readonly string[]) {
  const prop = component.props.find((item) => item.name === propName);
  const typeValues = prop ? extractLiteralValues(prop.type) : [];

  return unique(typeValues, fallback);
}

function baseState(partial: Partial<DemoState> = {}): DemoState {
  return {
    variant: "default",
    tone: "primary",
    size: "md",
    radius: "md",
    density: "default",
    disabled: false,
    open: true,
    checked: true,
    value: "Noctra",
    ...partial
  };
}

function DemoSample({
  component,
  label,
  state
}: {
  component: NoctraDocsComponent;
  label: string;
  state: DemoState;
}) {
  const runtimeExports = NoctraReact as unknown as Record<string, RuntimeComponent | undefined>;
  const RuntimeComponent = runtimeExports[component.name];

  const adapter = useMemo(() => createRealDemoAdapter(component, state), [component, state]);

  const rendered = RuntimeComponent ? (
    createElement(RuntimeComponent, adapter.props, adapter.children)
  ) : (
    <div className="nd-real-demo-error">
      <strong>{component.name} export not found</strong>
      <span>@noctra/react does not expose this component at runtime.</span>
    </div>
  );

  return (
    <div className="nd-ms-sample">
      <div className="nd-ms-sample-label">{label}</div>
      <PreviewFrame>{rendered}</PreviewFrame>
    </div>
  );
}

function ExampleSection({
  id,
  eyebrow,
  title,
  description,
  children
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="nd-ms-section">
      <SectionTitle id={id} eyebrow={eyebrow} title={title} description={description} />
      {children}
    </section>
  );
}

export function MantineStyleComponentDocs({ component }: { component: NoctraDocsComponent }) {
  const variants = unique(component.variants, fallbackVariants);
  const sizes = unique(component.sizes, fallbackSizes);
  const tones = valuesFromProp(component, "tone", fallbackTones);
  const radii = valuesFromProp(component, "radius", fallbackRadii);
  const densities = valuesFromProp(component, "density", fallbackDensities);

  const defaultVariant = firstValue(variants, "default");
  const defaultSize = firstValue(sizes, "md");
  const defaultTone = firstValue(tones, "primary");
  const defaultRadius = firstValue(radii, "md");
  const defaultDensity = firstValue(densities, "default");

  const supportsTone = hasProp(component, "tone");
  const supportsSize = hasProp(component, "size");
  const supportsRadius = hasProp(component, "radius");
  const supportsDensity = hasProp(component, "density");
  const supportsDisabled = hasProp(component, "disabled");
  const supportsChecked = hasProp(component, "checked") || hasProp(component, "defaultChecked");
  const supportsOpen = hasProp(component, "open") || hasProp(component, "defaultOpen");

  const usageCode = `import { ${component.name} } from "./docs-system/NoctraRuntimeMock";

export function Demo() {
  return <${component.name}>${component.name} content</${component.name}>;
}`;

  return (
    <div className="nd-ms-docs">
      <section className="nd-ms-section">
        <div className="nd-ms-section-head">
          <div>
            <span className="nd-kicker">Usage</span>
            <h2>Usage</h2>
            <p>Import the component from the public React package and render it inside your application.</p>
          </div>
          <CopyButton value={usageCode} />
        </div>

        <CodeBlock>{usageCode}</CodeBlock>
      </section>

      <ExampleSection
        id="mantine-playground-title"
        eyebrow="Configurator"
        title="Interactive playground"
        description="Real component export rendered in an isolated preview frame."
      >
        <DemoSample
          component={component}
          label="Default"
          state={baseState({
            variant: defaultVariant,
            size: defaultSize,
            tone: defaultTone,
            radius: defaultRadius,
            density: defaultDensity
          })}
        />
      </ExampleSection>

      <ExampleSection
        id="all-variants-title"
        eyebrow="Variants"
        title={`All ${component.name} variants`}
        description={`Rendered variants: ${variants.length}. Every generated variant is shown.`}
      >
        <div className="nd-ms-grid">
          {variants.map((variant) => (
            <DemoSample
              key={variant}
              component={component}
              label={variant}
              state={baseState({
                variant,
                size: defaultSize,
                tone: defaultTone,
                radius: defaultRadius,
                density: defaultDensity
              })}
            />
          ))}
        </div>
      </ExampleSection>

      <ExampleSection
        id="all-tones-title"
        eyebrow="Tones"
        title={`All ${component.name} tones`}
        description={
          supportsTone
            ? `Rendered tones: ${tones.length}. Every generated tone is shown.`
            : `Tone prop was not detected for ${component.name}; standard tone examples are still shown as documentation previews.`
        }
      >
        <div className="nd-ms-grid">
          {tones.map((tone) => (
            <DemoSample
              key={tone}
              component={component}
              label={tone}
              state={baseState({
                variant: defaultVariant,
                size: defaultSize,
                tone,
                radius: defaultRadius,
                density: defaultDensity
              })}
            />
          ))}
        </div>
      </ExampleSection>

      <ExampleSection
        id="all-sizes-title"
        eyebrow="Sizes"
        title={`All ${component.name} sizes`}
        description={
          supportsSize
            ? `Rendered sizes: ${sizes.length}. Every generated size is shown.`
            : `Size prop was not detected for ${component.name}; standard size examples are still shown as documentation previews.`
        }
      >
        <div className="nd-ms-grid">
          {sizes.map((size) => (
            <DemoSample
              key={size}
              component={component}
              label={size}
              state={baseState({
                variant: defaultVariant,
                size,
                tone: defaultTone,
                radius: defaultRadius,
                density: defaultDensity
              })}
            />
          ))}
        </div>
      </ExampleSection>

      <ExampleSection
        id="all-radius-title"
        eyebrow="Radius"
        title={`All ${component.name} radius values`}
        description={
          supportsRadius
            ? `Rendered radius values: ${radii.length}. Every generated radius value is shown.`
            : `Radius prop was not detected for ${component.name}; standard radius examples are still shown as documentation previews.`
        }
      >
        <div className="nd-ms-grid">
          {radii.map((radius) => (
            <DemoSample
              key={radius}
              component={component}
              label={radius}
              state={baseState({
                variant: defaultVariant,
                size: defaultSize,
                tone: defaultTone,
                radius,
                density: defaultDensity
              })}
            />
          ))}
        </div>
      </ExampleSection>

      <ExampleSection
        id="all-density-title"
        eyebrow="Density"
        title={`All ${component.name} density values`}
        description={
          supportsDensity
            ? `Rendered density values: ${densities.length}. Every generated density value is shown.`
            : `Density prop was not detected for ${component.name}; standard density examples are still shown as documentation previews.`
        }
      >
        <div className="nd-ms-grid">
          {densities.map((density) => (
            <DemoSample
              key={density}
              component={component}
              label={density}
              state={baseState({
                variant: defaultVariant,
                size: defaultSize,
                tone: defaultTone,
                radius: defaultRadius,
                density
              })}
            />
          ))}
        </div>
      </ExampleSection>

      {supportsDisabled || supportsChecked || supportsOpen ? (
        <ExampleSection
          id="all-states-title"
          eyebrow="States"
          title={`${component.name} states`}
          description="Common interactive states are rendered when the component supports them."
        >
          <div className="nd-ms-grid">
            {supportsDisabled ? (
              <DemoSample
                component={component}
                label="disabled"
                state={baseState({
                  variant: defaultVariant,
                  size: defaultSize,
                  tone: defaultTone,
                  radius: defaultRadius,
                  density: defaultDensity,
                  disabled: true
                })}
              />
            ) : null}

            {supportsChecked ? (
              <DemoSample
                component={component}
                label="checked"
                state={baseState({
                  variant: defaultVariant,
                  size: defaultSize,
                  tone: defaultTone,
                  radius: defaultRadius,
                  density: defaultDensity,
                  checked: true
                })}
              />
            ) : null}

            {supportsOpen ? (
              <DemoSample
                component={component}
                label="open"
                state={baseState({
                  variant: defaultVariant,
                  size: defaultSize,
                  tone: defaultTone,
                  radius: defaultRadius,
                  density: defaultDensity,
                  open: true
                })}
              />
            ) : null}
          </div>
        </ExampleSection>
      ) : null}

      <section className="nd-ms-section">
        <SectionTitle
          id="mantine-generated-values-title"
          eyebrow="Generated values"
          title="Generated documentation values"
          description="These values are extracted from component metadata and rendered in the examples above."
        />

        <div className="nd-two-grid">
          <DocCard title="Variants">
            <TagList items={variants} />
          </DocCard>

          <DocCard title="Tones">
            <TagList items={tones} />
          </DocCard>

          <DocCard title="Sizes">
            <TagList items={sizes} />
          </DocCard>

          <DocCard title="Radius">
            <TagList items={radii} />
          </DocCard>
        </div>
      </section>
    </div>
  );
}
