import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcAppShellVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcAppShellMode = "fluid" | "contained";
export type NcAppShellNavigationState = "expanded" | "collapsed" | "hidden";

export interface AppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size"> {
  children?: ReactNode;
  logo?: ReactNode;
  brand?: ReactNode;
  header?: ReactNode;
  navbar?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  toolbar?: ReactNode;
  actions?: ReactNode;
  variant?: NcAppShellVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  mode?: NcAppShellMode;
  disabled?: boolean;
  withBorder?: boolean;
  fixedHeader?: boolean;
  navbarState?: NcAppShellNavigationState;
  asideState?: NcAppShellNavigationState;
}
