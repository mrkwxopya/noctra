import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcGroupVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcGroupAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type NcGroupJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type NcGroupWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface GroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "size" | "style" | "wrap"> {
  children?: ReactNode;
  align?: NcGroupAlign;
  justify?: NcGroupJustify;
  wrap?: NcGroupWrap;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  grow?: boolean;
  preventGrowOverflow?: boolean;
  inline?: boolean;
  variant?: NcGroupVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: GroupStyle;
}

export type GroupStyle = CSSProperties & {
  "--nc-group-gap"?: string;
  "--nc-group-row-gap"?: string;
  "--nc-group-column-gap"?: string;
};
