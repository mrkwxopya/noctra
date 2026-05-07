import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcVisuallyHiddenVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface VisuallyHiddenProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "disabled" | "size" | "style"> {
  children?: ReactNode;
  focusable?: boolean;
  revealOnFocus?: boolean;
  variant?: NcVisuallyHiddenVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  style?: VisuallyHiddenStyle;
}

export type VisuallyHiddenStyle = CSSProperties;
