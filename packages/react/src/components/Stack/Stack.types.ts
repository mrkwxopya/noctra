import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcStackVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcStackDirection = "row" | "column";
export type NcStackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type NcStackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type NcStackWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface StackProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "size" | "style" | "wrap"> {
  children?: ReactNode;
  direction?: NcStackDirection;
  align?: NcStackAlign;
  justify?: NcStackJustify;
  wrap?: NcStackWrap;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  reverse?: boolean;
  inline?: boolean;
  grow?: boolean;
  variant?: NcStackVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: StackStyle;
}

export type StackStyle = CSSProperties & {
  "--nc-stack-gap"?: string;
  "--nc-stack-row-gap"?: string;
  "--nc-stack-column-gap"?: string;
};
