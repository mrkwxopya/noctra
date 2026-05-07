import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcPinInputVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcPinInputType = "numeric" | "alphanumeric" | "text";
export type NcPinInputSeparatorMode = "none" | "dash" | "space" | "custom";

export interface PinInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "autoFocus" | "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "type" | "value"> {
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
  placeholder?: string;
  separator?: ReactNode;
  separatorMode?: NcPinInputSeparatorMode;
  variant?: NcPinInputVariant;
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
  length?: number;
  groupSize?: number;
  type?: NcPinInputType;
  mask?: boolean;
  autoFocus?: boolean;
  oneTimeCode?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children">;
  style?: PinInputStyle;
}

export type PinInputStyle = CSSProperties;
