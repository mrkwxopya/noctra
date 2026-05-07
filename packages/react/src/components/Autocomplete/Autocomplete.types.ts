import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcAutocompleteVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcAutocompletePlacement = "top" | "bottom";
export type NcAutocompleteWidth = "auto" | "xs" | "sm" | "md" | "lg" | "full";
export type NcAutocompleteFilterMode = "contains" | "startsWith" | "none";

export interface AutocompleteOption {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  rightSection?: ReactNode;
  badge?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
  tone?: NcTone;
}

export interface AutocompleteGroup {
  id: string;
  label?: ReactNode;
  options: AutocompleteOption[];
  separated?: boolean;
  tone?: NcTone;
}

export interface AutocompleteProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value" | "width"> {
  children?: ReactNode;
  options?: AutocompleteOption[];
  groups?: AutocompleteGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, option: AutocompleteOption | null) => void;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  emptyMessage?: ReactNode;
  clearLabel?: string;
  variant?: NcAutocompleteVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  autoSelectFirstOption?: boolean;
  filterMode?: NcAutocompleteFilterMode;
  placement?: NcAutocompletePlacement;
  width?: NcAutocompleteWidth;
  withBorder?: boolean;
  fullWidth?: boolean;
  closeOnSelect?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  keepMounted?: boolean;
  maxDropdownHeight?: number | string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "value" | "defaultValue" | "onChange">;
  style?: AutocompleteStyle;
}

export type AutocompleteStyle = CSSProperties & {
  "--nc-autocomplete-max-dropdown-height"?: string;
};
