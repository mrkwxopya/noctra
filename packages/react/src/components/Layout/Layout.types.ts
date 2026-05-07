import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcLayoutVariant = "surface" | "soft" | "outline" | "filled" | "ghost" | "elevated";
export type NcLayoutMode = "default" | "sidebar" | "aside" | "split" | "dashboard";
export type NcLayoutSidebarPosition = "left" | "right";

export interface LayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size" | "style" | "width"> {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  aside?: ReactNode;
  toolbar?: ReactNode;
  mode?: NcLayoutMode;
  sidebarPosition?: NcLayoutSidebarPosition;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  stickySidebar?: boolean;
  collapsibleSidebar?: boolean;
  sidebarCollapsed?: boolean;
  padded?: boolean;
  bleed?: boolean;
  width?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  sidebarWidth?: number | string;
  asideWidth?: number | string;
  headerHeight?: number | string;
  footerHeight?: number | string;
  variant?: NcLayoutVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: LayoutStyle;
}

export type LayoutStyle = CSSProperties & {
  "--nc-layout-width"?: string;
  "--nc-layout-min-height"?: string;
  "--nc-layout-max-width"?: string;
  "--nc-layout-sidebar-width"?: string;
  "--nc-layout-aside-width"?: string;
  "--nc-layout-header-height"?: string;
  "--nc-layout-footer-height"?: string;
};
