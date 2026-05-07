import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TimePickerProps } from "./TimePicker.types";

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

const clockIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 2.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15ZM11 6.25a.75.75 0 0 0-1.5 0v4.05c0 .265.14.51.368.645l2.75 1.625a.75.75 0 1 0 .764-1.29L11 9.872V6.25Z" clipRule="evenodd" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  props,
  ref
): ReactElement {
  const {
    className,
    value,
    defaultValue = "",
    onValueChange,
    label,
    description,
    error,
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
    clearLabel = "Clear time",
    id,
    min,
    max,
    step,
    placeholder,
    ...rest
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = label ? `${inputId}-label` : undefined;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const isInvalid = invalid || Boolean(error);

  function commitValue(nextValue: string): void {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    commitValue(event.currentTarget.value);
  }

  return (
    <div
      className={cx("nc-time-picker-root", className)}
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
        <label id={labelId} className="nc-time-picker__label" htmlFor={inputId} {...ncSlot("label")}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-time-picker__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div className="nc-time-picker__control" {...ncSlot("control")}>
        <input
          ref={(node) => assignRef(ref, node)}
          id={inputId}
          className="nc-time-picker__input"
          type="time"
          value={currentValue}
          min={min}
          max={max}
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
            className="nc-time-picker__clear-button"
            aria-label={clearLabel}
            onClick={() => commitValue("")}
            {...ncSlot("clear-button")}
          >
            {clearIcon}
          </button>
        ) : null}

        <span className="nc-time-picker__icon" aria-hidden="true" {...ncSlot("icon")}>
          {clockIcon}
        </span>
      </div>

      {error ? (
        <div id={errorId} className="nc-time-picker__error" role="alert" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});