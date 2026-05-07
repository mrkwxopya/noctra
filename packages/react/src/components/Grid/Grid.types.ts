import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcGridVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcGridAlign = "start" | "center" | "end" | "stretch";
export type NcGridJustify = "start" | "center" | "end" | "stretch" | "between" | "around" | "evenly";
export type NcGridAutoFlow = "row" | "column" | "dense" | "row dense" | "column dense";

export interface GridProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "rows" | "size" | "style" | "width"> {
  children?: ReactNode;
  columns?: number | string;
  rows?: number | string;
  autoColumns?: string;
  autoRows?: string;
  autoFlow?: NcGridAutoFlow;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  align?: NcGridAlign;
  justify?: NcGridJustify;
  width?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  inline?: boolean;
  grow?: boolean;
  variant?: NcGridVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: GridStyle;
}

export type GridStyle = CSSProperties & {
  "--nc-grid-template-columns"?: string;
  "--nc-grid-template-rows"?: string;
  "--nc-grid-auto-columns"?: string;
  "--nc-grid-auto-rows"?: string;
  "--nc-grid-gap"?: string;
  "--nc-grid-row-gap"?: string;
  "--nc-grid-column-gap"?: string;
  "--nc-grid-width"?: string;
  "--nc-grid-min-height"?: string;
  "--nc-grid-max-width"?: string;
};
