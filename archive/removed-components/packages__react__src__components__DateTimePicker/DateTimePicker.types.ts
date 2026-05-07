import type { InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDateTimePickerVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface DateTimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "label" | "max" | "min" | "onChange" | "size" | "type" | "value"> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  minDateTime?: Date;
  maxDateTime?: Date;
  variant?: NcDateTimePickerVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  invalid?: boolean;
  withClearButton?: boolean;
  clearLabel?: string;
}
