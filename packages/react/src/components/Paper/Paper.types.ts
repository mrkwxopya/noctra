import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcPaperVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcPaperShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type NcPaperPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface PaperProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "muted" | "selected" | "size" | "style" | "width"> {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  aside?: ReactNode;
  padding?: NcPaperPadding | number | string;
  shadow?: NcPaperShadow;
  interactive?: boolean;
  selected?: boolean;
  muted?: boolean;
  width?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  variant?: NcPaperVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: PaperStyle;
}

export type PaperStyle = CSSProperties & {
  "--nc-paper-padding"?: string;
  "--nc-paper-width"?: string;
  "--nc-paper-min-height"?: string;
  "--nc-paper-max-width"?: string;
};
