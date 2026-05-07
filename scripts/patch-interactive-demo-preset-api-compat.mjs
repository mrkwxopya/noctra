import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

text = text.replace(
  /export function getInteractiveDemoPreset\(componentName: string\): any \{\s*if \(isRemovedInteractiveDemoComponent\(componentName\)\) return undefined;\s*return interactiveDemoPresets\[componentName\];\s*\}/,
  `export function getInteractiveDemoPreset(component: string | { name: string }): any {
  const componentName = typeof component === "string" ? component : component.name;

  if (isRemovedInteractiveDemoComponent(componentName)) return undefined;

  return interactiveDemoPresets[componentName];
}`
);

text = text.replace(
  /export function hasInteractiveDemoPreset\(componentName: string\) \{\s*return Object\.prototype\.hasOwnProperty\.call\(interactiveDemoPresets, componentName\);\s*\}/,
  `export function hasInteractiveDemoPreset(component: string | { name: string }) {
  const componentName = typeof component === "string" ? component : component.name;

  return Object.prototype.hasOwnProperty.call(interactiveDemoPresets, componentName);
}`
);

text = text.replace(
  /export function isRemovedInteractiveDemoComponent\(componentName: string\) \{\s*return removedInteractiveDemoComponents\.has\(componentName\);\s*\}/,
  `export function isRemovedInteractiveDemoComponent(component: string | { name: string }) {
  const componentName = typeof component === "string" ? component : component.name;

  return removedInteractiveDemoComponents.has(componentName);
}`
);

const compatBlock = `
type DemoComponentLike = {
  name: string;
  props?: Array<{
    name: string;
    type?: string;
    required?: boolean;
  }>;
  variants?: readonly string[];
  sizes?: readonly string[];
};

type DemoStateLike = Record<string, any>;

function getDemoComponentName(component: string | DemoComponentLike) {
  return typeof component === "string" ? component : component.name;
}

function getDemoComponentProps(component: string | DemoComponentLike) {
  return typeof component === "string" ? [] : component.props ?? [];
}

function normalizeDemoValue(value: any) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return value;
  return value;
}

function shouldRenderCodeProp(key: string, value: any) {
  if (value === undefined || value === null) return false;
  if (key === "children") return false;
  if (typeof value === "function") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === "object" && Object.keys(value).length === 0) return false;

  return true;
}

function formatCodeProp(key: string, value: any) {
  if (value === true) return key;
  if (value === false) return \`\${key}={false}\`;
  if (typeof value === "number") return \`\${key}={\${value}}\`;
  if (typeof value === "string") return \`\${key}="\${value.replace(/"/g, "&quot;")}"\`;

  return \`\${key}={\${JSON.stringify(value)}}\`;
}

function hasRuntimeProp(component: string | DemoComponentLike, propName: string) {
  const preset = getInteractiveDemoPreset(component);
  const props = getDemoComponentProps(component);

  if (preset?.props && Object.prototype.hasOwnProperty.call(preset.props, propName)) return true;
  if (preset?.state && Object.prototype.hasOwnProperty.call(preset.state, propName)) return true;
  if (Array.isArray(preset?.controls) && preset.controls.includes(propName)) return true;

  return props.some((prop) => prop.name === propName);
}

export function componentSupports(component: string | DemoComponentLike, propName: string) {
  return hasRuntimeProp(component, propName);
}

export function buildInteractiveDemoProps(component: string | DemoComponentLike, state: DemoStateLike = {}) {
  const componentName = getDemoComponentName(component);
  const preset = getInteractiveDemoPreset(componentName);

  const presetProps = preset?.props && typeof preset.props === "object" ? preset.props : {};
  const presetState = preset?.state && typeof preset.state === "object" ? preset.state : {};

  const nextProps: Record<string, any> = {
    ...presetProps,
    ...presetState,
    ...state
  };

  delete nextProps.children;
  delete nextProps.previewWidth;
  delete nextProps.previewHeight;
  delete nextProps.controls;

  for (const [key, value] of Object.entries(nextProps)) {
    nextProps[key] = normalizeDemoValue(value);
  }

  return nextProps;
}

export function getInteractiveDemoCode(component: string | DemoComponentLike, state: DemoStateLike = {}) {
  const componentName = getDemoComponentName(component);
  const preset = getInteractiveDemoPreset(componentName);
  const props = buildInteractiveDemoProps(component, state);

  const propCode = Object.entries(props)
    .filter(([key, value]) => shouldRenderCodeProp(key, value))
    .map(([key, value]) => formatCodeProp(key, value))
    .join(" ");

  const children = state.children ?? preset?.props?.children ?? preset?.children ?? \`\${componentName} content\`;
  const openTag = propCode ? \`<\${componentName} \${propCode}>\` : \`<\${componentName}>\`;

  if (children === false || children === null || children === undefined) {
    return \`import { \${componentName} } from "@noctra/react";

export function Demo() {
  return \${propCode ? \`<\${componentName} \${propCode} />\` : \`<\${componentName} />\`};
}\`;
  }

  return \`import { \${componentName} } from "@noctra/react";

export function Demo() {
  return (
    \${openTag}
      \${typeof children === "string" ? children : JSON.stringify(children)}
    </\${componentName}>
  );
}\`;
}

export function getComponentInteractiveDemoCode(component: string | DemoComponentLike, state: DemoStateLike = {}) {
  return getInteractiveDemoCode(component, state);
}

export function buildComponentInteractiveDemoProps(component: string | DemoComponentLike, state: DemoStateLike = {}) {
  return buildInteractiveDemoProps(component, state);
}
`;

if (!text.includes("export function buildInteractiveDemoProps")) {
  text = `${text.trimEnd()}\n\n${compatBlock}\n`;
}

writeText(file, text);

console.log("Interactive demo preset API compatibility patched.");