import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcFlexVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcFlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type NcFlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type NcFlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type NcFlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface FlexProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "height" | "size" | "style" | "width" | "wrap"> {
  children?: ReactNode;
  direction?: NcFlexDirection;
  align?: NcFlexAlign;
  justify?: NcFlexJustify;
  wrap?: NcFlexWrap;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  basis?: number | string;
  grow?: boolean | number;
  shrink?: boolean | number;
  order?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  inline?: boolean;
  variant?: NcFlexVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: FlexStyle;
}

export type FlexStyle = CSSProperties & {
  "--nc-flex-gap"?: string;
  "--nc-flex-row-gap"?: string;
  "--nc-flex-column-gap"?: string;
  "--nc-flex-basis"?: string;
  "--nc-flex-grow"?: string;
  "--nc-flex-shrink"?: string;
  "--nc-flex-order"?: string;
  "--nc-flex-width"?: string;
  "--nc-flex-height"?: string;
  "--nc-flex-min-width"?: string;
  "--nc-flex-min-height"?: string;
  "--nc-flex-max-width"?: string;
  "--nc-flex-max-height"?: string;
};
