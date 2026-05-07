import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcKbdVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "size" | "style"> {
  children?: ReactNode;
  keys?: Array<string | number>;
  separator?: ReactNode;
  variant?: NcKbdVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: KbdStyle;
}

export type KbdStyle = CSSProperties;
