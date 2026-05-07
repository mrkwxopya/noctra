import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCommandBarVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcCommandBarPlacement = "inline" | "top" | "bottom" | "floating";
export type NcCommandBarSelectionMode = "single" | "none";

export interface CommandBarAction {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  shortcut?: ReactNode;
  section?: string;
  keywords?: string[];
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  tone?: NcTone;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "onClick">;
  onSelect?: (action: CommandBarAction) => void;
}

export interface CommandBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "autoFocus" | "children" | "defaultValue" | "disabled" | "label" | "onSelect" | "placeholder" | "readOnly" | "size" | "value"> {
  children?: ReactNode;
  actions?: CommandBarAction[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string, action: CommandBarAction) => void;
  onActionSelect?: (action: CommandBarAction) => void;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  emptyMessage?: ReactNode;
  variant?: NcCommandBarVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  placement?: NcCommandBarPlacement;
  selectionMode?: NcCommandBarSelectionMode;
  searchable?: boolean;
  clearable?: boolean;
  withBorder?: boolean;
  withShortcuts?: boolean;
  fullWidth?: boolean;
  compact?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
}
