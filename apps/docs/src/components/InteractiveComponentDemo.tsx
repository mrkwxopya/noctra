import { Component, createElement, useMemo, useState, type ComponentType, type ReactNode } from "react";
import * as NoctraReact from "@noctra/react";
import type { NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";
import {
  buildInteractiveDemoProps,
  componentSupports,
  getInteractiveDemoCode,
  getInteractiveDemoPreset
} from "../data/interactiveDemoPresets";
import { CodeBlock, CopyButton } from "./DocsChrome";

type RuntimeComponent = ComponentType<Record<string, unknown>>;

class DemoErrorBoundary extends Component<
  { children: ReactNode; componentName: string },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: ReactNode; componentName: string }) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ""
    };
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : "Unknown render error"
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="nd-real-demo-error">
          <strong>{this.props.componentName} runtime preview failed</strong>
          <span>{this.state.errorMessage}</span>
          <small>The docs still generated the import/code block. Add a component-specific safe preset for this component.</small>
        </div>
      );
    }

    return this.props.children;
  }
}

function uniqueValues(values: readonly string[], fallback: readonly string[]) {
  const source = values.length > 0 ? values : fallback;
  return Array.from(new Set(source)).filter(Boolean);
}

function ControlSelect({
  label,
  value,
  values,
  onChange
}: {
  label: string;
  value: string;
  values: readonly string[];
  onChange: (value: string) => void;
}) {
  if (values.length === 0) return null;

  return (
    <label className="nd-real-demo-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

export function InteractiveComponentDemo({ component }: { component: NoctraDocsComponent }) {
  const runtimeExports = NoctraReact as unknown as Record<string, RuntimeComponent | undefined>;
  const RuntimeComponent = runtimeExports[component.name];
  const preset = getInteractiveDemoPreset(component);
  const code = getInteractiveDemoCode(component);

  const variantValues = uniqueValues(component.variants, ["surface", "soft", "outline", "ghost"]);
  const sizeValues = uniqueValues(component.sizes, ["sm", "md", "lg"]);
  const toneValues = ["primary", "neutral", "success", "danger", "warning", "info"];
  const radiusValues = ["sm", "md", "lg", "xl"];
  const densityValues = ["compact", "default", "comfortable"];

  const [tab, setTab] = useState<"preview" | "code" | "props">("preview");
  const [canvas, setCanvas] = useState<"center" | "wide" | "compact">("center");
  const [variant, setVariant] = useState(variantValues[0] ?? "");
  const [size, setSize] = useState(sizeValues[0] ?? "");
  const [tone, setTone] = useState("primary");
  const [radius, setRadius] = useState("lg");
  const [density, setDensity] = useState("default");
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(componentSupports(component, "open") || componentSupports(component, "defaultOpen"));

  const props = useMemo(() => {
    return buildInteractiveDemoProps(component, {
      variant,
      tone,
      size,
      radius,
      density,
      disabled,
      open
    });
  }, [component, density, disabled, open, radius, size, tone, variant]);

  const preview = useMemo(() => {
    if (!RuntimeComponent) {
      return (
        <div className="nd-real-demo-error">
          <strong>{component.name} export was not found</strong>
          <span>@noctra/react does not currently expose this component name at runtime.</span>
        </div>
      );
    }

    const children = preset.children ?? `${component.name} content`;

    return createElement(RuntimeComponent, props, children);
  }, [RuntimeComponent, component.name, preset.children, props]);

  const propRows = Object.entries(props)
    .filter(([, value]) => typeof value !== "function")
    .map(([key, value]) => [key, typeof value === "string" ? value : JSON.stringify(value)]);

  return (
    <section className="nd-real-demo">
      <div className="nd-real-demo-header">
        <div>
          <span className="nd-kicker">Real interactive runtime</span>
          <h3>{preset.title}</h3>
          <p>{preset.description}</p>
        </div>

        <div className="nd-real-demo-tabs">
          <button type="button" data-active={tab === "preview" || undefined} onClick={() => setTab("preview")}>
            Preview
          </button>
          <button type="button" data-active={tab === "props" || undefined} onClick={() => setTab("props")}>
            Live props
          </button>
          <button type="button" data-active={tab === "code" || undefined} onClick={() => setTab("code")}>
            Code
          </button>
          <CopyButton value={code} />
        </div>
      </div>

      <div className="nd-real-demo-toolbar">
        <ControlSelect label="Canvas" value={canvas} values={["center", "wide", "compact"]} onChange={(value) => setCanvas(value as typeof canvas)} />

        {componentSupports(component, "variant") ? (
          <ControlSelect label="Variant" value={variant} values={variantValues} onChange={setVariant} />
        ) : null}

        {componentSupports(component, "tone") ? (
          <ControlSelect label="Tone" value={tone} values={toneValues} onChange={setTone} />
        ) : null}

        {componentSupports(component, "size") ? (
          <ControlSelect label="Size" value={size} values={sizeValues} onChange={setSize} />
        ) : null}

        {componentSupports(component, "radius") ? (
          <ControlSelect label="Radius" value={radius} values={radiusValues} onChange={setRadius} />
        ) : null}

        {componentSupports(component, "density") ? (
          <ControlSelect label="Density" value={density} values={densityValues} onChange={setDensity} />
        ) : null}

        {componentSupports(component, "disabled") ? (
          <label className="nd-real-demo-toggle">
            <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
            <span>Disabled</span>
          </label>
        ) : null}

        {componentSupports(component, "open") || componentSupports(component, "defaultOpen") ? (
          <label className="nd-real-demo-toggle">
            <input type="checkbox" checked={open} onChange={(event) => setOpen(event.target.checked)} />
            <span>Open</span>
          </label>
        ) : null}
      </div>

      {tab === "preview" ? (
        <div className="nd-real-demo-stage" data-canvas={canvas}>
          <DemoErrorBoundary componentName={component.name}>
            <div className="nd-real-demo-canvas nd-noctra-runtime">
              {preview}
            </div>
          </DemoErrorBoundary>
        </div>
      ) : null}

      {tab === "props" ? (
        <div className="nd-real-demo-props">
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Live value</th>
              </tr>
            </thead>
            <tbody>
              {propRows.length > 0 ? (
                propRows.map(([key, value]) => (
                  <tr key={key}>
                    <td><code>{key}</code></td>
                    <td><code>{value}</code></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>No runtime props generated for this component.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "code" ? (
        <div className="nd-real-demo-code">
          <CodeBlock>{code}</CodeBlock>
        </div>
      ) : null}
    </section>
  );
}