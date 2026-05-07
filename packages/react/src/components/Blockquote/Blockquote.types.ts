import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcBlockquoteVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcBlockquoteAlign = "left" | "center" | "right";

export interface BlockquoteProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "size" | "style" | "title"> {
  children?: ReactNode;
  title?: ReactNode;
  citation?: ReactNode;
  citeUrl?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  align?: NcBlockquoteAlign;
  variant?: NcBlockquoteVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: BlockquoteStyle;
}

export type BlockquoteStyle = CSSProperties;
