import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcFocusTrapVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcFocusTrapInitialFocus = "first" | "container" | "none";

export interface FocusTrapProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "loop" | "size" | "style"> {
  children?: ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  initialFocus?: NcFocusTrapInitialFocus;
  loop?: boolean;
  preventScroll?: boolean;
  variant?: NcFocusTrapVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: FocusTrapStyle;
}

export type FocusTrapStyle = CSSProperties;
