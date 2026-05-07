import type { NcDensity, NcRadius, NcTone } from "./system.types";

export interface NcDataAttributesInput {
  variant?: string | undefined;
  size?: string | undefined;
  tone?: NcTone | string | undefined;
  radius?: NcRadius | undefined;
  density?: NcDensity | undefined;
  state?: string | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  invalid?: boolean | undefined;
  valid?: boolean | undefined;
  readonly?: boolean | undefined;
  required?: boolean | undefined;
  selected?: boolean | undefined;
  checked?: boolean | undefined;
  expanded?: boolean | undefined;
  orientation?: "horizontal" | "vertical" | undefined;
  interactive?: boolean | undefined;
}

export function ncDataAttributes(input: NcDataAttributesInput): Record<string, string | true | undefined> {
  return {
    "data-variant": input.variant,
    "data-size": input.size,
    "data-tone": input.tone,
    "data-radius": input.radius,
    "data-density": input.density,
    "data-state": input.state,
    "data-disabled": input.disabled ? true : undefined,
    "data-loading": input.loading ? true : undefined,
    "data-invalid": input.invalid ? true : undefined,
    "data-valid": input.valid ? true : undefined,
    "data-readonly": input.readonly ? true : undefined,
    "data-required": input.required ? true : undefined,
    "data-selected": input.selected ? true : undefined,
    "data-checked": input.checked ? true : undefined,
    "data-expanded": input.expanded ? true : undefined,
    "data-orientation": input.orientation,
    "data-interactive": input.interactive ? true : undefined
  };
}