import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCreditCardVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcCreditCardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export interface CreditCardValue {
  number?: string;
  name?: string;
  expiry?: string;
  cvc?: string;
}

export interface CreditCardLabels {
  number?: ReactNode;
  name?: ReactNode;
  expiry?: ReactNode;
  cvc?: ReactNode;
}

export interface CreditCardPlaceholders {
  number?: string;
  name?: string;
  expiry?: string;
  cvc?: string;
}

export interface CreditCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: CreditCardValue;
  defaultValue?: CreditCardValue;
  onValueChange?: (value: CreditCardValue) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  labels?: CreditCardLabels;
  placeholders?: CreditCardPlaceholders;
  previewLabel?: ReactNode;
  brand?: NcCreditCardBrand;
  variant?: NcCreditCardVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  maskNumber?: boolean;
  showPreview?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  numberInputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "value" | "defaultValue">;
  nameInputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "value" | "defaultValue">;
  expiryInputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "value" | "defaultValue">;
  cvcInputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "value" | "defaultValue">;
  style?: CreditCardStyle;
}

export type CreditCardStyle = CSSProperties;
