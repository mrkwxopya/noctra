import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcMonthInputVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface MonthInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  placeholder?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  clearLabel?: string;
  pickerLabel?: string;
  minMonth?: string;
  maxMonth?: string;
  variant?: NcMonthInputVariant;
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
  style?: MonthInputStyle;
}

export type MonthInputStyle = CSSProperties;
