import type { CSSProperties, InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcRadioVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcRadioLabelPosition = "right" | "left";

export interface RadioProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "checked" | "children" | "defaultChecked" | "disabled" | "label" | "name" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  icon?: ReactNode;
  name?: string;
  value?: string;
  variant?: NcRadioVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  labelPosition?: NcRadioLabelPosition;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type">;
  style?: RadioStyle;
}

export type RadioStyle = CSSProperties;
