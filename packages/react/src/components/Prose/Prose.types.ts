import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcProseVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcProseAlign = "left" | "center" | "right";
export type NcProseMeasure = "sm" | "md" | "lg" | "none";

export interface ProseProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "size" | "style"> {
  children?: ReactNode;
  lead?: ReactNode;
  footer?: ReactNode;
  align?: NcProseAlign;
  measure?: NcProseMeasure;
  variant?: NcProseVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: ProseStyle;
}

export type ProseStyle = CSSProperties;
