import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { DateTimePickerProps } from "./DateTimePicker.types";

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

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toLocalDateTimeValue(value: Date | null | undefined): string {
  if (!value) return "";

  const year = value.getFullYear();
  const month = pad(value.getMonth() + 1);
  const day = pad(value.getDate());
  const hour = pad(value.getHours());
  const minute = pad(value.getMinutes());

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function fromLocalDateTimeValue(value: string): Date | null {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const dateTimeIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.25 3.5A2.25 2.25 0 0 0 3 5.75v8.5a2.25 2.25 0 0 0 2.25 2.25h9.5A2.25 2.25 0 0 0 17 14.25v-8.5a2.25 2.25 0 0 0-2.25-2.25h-9.5ZM4.5 8v6.25c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75V8h-11Zm10.25-3h-9.5a.75.75 0 0 0-.75.75V6.5h11v-.75a.75.75 0 0 0-.75-.75Z" clipRule="evenodd" />
    <path d="M10.75 9.75a.75.75 0 0 0-1.5 0v2.16c0 .265.14.51.368.645l1.55.917a.75.75 0 1 0 .764-1.29l-1.182-.7V9.75Z" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(function DateTimePicker(
  props,
  ref
): ReactElement {
  const {
    className,
    value,
    defaultValue = null,
    onValueChange,
    label,
    description,
    error,
    minDateTime,
    maxDateTime,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    invalid,
    disabled,
    readOnly,
    required,
    withClearButton = true,
    clearLabel = "Clear date and time",
    id,
    placeholder,
    step,
    ...rest
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = label ? `${inputId}-label` : undefined;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const currentInputValue = toLocalDateTimeValue(currentValue);
  const minValue = toLocalDateTimeValue(minDateTime);
  const maxValue = toLocalDateTimeValue(maxDateTime);
  const isInvalid = invalid || Boolean(error);

  function commitValue(nextValue: Date | null): void {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    commitValue(fromLocalDateTimeValue(event.currentTarget.value));
  }

  return (
    <div
      className={cx("nc-date-time-picker-root", className)}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        invalid: isInvalid,
        state: currentValue ? "filled" : "empty"
      })}
    >
      {label ? (
        <label id={labelId} className="nc-date-time-picker__label" htmlFor={inputId} {...ncSlot("label")}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-date-time-picker__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div className="nc-date-time-picker__control" {...ncSlot("control")}>
        <input
          ref={(node) => assignRef(ref, node)}
          id={inputId}
          className="nc-date-time-picker__input"
          type="datetime-local"
          value={currentInputValue}
          min={minValue || undefined}
          max={maxValue || undefined}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={isInvalid || undefined}
          aria-labelledby={labelId}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          onChange={handleChange}
          {...ncSlot("input")}
          {...rest}
        />

        {withClearButton && currentValue && !disabled && !readOnly ? (
          <button
            type="button"
            className="nc-date-time-picker__clear-button"
            aria-label={clearLabel}
            onClick={() => commitValue(null)}
            {...ncSlot("clear-button")}
          >
            {clearIcon}
          </button>
        ) : null}

        <span className="nc-date-time-picker__icon" aria-hidden="true" {...ncSlot("icon")}>
          {dateTimeIcon}
        </span>
      </div>

      {error ? (
        <div id={errorId} className="nc-date-time-picker__error" role="alert" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});