import { forwardRef, useMemo, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement, ReactNode } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CalendarProps, NcCalendarWeekStart } from "./Calendar.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null): void {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfterDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function getMonthGrid(month: Date, weekStartsOn: NcCalendarWeekStart): Date[] {
  const firstDay = startOfMonth(month);
  const offset = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(firstDay, -offset);

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function formatMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

function formatWeekday(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
}

function formatDayLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date);
}

const previousIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M12.78 4.22a.75.75 0 0 1 0 1.06L8.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);

const nextIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  props,
  ref
): ReactElement {
  const {
    className,
    value,
    defaultValue = null,
    onValueChange,
    month,
    defaultMonth,
    onMonthChange,
    minDate,
    maxDate,
    isDateDisabled,
    renderDay,
    locale = "en-US",
    weekStartsOn = 0,
    labels,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    withOutsideDays = true,
    withTodayButton = false,
    onKeyDown,
    ...rest
  } = props;

  const today = useMemo(() => startOfDay(new Date()), []);
  const selectedControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const selectedValue = selectedControlled ? value : internalValue;

  const monthControlled = month !== undefined;
  const [internalMonth, setInternalMonth] = useState<Date>(() => startOfMonth(defaultMonth ?? value ?? defaultValue ?? today));
  const visibleMonth = startOfMonth(monthControlled ? month : internalMonth);
  const dayGrid = useMemo(() => getMonthGrid(visibleMonth, weekStartsOn), [visibleMonth, weekStartsOn]);
  const weekdays = useMemo(() => dayGrid.slice(0, 7), [dayGrid]);

  function isDisabledDate(date: Date): boolean {
    if (disabled) return true;
    if (minDate && isBeforeDay(date, minDate)) return true;
    if (maxDate && isAfterDay(date, maxDate)) return true;
    return isDateDisabled?.(date) ?? false;
  }

  function setVisibleMonth(nextMonth: Date): void {
    const normalized = startOfMonth(nextMonth);

    if (!monthControlled) {
      setInternalMonth(normalized);
    }

    onMonthChange?.(normalized);
  }

  function selectDate(date: Date): void {
    if (isDisabledDate(date)) return;

    const normalized = startOfDay(date);

    if (!selectedControlled) {
      setInternalValue(normalized);
    }

    if (date.getMonth() !== visibleMonth.getMonth() || date.getFullYear() !== visibleMonth.getFullYear()) {
      setVisibleMonth(startOfMonth(date));
    }

    onValueChange?.(normalized);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) return;

    if (event.key === "PageUp") {
      event.preventDefault();
      setVisibleMonth(addMonths(visibleMonth, -1));
      return;
    }

    if (event.key === "PageDown") {
      event.preventDefault();
      setVisibleMonth(addMonths(visibleMonth, 1));
    }
  }

  function renderDayContent(date: Date): ReactNode {
    return renderDay ? renderDay(date) : date.getDate();
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-calendar-root", className)}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: selectedValue ? "selected" : "empty"
      })}
      {...rest}
    >
      <div className="nc-calendar__header" {...ncSlot("header")}>
        <button
          type="button"
          className="nc-calendar__nav-button"
          aria-label={labels?.previousMonth ?? "Previous month"}
          disabled={disabled}
          onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
          {...ncSlot("nav-button")}
        >
          {previousIcon}
        </button>

        <div className="nc-calendar__month-label" aria-live="polite" {...ncSlot("month-label")}>
          {formatMonth(visibleMonth, locale)}
        </div>

        <button
          type="button"
          className="nc-calendar__nav-button"
          aria-label={labels?.nextMonth ?? "Next month"}
          disabled={disabled}
          onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
          {...ncSlot("nav-button")}
        >
          {nextIcon}
        </button>
      </div>

      <div className="nc-calendar__grid" role="grid" aria-label={labels?.monthSelect ?? formatMonth(visibleMonth, locale)} {...ncSlot("grid")}>
        {weekdays.map((date) => (
          <div key={`weekday-${date.getDay()}`} className="nc-calendar__weekday" role="columnheader" {...ncSlot("weekday")}>
            {formatWeekday(date, locale)}
          </div>
        ))}

        {dayGrid.map((date) => {
          const outside = date.getMonth() !== visibleMonth.getMonth();
          const selected = isSameDay(date, selectedValue);
          const current = isSameDay(date, today);
          const dayDisabled = isDisabledDate(date) || (!withOutsideDays && outside);

          return (
            <button
              key={date.toISOString()}
              type="button"
              className="nc-calendar__day"
              role="gridcell"
              aria-label={`${formatDayLabel(date, locale)}${selected ? `, ${labels?.selected ?? "selected"}` : ""}${current ? `, ${labels?.today ?? "today"}` : ""}`}
              aria-selected={selected}
              disabled={dayDisabled}
              data-outside={outside || undefined}
              data-selected={selected || undefined}
              data-today={current || undefined}
              onClick={() => selectDate(date)}
              {...ncSlot("day")}
            >
              {withOutsideDays || !outside ? renderDayContent(date) : null}
            </button>
          );
        })}
      </div>

      {withTodayButton ? (
        <button
          type="button"
          className="nc-calendar__today-button"
          disabled={isDisabledDate(today)}
          onClick={() => {
            setVisibleMonth(today);
            selectDate(today);
          }}
          {...ncSlot("today-button")}
        >
          {labels?.today ?? "Today"}
        </button>
      ) : null}
    </div>
  );
});