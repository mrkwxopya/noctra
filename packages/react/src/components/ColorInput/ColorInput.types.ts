import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcColorInputVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcColorInputFormat = "hex" | "raw";

export interface ColorInputSwatch {
  value: string;
  label?: string;
}

export interface ColorInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value"> {
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
  swatchesLabel?: ReactNode;
  swatches?: ColorInputSwatch[];
  format?: NcColorInputFormat;
  variant?: NcColorInputVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  withPicker?: boolean;
  withPreview?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue">;
  pickerProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue">;
  style?: ColorInputStyle;
}

export type ColorInputStyle = CSSProperties & {
  "--nc-color-input-preview-color"?: string;
};
