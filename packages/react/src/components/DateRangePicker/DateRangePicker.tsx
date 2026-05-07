import { forwardRef, useId, useMemo, useState } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { DateRangePickerProps, DateRangePickerValue, NcDateRangePickerWeekStart } from "./DateRangePicker.types";

interface CalendarCell {
  key: string;
  date: string | null;
  day: number | null;
  outside: boolean;
}

const defaultWeekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null): void {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function normalizeDateValue(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmedValue = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return toDateString(parsedDate);
}

function normalizeRangeValue(value: DateRangePickerValue | undefined): DateRangePickerValue {
  const start = normalizeDateValue(value?.[0]);
  const end = normalizeDateValue(value?.[1]);

  if (start && end && start > end) {
    return [end, start];
  }

  return [start, end];
}

function normalizeMonthValue(value: string | null | undefined, fallbackRange?: DateRangePickerValue): string {
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    return value;
  }

  const fallbackDate = fallbackRange?.[0] ?? fallbackRange?.[1] ?? null;
  const dateValue = normalizeDateValue(value ?? fallbackDate);

  if (dateValue) {
    return dateValue.slice(0, 7);
  }

  return toDateString(new Date()).slice(0, 7);
}

function getMonthDate(month: string): Date {
  const [year = "1970", monthIndex = "01"] = month.split("-");
  return new Date(Number(year), Number(monthIndex) - 1, 1);
}

