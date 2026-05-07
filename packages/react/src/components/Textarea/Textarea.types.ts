import type { CSSProperties, HTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTextareaVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcTextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "maxLength" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value"> {
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
  footer?: ReactNode;
  counterLabel?: ReactNode;
  clearLabel?: string;
  variant?: NcTextareaVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  autosize?: boolean;
  resize?: NcTextareaResize;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  showCounter?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children">;
  style?: TextareaStyle;
}

export type TextareaStyle = CSSProperties & {
  "--nc-textarea-min-rows"?: string;
  "--nc-textarea-max-rows"?: string;
};
