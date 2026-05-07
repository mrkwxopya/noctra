import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSidebarVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcSidebarPosition = "left" | "right";
export type NcSidebarState = "expanded" | "collapsed" | "hidden";

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "size" | "title"> {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  logo?: ReactNode;
  actions?: ReactNode;
  variant?: NcSidebarVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  position?: NcSidebarPosition;
  state?: NcSidebarState;
  disabled?: boolean;
  withBorder?: boolean;
  collapsible?: boolean;
  compact?: boolean;
  scrollable?: boolean;
}
