import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcContextMenuVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcContextMenuPlacement = "cursor" | "top" | "right" | "bottom" | "left";
export type NcContextMenuWidth = "auto" | "xs" | "sm" | "md" | "lg" | "full";
export type NcContextMenuItemType = "item" | "checkbox" | "radio" | "separator";

export interface ContextMenuItem {
  id: string;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  rightSection?: ReactNode;
  shortcut?: ReactNode;
  badge?: ReactNode;
  type?: NcContextMenuItemType;
  checked?: boolean;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  tone?: NcTone;
  closeOnSelect?: boolean;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  onSelect?: (item: ContextMenuItem) => void;
}

export interface ContextMenuGroup {
  id: string;
  label?: ReactNode;
  items: ContextMenuItem[];
  separated?: boolean;
  tone?: NcTone;
}

export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "content" | "disabled" | "label" | "loop" | "onSelect" | "size" | "style" | "width"> {
  children?: ReactNode;
  items?: ContextMenuItem[];
  groups?: ContextMenuGroup[];
  label?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  onItemSelect?: (item: ContextMenuItem) => void;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string, item: ContextMenuItem) => void;
  variant?: NcContextMenuVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  placement?: NcContextMenuPlacement;
  width?: NcContextMenuWidth;
  withBorder?: boolean;
  withShortcuts?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnSelect?: boolean;
  keepMounted?: boolean;
  loop?: boolean;
  preventDefault?: boolean;
  x?: number;
  y?: number;
  ariaLabel?: string;
  style?: ContextMenuStyle;
}

export type ContextMenuStyle = CSSProperties & {
  "--nc-context-menu-x"?: string;
  "--nc-context-menu-y"?: string;
};
