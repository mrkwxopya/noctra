import { createElement, useMemo, type ComponentType } from "react";
import * as NoctraReact from "@noctra/react";
import type { NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";
import { PreviewFrame } from "./PreviewFrame";
import { CodeBlock, CopyButton, DocCard, SectionTitle, TagList } from "./DocsChrome";
import { createRealDemoAdapter, type DemoState } from "../data/realDemoAdapters";

type RuntimeComponent = ComponentType<Record<string, unknown>>;

const fallbackVariants = ["surface"];
const fallbackSizes = ["sm", "md", "lg"];
const toneValues = ["primary", "neutral", "success", "danger", "warning", "info"];
const densityValues = ["compact", "default", "comfortable"];
const radiusValues = ["sm", "md", "lg", "xl"];

function unique(values: readonly string[], fallback: readonly string[]) {
  const source = values.length > 0 ? values : fallback;

  return Array.from(new Set(source)).filter((item): item is string => typeof item === "string" && item.length > 0);
}

function firstValue(values: readonly string[], fallback: string) {
  return values[0] ?? fallback;
}

function baseState(partial: Partial<DemoState> = {}): DemoState {
  return {
    variant: "surface",
    tone: "primary",
    size: "md",
    radius: "lg",
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

export function MantineStyleComponentDocs({ component }: { component: NoctraDocsComponent }) {
  const variants = unique(component.variants, fallbackVariants);
  const sizes = unique(component.sizes, fallbackSizes);
  const defaultVariant = firstValue(variants, "surface");
  const defaultSize = firstValue(sizes, "md");

  const usageCode = `import { ${component.name} } from "@noctra/react";

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

      <section className="nd-ms-section">
        <SectionTitle
          id="mantine-playground-title"
          eyebrow="Configurator"
          title="Interactive playground"
          description="A Mantine-style playground renders the real component export in an isolated preview."
        />

        <DemoSample component={component} label="Default" state={baseState({ variant: defaultVariant, size: defaultSize })} />
      </section>

      <section className="nd-ms-section">
        <SectionTitle
          id="all-variants-title"
          eyebrow="Variants"
          title={`All ${component.name} variants`}
          description="Every generated variant for this component is rendered below. If Divider has 3 variants, all 3 are shown."
        />

        <div className="nd-ms-grid">
          {variants.map((variant) => (
            <DemoSample
              key={variant}
              component={component}
              label={variant}
              state={baseState({ variant, size: defaultSize, tone: "primary" })}
            />
          ))}
        </div>
      </section>

      <section className="nd-ms-section">
        <SectionTitle
          id="all-sizes-title"
          eyebrow="Sizes"
          title={`All ${component.name} sizes`}
          description="Every generated size for this component is rendered below."
        />

        <div className="nd-ms-grid">
          {sizes.map((size) => (
            <DemoSample
              key={size}
              component={component}
              label={size}
              state={baseState({ variant: defaultVariant, size })}
            />
          ))}
        </div>
      </section>

      <section className="nd-ms-section">
        <SectionTitle
          id="all-tones-title"
          eyebrow="Tones"
          title={`All ${component.name} tones`}
          description="Tone previews are rendered as a Mantine-style docs section."
        />

        <div className="nd-ms-grid">
          {toneValues.map((tone) => (
            <DemoSample
              key={tone}
              component={component}
              label={tone}
              state={baseState({ variant: defaultVariant, size: defaultSize, tone })}
            />
          ))}
        </div>
      </section>

      <section className="nd-ms-section">
        <SectionTitle
          id="all-radius-density-title"
          eyebrow="Shape and density"
          title="Radius and density"
          description="Radius and density examples follow Mantine-style documentation sections."
        />

        <div className="nd-two-grid">
          <DocCard title="Radius values">
            <TagList items={radiusValues} />
            <div className="nd-ms-stack">
              {radiusValues.map((radius) => (
                <DemoSample
                  key={radius}
                  component={component}
                  label={radius}
                  state={baseState({ variant: defaultVariant, size: defaultSize, radius })}
                />
              ))}
            </div>
          </DocCard>

          <DocCard title="Density values">
            <TagList items={densityValues} />
            <div className="nd-ms-stack">
              {densityValues.map((density) => (
                <DemoSample
                  key={density}
                  component={component}
                  label={density}
                  state={baseState({ variant: defaultVariant, size: defaultSize, density })}
                />
              ))}
            </div>
          </DocCard>
        </div>
      </section>
    </div>
  );
}