import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcContainerVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcContainerWidth = "xs" | "sm" | "md" | "lg" | "xl" | "full" | "fluid";

export interface ContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size" | "style" | "width"> {
  children?: ReactNode;
  containerWidth?: NcContainerWidth;
  width?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  centered?: boolean;
  bleed?: boolean;
  padded?: boolean;
  variant?: NcContainerVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: ContainerStyle;
}

export type ContainerStyle = CSSProperties & {
  "--nc-container-width"?: string;
  "--nc-container-max-width"?: string;
  "--nc-container-min-height"?: string;
};
