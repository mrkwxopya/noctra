import type { InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTimePickerVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "label" | "onChange" | "size" | "type" | "value"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  variant?: NcTimePickerVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  invalid?: boolean;
  withClearButton?: boolean;
  clearLabel?: string;
}
