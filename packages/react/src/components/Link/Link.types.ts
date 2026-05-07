import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcLinkVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcLinkUnderline = "always" | "hover" | "never";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "disabled" | "prefix" | "size" | "style"> {
  children?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  externalIcon?: ReactNode;
  variant?: NcLinkVariant;
  underline?: NcLinkUnderline;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  active?: boolean;
  external?: boolean;
  truncate?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: LinkStyle;
}

export type LinkStyle = CSSProperties;
