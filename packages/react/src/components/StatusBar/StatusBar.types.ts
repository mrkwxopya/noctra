import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcStatusBarVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcStatusBarPosition = "static" | "sticky" | "fixed";
export type NcStatusBarPlacement = "top" | "bottom";
export type NcStatusBarAlign = "start" | "center" | "end" | "between";

export interface StatusBarItem {
  id: string;
  label: ReactNode;
  value?: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  tone?: NcTone;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "onClick">;
  onSelect?: (item: StatusBarItem) => void;
}

export interface StatusBarGroup {
  id: string;
  items: StatusBarItem[];
  label?: ReactNode;
  separated?: boolean;
  tone?: NcTone;
}

export interface StatusBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "onSelect" | "size" | "wrap"> {
  children?: ReactNode;
  items?: StatusBarItem[];
  groups?: StatusBarGroup[];
  startSection?: ReactNode;
  centerSection?: ReactNode;
  endSection?: ReactNode;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string, item: StatusBarItem) => void;
  onItemSelect?: (item: StatusBarItem) => void;
  variant?: NcStatusBarVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  position?: NcStatusBarPosition;
  placement?: NcStatusBarPlacement;
  align?: NcStatusBarAlign;
  withBorder?: boolean;
  withValues?: boolean;
  withLabels?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  wrap?: boolean;
  ariaLabel?: string;
}
