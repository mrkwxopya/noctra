import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDateRangePickerVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcDateRangePickerWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DateRangePickerValue = [string | null, string | null];

export interface DateRangePickerLabels {
  previousMonth?: string;
  nextMonth?: string;
  today?: string;
  clear?: string;
  selectStartDate?: string;
  selectEndDate?: string;
  start?: string;
  end?: string;
}

export interface DateRangePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: DateRangePickerValue;
  defaultValue?: DateRangePickerValue;
  onValueChange?: (value: DateRangePickerValue) => void;
  month?: string;
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  footer?: ReactNode;
  labels?: DateRangePickerLabels;
  weekdayLabels?: string[];
  monthFormatter?: (month: string) => ReactNode;
  dayFormatter?: (date: string) => ReactNode;
  isDateDisabled?: (date: string) => boolean;
  minDate?: string;
  maxDate?: string;
  variant?: NcDateRangePickerVariant;
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
  numberOfMonths?: 1 | 2;
  weekStart?: NcDateRangePickerWeekStart;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: DateRangePickerStyle;
}

export type DateRangePickerStyle = CSSProperties;
