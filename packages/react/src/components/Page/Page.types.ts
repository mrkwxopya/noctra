import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcPageVariant = "surface" | "soft" | "outline" | "filled" | "ghost" | "elevated";
export type NcPageLayout = "default" | "centered" | "split" | "sidebar";
export type NcPageAlign = "left" | "center" | "right";

export interface PageProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "size" | "style" | "title" | "width"> {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  aside?: ReactNode;
  nav?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  layout?: NcPageLayout;
  align?: NcPageAlign;
  padded?: boolean;
  bleed?: boolean;
  stickyHeader?: boolean;
  stickySidebar?: boolean;
  width?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  variant?: NcPageVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: PageStyle;
}

export type PageStyle = CSSProperties & {
  "--nc-page-width"?: string;
  "--nc-page-min-height"?: string;
  "--nc-page-max-width"?: string;
};
