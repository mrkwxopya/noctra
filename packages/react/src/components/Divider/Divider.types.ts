import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDividerVariant = "surface" | "soft" | "outline" | "filled" | "ghost" | "dashed";
export type NcDividerOrientation = "horizontal" | "vertical";
export type NcDividerLabelPosition = "start" | "center" | "end";

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "label" | "size" | "style"> {
  children?: ReactNode;
  label?: ReactNode;
  orientation?: NcDividerOrientation;
  labelPosition?: NcDividerLabelPosition;
  decorative?: boolean;
  inset?: boolean;
  thickness?: number | string;
  length?: number | string;
  variant?: NcDividerVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: DividerStyle;
}

export type DividerStyle = CSSProperties & {
  "--nc-divider-thickness"?: string;
  "--nc-divider-length"?: string;
};
