import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcLayoutShellVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcLayoutShellMode = "fluid" | "contained";
export type NcLayoutShellSidebarState = "expanded" | "collapsed" | "hidden";

export interface LayoutShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size"> {
  children?: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  variant?: NcLayoutShellVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  mode?: NcLayoutShellMode;
  disabled?: boolean;
  withBorder?: boolean;
  fixedHeader?: boolean;
  sidebarState?: NcLayoutShellSidebarState;
  asideState?: NcLayoutShellSidebarState;
}

export interface LayoutShellHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
  children?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  sticky?: boolean;
  withBorder?: boolean;
  tone?: NcTone;
}

export interface LayoutShellSidebarProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
  children?: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  position?: "left" | "right";
  state?: NcLayoutShellSidebarState;
  withBorder?: boolean;
  tone?: NcTone;
}

export interface LayoutShellMainProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children?: ReactNode;
  padded?: boolean;
}

export interface LayoutShellFooterProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children?: ReactNode;
  withBorder?: boolean;
  tone?: NcTone;
}
