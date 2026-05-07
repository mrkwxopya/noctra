import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCalendarVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcCalendarWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarLabels {
  previousMonth?: string;
  nextMonth?: string;
  monthSelect?: string;
  today?: string;
  selected?: string;
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "disabled" | "onChange" | "size" | "value"> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  renderDay?: (date: Date) => ReactNode;
  locale?: string;
  weekStartsOn?: NcCalendarWeekStart;
  labels?: CalendarLabels;
  variant?: NcCalendarVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  withOutsideDays?: boolean;
  withTodayButton?: boolean;
}
