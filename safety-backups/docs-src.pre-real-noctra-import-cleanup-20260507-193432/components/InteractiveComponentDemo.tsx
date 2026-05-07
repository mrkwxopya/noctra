import {
  Component,
  createElement,
  useMemo,
  useState,
  type ChangeEvent,
  type ComponentType,
  type ErrorInfo,
  type ReactNode
} from "react";
import * as NoctraReact from "./docs-system/NoctraRuntimeMock";
import type { NoctraDocsComponent } from "../generated/noctra-professional-docs.generated";
import { PreviewFrame } from "./PreviewFrame";
import { CodeBlock, CopyButton, DocCard, SectionTitle } from "./DocsChrome";
import {
  buildInteractiveDemoProps,
  componentSupports,
  getInteractiveDemoCode,
  getInteractiveDemoPreset
} from "../data/interactiveDemoPresets";

type RuntimeComponent = ComponentType<Record<string, unknown>>;
type DemoState = Record<string, unknown>;
type DemoTab = "preview" | "code" | "controls";

const childlessComponents = new Set([
  "Input",
  "SearchInput",
  "TextInput",
  "Textarea",
  "NumberInput",
  "Select",
  "MultiSelect",
  "Combobox",
  "Autocomplete",
  "TagsInput",
  "Checkbox",
  "Radio",
  "Switch",
  "Slider",
  "Pagination",
  "ColorInput",
  "FileInput"
]);

const optionMap: Record<string, string[]> = {
  variant: ["default", "filled", "outline", "subtle", "ghost", "light"],
  tone: ["primary", "neutral", "success", "warning", "danger", "info"],
  size: ["xs", "sm", "md", "lg", "xl"],
  radius: ["none", "sm", "md", "lg", "xl", "full"],
  density: ["compact", "default", "comfortable"],
  position: ["top", "right", "bottom", "left"],
  orientation: ["horizontal", "vertical"],
  align: ["start", "center", "end", "stretch"],
  justify: ["start", "center", "end", "space-between"],
  direction: ["row", "column"]
};

function getDefaultState(component: NoctraDocsComponent): DemoState {
  const preset = getInteractiveDemoPreset(component);
  const presetProps = preset?.props && typeof preset.props === "object" ? preset.props : {};
  const presetState = preset?.state && typeof preset.state === "object" ? preset.state : {};

  return {
    ...presetProps,
    ...presetState
  };
}

function getControls(component: NoctraDocsComponent): string[] {
  const preset = getInteractiveDemoPreset(component);
  const controls: unknown[] = Array.isArray(preset?.controls) ? preset.controls : [];

  return controls.filter((control: unknown): control is string => {
    if (typeof control !== "string") return false;

    if (["Canvas", "center", "Variant", "Tone", "Size", "Radius", "Density"].includes(control)) {
      return false;
    }

    return true;
  });
}

function toInputValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === undefined || value === null) return "";

  return String(value);
}

function parseValue(control: string, value: string) {
  if (["value", "page", "total", "min", "max", "step", "width", "height", "maxFiles", "columns"].includes(control)) {
    const numeric = Number(value);

    return Number.isFinite(numeric) && value.trim() !== "" ? numeric : value;
  }

  if (control === "items" || control === "data") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value;
}

function getPreviewChildren(component: NoctraDocsComponent, state: DemoState) {
  const preset = getInteractiveDemoPreset(component);

  if (childlessComponents.has(component.name)) return undefined;

  if (typeof state.children === "string") return state.children;
  if (typeof preset?.props?.children === "string") return preset.props.children;
  if (typeof preset?.children === "string") return preset.children;

  return `${component.name} content`;
}

function getPreviewSizing(component: NoctraDocsComponent) {
  const preset = getInteractiveDemoPreset(component);
  const width = typeof preset?.previewWidth === "number" ? preset.previewWidth : undefined;
  const height = typeof preset?.previewHeight === "number" ? preset.previewHeight : undefined;

  return {
    width,
    height
  };
}

function cleanRuntimeProps(props: Record<string, unknown>) {
  const next = { ...props };

  delete next.children;
  delete next.controls;
  delete next.previewWidth;
  delete next.previewHeight;

  for (const key of Object.keys(next)) {
    if (next[key] === undefined) delete next[key];
  }

  return next;
}

