import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize } from "../../shared/system.types";

export type NcSearchInputVariant = "outline" | "surface" | "filled" | "flushed" | "unstyled";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "label" | "loading" | "size" | "type"> {
  variant?: NcSearchInputVariant;
  size?: NcSize;
  radius?: NcRadius;
  density?: NcDensity;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  valid?: boolean;
  loading?: boolean;
  clearable?: boolean;
  searchIcon?: ReactNode;
  clearLabel?: string;
  onClear?: () => void;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}
