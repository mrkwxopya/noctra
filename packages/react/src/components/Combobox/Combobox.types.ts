import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcComboboxVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcComboboxPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface ComboboxOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  group?: string;
  disabled?: boolean;
  keywords?: string[];
  tone?: NcTone;
}

export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "onSelect" | "placeholder" | "readOnly" | "required" | "size" | "value"> {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, option: ComboboxOption | null) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  emptyMessage?: ReactNode;
  variant?: NcComboboxVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  placement?: NcComboboxPlacement;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  openLabel?: string;
  clearLabel?: string;
}
