import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDatePickerVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcDatePickerWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DatePickerLabels {
  previousMonth?: string;
  nextMonth?: string;
  today?: string;
  clear?: string;
  selectDate?: string;
}

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  month?: string;
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  footer?: ReactNode;
  labels?: DatePickerLabels;
  weekdayLabels?: string[];
  monthFormatter?: (month: string) => ReactNode;
  dayFormatter?: (date: string) => ReactNode;
  isDateDisabled?: (date: string) => boolean;
  minDate?: string;
  maxDate?: string;
  variant?: NcDatePickerVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  withTodayButton?: boolean;
  clearable?: boolean;
  weekStart?: NcDatePickerWeekStart;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: DatePickerStyle;
}

export type DatePickerStyle = CSSProperties;
