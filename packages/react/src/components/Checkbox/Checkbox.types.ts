import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCheckboxVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcCheckboxLabelPosition = "right" | "left";

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLLabelElement>, "checked" | "children" | "defaultChecked" | "disabled" | "label" | "onChange" | "readOnly" | "required" | "size" | "style"> {
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
  indeterminate?: boolean;
  variant?: NcCheckboxVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  labelPosition?: NcCheckboxLabelPosition;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type">;
  style?: CheckboxStyle;
}

export type CheckboxStyle = CSSProperties;
