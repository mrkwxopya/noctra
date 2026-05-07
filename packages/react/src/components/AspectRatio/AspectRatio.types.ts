import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcAspectRatioVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcAspectRatioFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type NcAspectRatioPreset = "square" | "video" | "wide" | "ultrawide" | "portrait" | "golden";

export interface AspectRatioProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size" | "style" | "width"> {
  children?: ReactNode;
  ratio?: number | string;
  preset?: NcAspectRatioPreset;
  fit?: NcAspectRatioFit;
  width?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  variant?: NcAspectRatioVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: AspectRatioStyle;
}

export type AspectRatioStyle = CSSProperties & {
  "--nc-aspect-ratio"?: string;
  "--nc-aspect-ratio-width"?: string;
  "--nc-aspect-ratio-min-height"?: string;
  "--nc-aspect-ratio-max-height"?: string;
};
