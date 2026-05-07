import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcSize } from "../../shared/system.types";

export type NcFormFieldVariant = "default" | "surface" | "inline" | "compact";
export type NcFormFieldOrientation = "vertical" | "horizontal";

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "disabled" | "label" | "required" | "size" | "title"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: NcSize;
  density?: NcDensity;
  variant?: NcFormFieldVariant;
  orientation?: NcFormFieldOrientation;
  controlId?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
}

export interface FormFieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export interface FormFieldMessageProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "description" | "hint" | "error" | "success";
}
