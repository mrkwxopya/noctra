import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcNumberInputVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcNumberInputClampBehavior = "strict" | "blur" | "none";

export interface NumberInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "max" | "min" | "onChange" | "placeholder" | "prefix" | "readOnly" | "required" | "size" | "step" | "style" | "value"> {
  children?: ReactNode;
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  placeholder?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
  variant?: NcNumberInputVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  hideControls?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  clampBehavior?: NcNumberInputClampBehavior;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children">;
  style?: NumberInputStyle;
}

export type NumberInputStyle = CSSProperties;
