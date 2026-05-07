import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcPinCodeVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcPinCodeType = "numeric" | "alphanumeric" | "text";

export interface PinCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "autoFocus" | "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "type" | "value"> {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  length?: number;
  type?: NcPinCodeType;
  mask?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  separator?: ReactNode;
  separatorEvery?: number;
  variant?: NcPinCodeVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue" | "maxLength">;
  style?: PinCodeStyle;
}

export type PinCodeStyle = CSSProperties & {
  "--nc-pin-code-length"?: string;
};
