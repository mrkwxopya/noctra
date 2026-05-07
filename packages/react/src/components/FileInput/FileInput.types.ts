import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcFileInputVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface FileInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "accept" | "children" | "defaultValue" | "disabled" | "label" | "multiple" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: File[] | null;
  defaultValue?: File[] | null;
  onValueChange?: (files: File[] | null) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  placeholder?: ReactNode;
  buttonLabel?: ReactNode;
  clearLabel?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  formatFileName?: (file: File) => ReactNode;
  emptyValueLabel?: ReactNode;
  variant?: NcFileInputVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue">;
  style?: FileInputStyle;
}

export type FileInputStyle = CSSProperties;
