import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCommandVariant = "surface" | "soft" | "filled" | "ghost";
export type NcCommandPlacement = "center" | "top";
export type NcCommandItemKind = "item" | "label" | "separator";

export interface CommandItem {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  shortcut?: ReactNode;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  danger?: boolean;
  kind?: NcCommandItemKind;
}

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "onChange" | "placeholder" | "size"> {
  items: CommandItem[];
  trigger?: ReactNode;
  heading?: ReactNode;
  placeholder?: string;
  emptyMessage?: ReactNode;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  onItemSelect?: (item: CommandItem) => void;
  variant?: NcCommandVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  placement?: NcCommandPlacement;
  disabled?: boolean;
  closeOnEscape?: boolean;
  closeOnSelect?: boolean;
  triggerLabel?: string;
  searchLabel?: string;
}
