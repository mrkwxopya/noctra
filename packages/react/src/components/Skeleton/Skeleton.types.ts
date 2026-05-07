import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSkeletonVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcSkeletonShape = "rect" | "circle" | "text" | "card";
export type NcSkeletonAnimation = "pulse" | "shimmer" | "none";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "height" | "label" | "loading" | "shape" | "size" | "style" | "width"> {
  children?: ReactNode;
  loading?: boolean;
  label?: string;
  shape?: NcSkeletonShape;
  animation?: NcSkeletonAnimation;
  lines?: number;
  width?: number | string;
  height?: number | string;
  variant?: NcSkeletonVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: SkeletonStyle;
}

export type SkeletonStyle = CSSProperties & {
  "--nc-skeleton-width"?: string;
  "--nc-skeleton-height"?: string;
  "--nc-skeleton-lines"?: string;
};
