import type { NcDensity, NcRadius, NcSize, NcTone } from "@noctra/react";
import type { NcButtonVariant } from "@noctra/react";

export interface ButtonPlaygroundState {
  variant: NcButtonVariant;
  tone: NcTone;
  size: NcSize;
  radius: NcRadius;
  density: NcDensity;
  loading: boolean;
  disabled: boolean;
  fullWidth: boolean;
  leftIcon: boolean;
  rightIcon: boolean;
  label: string;
}

export const defaultButtonPlaygroundState: ButtonPlaygroundState = {
  variant: "solid",
  tone: "primary",
  size: "md",
  radius: "md",
  density: "default",
  loading: false,
  disabled: false,
  fullWidth: false,
  leftIcon: false,
  rightIcon: false,
  label: "Continue"
};

export function generateButtonCode(state: ButtonPlaygroundState): string {
  const props: string[] = [];

  if (state.variant !== "solid") props.push(`variant="${state.variant}"`);
  if (state.tone !== "primary") props.push(`tone="${state.tone}"`);
  if (state.size !== "md") props.push(`size="${state.size}"`);
  if (state.radius !== "md") props.push(`radius="${state.radius}"`);
  if (state.density !== "default") props.push(`density="${state.density}"`);
  if (state.loading) props.push("loading");
  if (state.disabled) props.push("disabled");
  if (state.fullWidth) props.push("fullWidth");
  if (state.leftIcon) props.push("leftIcon={<span aria-hidden>→</span>}");
  if (state.rightIcon) props.push("rightIcon={<span aria-hidden>→</span>}");

  const propText = props.length > 0 ? ` ${props.join(" ")}` : "";

  return `import { Button } from "@noctra/react";\n\nexport function Example() {\n  return <Button${propText}>${state.label}</Button>;\n}`;
}