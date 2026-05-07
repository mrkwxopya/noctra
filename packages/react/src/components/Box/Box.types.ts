import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcBoxVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcBoxDisplay = "block" | "inline-block" | "flex" | "inline-flex" | "grid" | "inline-grid";
export type NcBoxOverflow = "visible" | "hidden" | "clip" | "auto" | "scroll";

export interface BoxProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "height" | "size" | "style" | "width"> {
  children?: ReactNode;
  display?: NcBoxDisplay;
  padding?: number | string;
  margin?: number | string;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  overflow?: NcBoxOverflow;
  shadow?: boolean;
  variant?: NcBoxVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: BoxStyle;
}

export type BoxStyle = CSSProperties & {
  "--nc-box-padding"?: string;
  "--nc-box-margin"?: string;
  "--nc-box-width"?: string;
  "--nc-box-height"?: string;
  "--nc-box-min-width"?: string;
  "--nc-box-min-height"?: string;
  "--nc-box-max-width"?: string;
  "--nc-box-max-height"?: string;
};
