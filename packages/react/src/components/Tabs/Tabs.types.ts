import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTabsVariant = "surface" | "soft" | "outline" | "filled" | "ghost" | "pills" | "underline";
export type NcTabsOrientation = "horizontal" | "vertical";
export type NcTabsActivationMode = "automatic" | "manual";
export type NcTabsPlacement = "top" | "bottom" | "left" | "right";
export type NcTabsJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "loop" | "onChange" | "size" | "value"> {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: NcTabsVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  orientation?: NcTabsOrientation;
  placement?: NcTabsPlacement;
  activationMode?: NcTabsActivationMode;
  keepMounted?: boolean;
  loop?: boolean;
  withBorder?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export interface TabsListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "wrap"> {
  children?: ReactNode;
  justify?: NcTabsJustify;
  grow?: boolean;
  wrap?: boolean;
  sticky?: boolean;
}

export interface TabsTabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "label" | "onSelect" | "value"> {
  children?: ReactNode;
  value: string;
  label?: ReactNode;
  icon?: ReactNode;
  rightSection?: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  tone?: NcTone;
}

export interface TabsPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "value"> {
  children?: ReactNode;
  value: string;
  forceMount?: boolean;
  padded?: boolean;
}
