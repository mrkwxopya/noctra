import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcLoaderVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcLoaderType = "spinner" | "dots" | "bars" | "pulse" | "ring";
export type NcLoaderLabelPosition = "right" | "bottom" | "none";

export interface LoaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "label" | "size" | "style" | "type"> {
  children?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  ariaLabel?: string;
  type?: NcLoaderType;
  labelPosition?: NcLoaderLabelPosition;
  variant?: NcLoaderVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  centered?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: LoaderStyle;
}

export type LoaderStyle = CSSProperties;