class DemoErrorBoundary extends Component<
  { componentName: string; children: ReactNode },
  { error: string | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return {
      error: error instanceof Error ? error.message : String(error)
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.warn("Noctra docs demo failed", this.props.componentName, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <strong>{this.props.componentName} runtime preview failed</strong>
          <p>{this.state.error}</p>
          <p>The docs still generated the import/code block. Add a component-specific safe preset for this component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function ControlField({
  component,
  control,
  value,
  onChange
}: {
  component: NoctraDocsComponent;
  control: string;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}) {
  const normalizedControl = control.toLowerCase();

  if (["disabled", "checked", "open", "loading", "invalid", "multiple", "collapsible", "locked", "animated", "striped", "highlightonhover"].includes(normalizedControl)) {
    return (
      <label>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(control, event.currentTarget.checked)}
        />
        <span>{control}</span>
      </label>
    );
  }

  const options = optionMap[control];

  if (options) {
    return (
      <label>
        <span>{control}</span>
        <select value={toInputValue(value)} onChange={(event) => onChange(control, event.currentTarget.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  const isNumberControl = ["value", "page", "total", "min", "max", "step", "width", "height", "maxFiles", "columns"].includes(control);

  return (
    <label>
      <span>{control}</span>
      <input
        type={isNumberControl ? "number" : "text"}
        value={toInputValue(value)}
        placeholder={componentSupports(component, control) ? control : `${control} preview`}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(control, parseValue(control, event.currentTarget.value))}
      />
    </label>
  );
}

export function InteractiveComponentDemo({ component }: { component: NoctraDocsComponent }) {
  const runtimeExports = NoctraReact as unknown as Record<string, RuntimeComponent | undefined>;
  const RuntimeComponent = runtimeExports[component.name];
  const preset = getInteractiveDemoPreset(component);

  const [activeTab, setActiveTab] = useState<DemoTab>("preview");
  const [state, setState] = useState<DemoState>(() => getDefaultState(component));

  const controls = useMemo<string[]>(() => getControls(component), [component]);

  const runtimeProps = useMemo(() => {
    return cleanRuntimeProps(buildInteractiveDemoProps(component, state));
  }, [component, state]);

  const code = useMemo(() => {
    return getInteractiveDemoCode(component, state);
  }, [component, state]);

  const previewSizing = useMemo(() => getPreviewSizing(component), [component]);

  function updateState(key: string, value: unknown) {
    setState((current) => ({
      ...current,
      [key]: value
    }));
  }

  const preview = RuntimeComponent ? (
    <DemoErrorBoundary componentName={component.name}>
      {createElement(RuntimeComponent, runtimeProps, getPreviewChildren(component, state))}
    </DemoErrorBoundary>
  ) : (
    <div role="alert">
      <strong>{component.name} runtime export missing</strong>
      <p>@noctra/react does not expose this component at runtime.</p>
    </div>
  );

  return (
    <section>
      <SectionTitle
        id="interactive-playground"
        eyebrow="Interactive playground"
        title={`${component.name} playground`}
        description={
          preset
            ? "Preview and code are generated from the same state. Controls are component-specific."
            : "No component-specific preset exists yet. The runtime preview uses a safe default fallback."
        }
      />

      <DocCard title="Live example" description="Change controls and verify that preview and code update together." premium>
        <div role="tablist" aria-label={`${component.name} demo tabs`}>
          <button type="button" aria-selected={activeTab === "preview"} onClick={() => setActiveTab("preview")}>
            Preview
          </button>
          <button type="button" aria-selected={activeTab === "code"} onClick={() => setActiveTab("code")}>
            Code
          </button>
          <button type="button" aria-selected={activeTab === "controls"} onClick={() => setActiveTab("controls")}>
            Controls
          </button>
          <CopyButton value={code} />
        </div>

        {activeTab === "preview" ? (
          <PreviewFrame>
            <div
              style={{
                width: previewSizing.width ? `${previewSizing.width}px` : "fit-content",
                maxWidth: "100%",
                minHeight: previewSizing.height ? `${previewSizing.height}px` : undefined
              }}
            >
              {preview}
            </div>
          </PreviewFrame>
        ) : null}

        {activeTab === "code" ? <CodeBlock>{code}</CodeBlock> : null}

        {activeTab === "controls" ? (
          <div>
            {controls.length > 0 ? (
              controls.map((control: string) => (
                <ControlField
                  key={control}
                  component={component}
                  control={control}
                  value={state[control]}
                  onChange={updateState}
                />
              ))
            ) : (
              <p>No interactive controls are defined for this component yet.</p>
            )}
          </div>
        ) : null}
      </DocCard>
    </section>
  );
}