function addMonths(month: string, amount: number): string {
  const date = getMonthDate(month);
  date.setMonth(date.getMonth() + amount);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function getDaysInMonth(month: string): number {
  const date = getMonthDate(month);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function formatMonthLabel(month: string): string {
  const date = getMonthDate(month);
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(date);
}

function buildCalendarCells(month: string, weekStart: NcDateRangePickerWeekStart): CalendarCell[] {
  const monthDate = getMonthDate(month);
  const daysInMonth = getDaysInMonth(month);
  const firstDay = monthDate.getDay();
  const leadingDays = (firstDay - weekStart + 7) % 7;
  const cells: CalendarCell[] = [];

  for (let index = 0; index < leadingDays; index += 1) {
    cells.push({ key: `empty-start-${index}`, date: null, day: null, outside: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    cells.push({ key: toDateString(date), date: toDateString(date), day, outside: false });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `empty-end-${cells.length}`, date: null, day: null, outside: true });
  }

  return cells;
}

function rotateWeekdays(labels: string[], weekStart: NcDateRangePickerWeekStart): string[] {
  const normalizedLabels = labels.length >= 7 ? labels.slice(0, 7) : defaultWeekdayLabels;
  return [...normalizedLabels.slice(weekStart), ...normalizedLabels.slice(0, weekStart)];
}

function isBeforeDate(date: string, minDate: string | null): boolean {
  return minDate !== null && date < minDate;
}

function isAfterDate(date: string, maxDate: string | null): boolean {
  return maxDate !== null && date > maxDate;
}

function isBetween(date: string, start: string | null, end: string | null): boolean {
  return start !== null && end !== null && date > start && date < end;
}

function isRangeEdge(date: string, start: string | null, end: string | null): "start" | "end" | "both" | null {
  if (start === date && end === date) return "both";
  if (start === date) return "start";
  if (end === date) return "end";
  return null;
}

const previousIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M12.78 4.22a.75.75 0 0 1 0 1.06L8.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);

const nextIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L11.94 10L7.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateRangePicker(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue,
    onValueChange,
    month,
    defaultMonth,
    onMonthChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    footer,
    labels,
    weekdayLabels = defaultWeekdayLabels,
    monthFormatter,
    dayFormatter,
    isDateDisabled,
    minDate,
    maxDate,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    fullWidth = false,
    withBorder = true,
    withTodayButton = true,
    clearable = true,
    numberOfMonths = 2,
    weekStart = 0,
    buttonProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const isValueControlled = value !== undefined;
  const isMonthControlled = month !== undefined;
  const normalizedDefaultValue = normalizeRangeValue(defaultValue);
  const [internalValue, setInternalValue] = useState<DateRangePickerValue>(normalizedDefaultValue);
  const [internalMonth, setInternalMonth] = useState(() => normalizeMonthValue(defaultMonth, normalizedDefaultValue));
  const currentValue = isValueControlled ? normalizeRangeValue(value) : internalValue;
  const currentMonth = isMonthControlled ? normalizeMonthValue(month, currentValue) : internalMonth;
  const visibleMonthCount = numberOfMonths === 1 ? 1 : 2;
  const visibleMonths = useMemo(() => Array.from({ length: visibleMonthCount }, (_, index) => addMonths(currentMonth, index)), [currentMonth, visibleMonthCount]);
  const visibleWeekdays = useMemo(() => rotateWeekdays(weekdayLabels, weekStart), [weekdayLabels, weekStart]);
  const today = toDateString(new Date());
  const normalizedMinDate = normalizeDateValue(minDate);
  const normalizedMaxDate = normalizeDateValue(maxDate);
  const [startDate, endDate] = currentValue;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const hasActions = withTodayButton || clearable;

  function setMonthValue(nextMonth: string): void {
    if (disabled || readOnly) return;

    if (!isMonthControlled) {
      setInternalMonth(nextMonth);
    }

    onMonthChange?.(nextMonth);
  }

  function setRangeValue(nextValue: DateRangePickerValue): void {
    if (disabled || readOnly) return;

    const normalizedNextValue = normalizeRangeValue(nextValue);

    if (!isValueControlled) {
      setInternalValue(normalizedNextValue);
    }

    const nextVisibleDate = normalizedNextValue[0] ?? normalizedNextValue[1];

    if (nextVisibleDate) {
      setMonthValue(nextVisibleDate.slice(0, 7));
    }

    onValueChange?.(normalizedNextValue);
  }

  function isDisabledDate(date: string): boolean {
    return Boolean(
      disabled ||
        readOnly ||
        isBeforeDate(date, normalizedMinDate) ||
        isAfterDate(date, normalizedMaxDate) ||
        isDateDisabled?.(date)
    );
  }

  function handleDateSelect(date: string): void {
    if (isDisabledDate(date)) return;

    if (!startDate || (startDate && endDate)) {
      setRangeValue([date, null]);
      return;
    }

    if (date < startDate) {
      setRangeValue([date, startDate]);
      return;
    }

    setRangeValue([startDate, date]);
  }

  function renderCalendar(renderMonth: string): ReactElement {
    const cells = buildCalendarCells(renderMonth, weekStart);

    return (
      <div key={renderMonth} className="nc-date-range-picker__calendar" {...ncSlot("calendar")}>
        <div className="nc-date-range-picker__header" {...ncSlot("header")}>
          {renderMonth === currentMonth ? (
            <button
              type="button"
              className="nc-date-range-picker__nav"
              aria-label={labels?.previousMonth ?? "Previous month"}
              disabled={disabled}
              onClick={() => setMonthValue(addMonths(currentMonth, -1))}
              {...ncSlot("previous")}
            >
              {previousIcon}
            </button>
          ) : (
            <span />
          )}

          <div className="nc-date-range-picker__month" aria-live="polite" {...ncSlot("month")}>
            {monthFormatter ? monthFormatter(renderMonth) : formatMonthLabel(renderMonth)}
          </div>

          {renderMonth === visibleMonths[visibleMonths.length - 1] ? (
            <button
              type="button"
              className="nc-date-range-picker__nav"
              aria-label={labels?.nextMonth ?? "Next month"}
              disabled={disabled}
              onClick={() => setMonthValue(addMonths(currentMonth, 1))}
              {...ncSlot("next")}
            >
              {nextIcon}
            </button>
          ) : (
            <span />
          )}
        </div>

        <div className="nc-date-range-picker__weekdays" aria-hidden="true" {...ncSlot("weekdays")}>
          {visibleWeekdays.map((weekday) => (
            <span key={`${renderMonth}-${weekday}`} className="nc-date-range-picker__weekday" {...ncSlot("weekday")}>
              {weekday}
            </span>
          ))}
        </div>

        <div className="nc-date-range-picker__grid" role="grid" aria-label={labels?.selectStartDate ?? "Select date range"} {...ncSlot("grid")}>
          {cells.map((cell) => {
            if (!cell.date || cell.day === null) {
              return <span key={cell.key} className="nc-date-range-picker__cell" data-outside {...ncSlot("cell")} />;
            }

            const edge = isRangeEdge(cell.date, startDate, endDate);
            const selected = edge !== null;
            const inRange = isBetween(cell.date, startDate, endDate);
            const isToday = today === cell.date;
            const dateDisabled = isDisabledDate(cell.date);

            return (
              <span
                key={cell.key}
                className="nc-date-range-picker__cell"
                data-selected={selected || undefined}
                data-range-start={edge === "start" || edge === "both" || undefined}
                data-range-end={edge === "end" || edge === "both" || undefined}
                data-in-range={inRange || undefined}
                data-today={isToday || undefined}
                data-disabled={dateDisabled || undefined}
                {...ncSlot("cell")}
              >
                <button
                  {...buttonProps}
                  type="button"
                  className={cx("nc-date-range-picker__day", buttonProps?.className)}
                  disabled={dateDisabled || buttonProps?.disabled}
                  aria-pressed={selected}
                  aria-current={isToday ? "date" : undefined}
                  onClick={(event) => {
                    buttonProps?.onClick?.(event);

                    if (!event.defaultPrevented && cell.date) {
                      handleDateSelect(cell.date);
                    }
                  }}
                  {...ncSlot("day")}
                >
                  {dayFormatter ? dayFormatter(cell.date) : cell.day}
                </button>
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-date-range-picker-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-months={visibleMonthCount}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: startDate && endDate ? "complete" : startDate ? "selecting" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-date-range-picker__meta">
          {label ? (
            <div className="nc-date-range-picker__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div className="nc-date-range-picker__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-date-range-picker__panel" {...ncSlot("panel")}>
        <div className="nc-date-range-picker__summary" {...ncSlot("summary")}>
          <span className="nc-date-range-picker__summary-item" data-filled={startDate || undefined} {...ncSlot("summary-item")}>
            <strong>{labels?.start ?? "Start"}</strong>
            {startDate ?? "—"}
          </span>
          <span className="nc-date-range-picker__summary-item" data-filled={endDate || undefined} {...ncSlot("summary-item")}>
            <strong>{labels?.end ?? "End"}</strong>
            {endDate ?? "—"}
          </span>
        </div>

        <div className="nc-date-range-picker__months">
          {visibleMonths.map((renderMonth) => renderCalendar(renderMonth))}
        </div>

        {hasActions ? (
          <div className="nc-date-range-picker__actions" {...ncSlot("actions")}>
            {withTodayButton ? (
              <button type="button" className="nc-date-range-picker__action" disabled={disabled || readOnly || isDisabledDate(today)} onClick={() => setRangeValue([today, today])} {...ncSlot("today")}>
                {labels?.today ?? "Today"}
              </button>
            ) : null}

            {clearable ? (
              <button type="button" className="nc-date-range-picker__action" disabled={disabled || readOnly || (!startDate && !endDate)} onClick={() => setRangeValue([null, null])} {...ncSlot("clear")}>
                {labels?.clear ?? "Clear"}
              </button>
            ) : null}
          </div>
        ) : null}

        {footer ? (
          <div className="nc-date-range-picker__footer" {...ncSlot("footer")}>
            {footer}
          </div>
        ) : null}
      </div>

      {hasMessage ? (
        <div className="nc-date-range-picker__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});