import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcMultiSelectVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcMultiSelectPlacement = "top" | "bottom";
export type NcMultiSelectWidth = "auto" | "xs" | "sm" | "md" | "lg" | "full";

export interface MultiSelectOption {
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

export interface MultiSelectGroup {
  id: string;
  label?: ReactNode;
  options: MultiSelectOption[];
  separated?: boolean;
  tone?: NcTone;
}

export interface MultiSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value" | "width"> {
  children?: ReactNode;
  options?: MultiSelectOption[];
  groups?: MultiSelectGroup[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], options: MultiSelectOption[]) => void;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: ReactNode;
  emptyMessage?: ReactNode;
  clearLabel?: string;
  removeLabel?: string;
  maxSelectedValues?: number;
  maxVisibleTags?: number;
  variant?: NcMultiSelectVariant;
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
  placement?: NcMultiSelectPlacement;
  width?: NcMultiSelectWidth;
  withBorder?: boolean;
  fullWidth?: boolean;
  closeOnSelect?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  keepMounted?: boolean;
  maxDropdownHeight?: number | string;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  optionButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: MultiSelectStyle;
}

export type MultiSelectStyle = CSSProperties & {
  "--nc-multi-select-max-dropdown-height"?: string;
};
