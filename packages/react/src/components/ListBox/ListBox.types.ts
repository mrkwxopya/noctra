import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcListBoxVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type ListBoxValue = string | string[] | null;

export interface ListBoxOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  keywords?: string[];
}

export interface ListBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "multiple" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: ListBoxValue;
  defaultValue?: ListBoxValue;
  onValueChange?: (value: ListBoxValue) => void;
  options?: ListBoxOption[];
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  emptyMessage?: ReactNode;
  selectionLabel?: ReactNode;
  variant?: NcListBoxVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  maxHeight?: number | string;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: ListBoxStyle;
}

export type ListBoxStyle = CSSProperties & {
  "--nc-list-box-max-height"?: string;
};
