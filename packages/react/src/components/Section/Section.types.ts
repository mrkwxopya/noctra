import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSectionVariant = "surface" | "soft" | "outline" | "filled" | "ghost" | "elevated";
export type NcSectionAlign = "left" | "center" | "right";
export type NcSectionHeaderLayout = "stacked" | "split";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "align" | "children" | "disabled" | "size" | "style" | "title" | "width"> {
  children?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  align?: NcSectionAlign;
  headerLayout?: NcSectionHeaderLayout;
  padded?: boolean;
  bleed?: boolean;
  width?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  variant?: NcSectionVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: SectionStyle;
}

export type SectionStyle = CSSProperties & {
  "--nc-section-width"?: string;
  "--nc-section-min-height"?: string;
  "--nc-section-max-width"?: string;
};
