import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcPasswordInputVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcPasswordInputStrength = "none" | "weak" | "medium" | "strong";

export interface PasswordInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "prefix" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
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
  revealLabel?: string;
  hideLabel?: string;
  strength?: NcPasswordInputStrength;
  strengthLabel?: ReactNode;
  variant?: NcPasswordInputVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  revealable?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children">;
  style?: PasswordInputStyle;
}

export type PasswordInputStyle = CSSProperties;
