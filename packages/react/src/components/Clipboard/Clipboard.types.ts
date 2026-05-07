import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcClipboardVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcClipboardMode = "input" | "display" | "button";

export interface ClipboardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  copyText?: string;
  onValueChange?: (value: string) => void;
  onCopied?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
  copied?: boolean;
  defaultCopied?: boolean;
  copiedTimeout?: number;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  placeholder?: string;
  copyLabel?: ReactNode;
  copiedLabel?: ReactNode;
  clearLabel?: string;
  icon?: ReactNode;
  copiedIcon?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  mode?: NcClipboardMode;
  variant?: NcClipboardVariant;
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
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "value" | "defaultValue">;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: ClipboardStyle;
}

export type ClipboardStyle = CSSProperties;
