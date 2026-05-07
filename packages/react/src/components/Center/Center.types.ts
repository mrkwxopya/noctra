import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCenterVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcCenterDirection = "row" | "column";

export interface CenterProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "height" | "size" | "style" | "width"> {
  children?: ReactNode;
  direction?: NcCenterDirection;
  gap?: number | string;
  width?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  inline?: boolean;
  grow?: boolean;
  variant?: NcCenterVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: CenterStyle;
}

export type CenterStyle = CSSProperties & {
  "--nc-center-gap"?: string;
  "--nc-center-width"?: string;
  "--nc-center-height"?: string;
  "--nc-center-min-height"?: string;
  "--nc-center-max-width"?: string;
};
