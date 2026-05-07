import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSimpleGridVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcSimpleGridMode = "fixed" | "fit" | "fill";
export type NcSimpleGridAlign = "start" | "center" | "end" | "stretch";
export type NcSimpleGridJustify = "start" | "center" | "end" | "stretch";

export interface SimpleGridProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "size" | "style" | "width"> {
  children?: ReactNode;
  columns?: number;
  minChildWidth?: number | string;
  mode?: NcSimpleGridMode;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  align?: NcSimpleGridAlign;
  justify?: NcSimpleGridJustify;
  width?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  inline?: boolean;
  grow?: boolean;
  variant?: NcSimpleGridVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: SimpleGridStyle;
}

export type SimpleGridStyle = CSSProperties & {
  "--nc-simple-grid-template-columns"?: string;
  "--nc-simple-grid-min-child-width"?: string;
  "--nc-simple-grid-gap"?: string;
  "--nc-simple-grid-row-gap"?: string;
  "--nc-simple-grid-column-gap"?: string;
  "--nc-simple-grid-width"?: string;
  "--nc-simple-grid-min-height"?: string;
  "--nc-simple-grid-max-width"?: string;
};
