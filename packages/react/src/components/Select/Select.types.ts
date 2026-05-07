import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSelectVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcSelectPlacement = "top" | "bottom";
export type NcSelectWidth = "auto" | "xs" | "sm" | "md" | "lg" | "full";

export interface SelectOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  rightSection?: ReactNode;
  badge?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
  tone?: NcTone;
}

export interface SelectGroup {
  id: string;
  label?: ReactNode;
  options: SelectOption[];
  separated?: boolean;
  tone?: NcTone;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value" | "width"> {
  children?: ReactNode;
  options?: SelectOption[];
  groups?: SelectGroup[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, option: SelectOption | null) => void;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: ReactNode;
  emptyMessage?: ReactNode;
  clearLabel?: string;
  variant?: NcSelectVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  required?: boolean;
  invalid?: boolean;
  placement?: NcSelectPlacement;
  width?: NcSelectWidth;
  withBorder?: boolean;
  fullWidth?: boolean;
  closeOnSelect?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  keepMounted?: boolean;
  maxDropdownHeight?: number | string;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: SelectStyle;
}

export type SelectStyle = CSSProperties & {
  "--nc-select-max-dropdown-height"?: string;
};
