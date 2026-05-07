import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { WeekInputProps } from "./WeekInput.types";

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

function getIsoWeekValue(date: Date): string {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function normalizeWeekValue(value: string | undefined): string {
  if (!value) return "";

  const trimmedValue = value.trim();

  if (/^\d{4}-W\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return trimmedValue;
  }

  return getIsoWeekValue(parsedDate);
}

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const pickerIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M6.25 2.5A.75.75 0 0 1 7 3.25V4h6v-.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 17.5 6.75v7.5A2.75 2.75 0 0 1 14.75 17H5.25A2.75 2.75 0 0 1 2.5 14.25v-7.5A2.75 2.75 0 0 1 5.25 4h.25v-.75a.75.75 0 0 1 .75-.75ZM4 8v6.25c0 .69.56 1.25 1.25 1.25h9.5c.69 0 1.25-.56 1.25-1.25V8H4Z" />
    <path d="M6.25 10A.75.75 0 0 1 7 9.25h6a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75Zm0 3A.75.75 0 0 1 7 12.25h6a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

export const WeekInput = forwardRef<HTMLDivElement, WeekInputProps>(function WeekInput(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = "",
    onValueChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    placeholder,
    leftSection,
    rightSection,
    clearLabel = "Clear week",
    pickerLabel = "Open week picker",
    minWeek,
    maxWeek,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    clearable = false,
    fullWidth = true,
    withBorder = true,
    inputProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const inputId = inputProps?.id ?? `${rootId}-input`;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(normalizeWeekValue(defaultValue));
  const currentValue = normalizeWeekValue(isControlled ? value : internalValue);
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  function setWeekValue(nextValue: string): void {
    const normalizedNextValue = normalizeWeekValue(nextValue);

    if (!isControlled) {
      setInternalValue(normalizedNextValue);
    }

    onValueChange?.(normalizedNextValue);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setWeekValue(event.currentTarget.value);
    }
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setWeekValue("");
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-week-input-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: currentValue ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-week-input__header">
          {label ? (
            <label htmlFor={inputId} className="nc-week-input__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-week-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-week-input__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-week-input__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        <input
          {...inputProps}
          id={inputId}
          className={cx("nc-week-input__input", inputProps?.className)}
          type="week"
          value={currentValue}
          min={normalizeWeekValue(minWeek) || inputProps?.min}
          max={normalizeWeekValue(maxWeek) || inputProps?.max}
          placeholder={placeholder ?? inputProps?.placeholder}
          disabled={disabled || inputProps?.disabled}
          readOnly={readOnly || inputProps?.readOnly}
          required={required || inputProps?.required}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          onChange={handleInputChange}
          {...ncSlot("input")}
        />

        {clearable && currentValue && !disabled && !readOnly ? (
          <button type="button" className="nc-week-input__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        <span className="nc-week-input__picker" aria-label={pickerLabel} aria-hidden="true" {...ncSlot("picker")}>
          {pickerIcon}
        </span>

        {rightSection ? (
          <span className="nc-week-input__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-week-input__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});