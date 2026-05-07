import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcToolbarVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcToolbarOrientation = "horizontal" | "vertical";
export type NcToolbarAlign = "start" | "center" | "end" | "stretch";
export type NcToolbarJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export interface ToolbarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  shortcut?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  tone?: NcTone;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "onClick">;
  onSelect?: (item: ToolbarItem) => void;
}

export interface ToolbarGroup {
  id: string;
  label?: ReactNode;
  items: ToolbarItem[];
  separated?: boolean;
  tone?: NcTone;
}

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "disabled" | "label" | "onSelect" | "size" | "title" | "wrap"> {
  children?: ReactNode;
  items?: ToolbarItem[];
  groups?: ToolbarGroup[];
  label?: ReactNode;
  description?: ReactNode;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string, item: ToolbarItem) => void;
  variant?: NcToolbarVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  orientation?: NcToolbarOrientation;
  align?: NcToolbarAlign;
  justify?: NcToolbarJustify;
  withBorder?: boolean;
  withLabels?: boolean;
  withShortcuts?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  wrap?: boolean;
  ariaLabel?: string;
}
