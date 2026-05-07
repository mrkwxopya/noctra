import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcMenuVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcMenuPlacement = "top" | "right" | "bottom" | "left";
export type NcMenuAlign = "start" | "center" | "end";
export type NcMenuTrigger = "click" | "hover" | "focus" | "manual";
export type NcMenuWidth = "auto" | "xs" | "sm" | "md" | "lg" | "full";
export type NcMenuItemType = "item" | "checkbox" | "radio" | "separator";

export interface MenuItem {
  id: string;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  rightSection?: ReactNode;
  shortcut?: ReactNode;
  badge?: ReactNode;
  type?: NcMenuItemType;
  checked?: boolean;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
  tone?: NcTone;
  closeOnSelect?: boolean;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  onSelect?: (item: MenuItem) => void;
}

export interface MenuGroup {
  id: string;
  label?: ReactNode;
  items: MenuItem[];
  separated?: boolean;
  tone?: NcTone;
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "content" | "disabled" | "label" | "loop" | "onSelect" | "size" | "style" | "width"> {
  children?: ReactNode;
  triggerContent?: ReactNode;
  items?: MenuItem[];
  groups?: MenuGroup[];
  label?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  onItemSelect?: (item: MenuItem) => void;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string, item: MenuItem) => void;
  variant?: NcMenuVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  placement?: NcMenuPlacement;
  align?: NcMenuAlign;
  trigger?: NcMenuTrigger;
  width?: NcMenuWidth;
  withArrow?: boolean;
  withBorder?: boolean;
  withShortcuts?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnSelect?: boolean;
  keepMounted?: boolean;
  offset?: number;
  loop?: boolean;
  triggerButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  ariaLabel?: string;
  style?: MenuStyle;
}

export type MenuStyle = CSSProperties & {
  "--nc-menu-offset"?: string;
};
