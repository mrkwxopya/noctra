import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcColorPickerVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcColorPickerFormat = "hex" | "raw";

export interface ColorPickerSwatch {
  value: string;
  label?: string;
}

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color" | "defaultValue" | "disabled" | "label" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  swatches?: ColorPickerSwatch[];
  swatchesLabel?: ReactNode;
  pickerLabel?: string;
  previewLabel?: ReactNode;
  valueLabel?: ReactNode;
  format?: NcColorPickerFormat;
  variant?: NcColorPickerVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  withPreview?: boolean;
  withValue?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue">;
  style?: ColorPickerStyle;
}

export type ColorPickerStyle = CSSProperties & {
  "--nc-color-picker-value"?: string;
};
