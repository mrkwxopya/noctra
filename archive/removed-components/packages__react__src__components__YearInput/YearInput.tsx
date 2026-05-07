import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { YearInputProps } from "./YearInput.types";

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

function normalizeStep(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) return 1;
  return Math.max(1, Math.floor(value));
}

function clampYear(value: number, minYear: number | undefined, maxYear: number | undefined): number {
  let nextValue = value;

  if (minYear !== undefined && Number.isFinite(minYear)) {
    nextValue = Math.max(nextValue, Math.floor(minYear));
  }

  if (maxYear !== undefined && Number.isFinite(maxYear)) {
    nextValue = Math.min(nextValue, Math.floor(maxYear));
  }

  return nextValue;
}

function normalizeYearValue(value: string | number | undefined, minYear?: number, maxYear?: number): string {
  if (value === undefined || value === null || value === "") return "";

  const rawValue = String(value).trim();

  if (!rawValue) return "";

  const yearMatch = rawValue.match(/^-?\d{1,6}$/);

  if (yearMatch) {
    const parsedYear = Number(rawValue);

    if (!Number.isFinite(parsedYear)) return rawValue;

    return String(clampYear(Math.floor(parsedYear), minYear, maxYear));
  }

  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return rawValue;
  }

  return String(clampYear(parsedDate.getFullYear(), minYear, maxYear));
}

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const incrementIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 4.25a.75.75 0 0 1 .75.75v4.25H15a.75.75 0 0 1 0 1.5h-4.25V15a.75.75 0 0 1-1.5 0v-4.25H5a.75.75 0 0 1 0-1.5h4.25V5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

const decrementIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M4.25 10A.75.75 0 0 1 5 9.25h10a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const YearInput = forwardRef<HTMLDivElement, YearInputProps>(function YearInput(
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
    placeholder = "YYYY",
    leftSection,
    rightSection,
    clearLabel = "Clear year",
    incrementLabel = "Increment year",
    decrementLabel = "Decrement year",
    minYear,
    maxYear,
    step = 1,
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
    hideControls = false,
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
  const [internalValue, setInternalValue] = useState(normalizeYearValue(defaultValue, minYear, maxYear));
  const currentValue = normalizeYearValue(isControlled ? value : internalValue, minYear, maxYear);
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const normalizedStep = normalizeStep(step);

  function setYearValue(nextValue: string | number): void {
    const normalizedNextValue = normalizeYearValue(nextValue, minYear, maxYear);

    if (!isControlled) {
      setInternalValue(normalizedNextValue);
    }

    onValueChange?.(normalizedNextValue);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setYearValue(event.currentTarget.value);
    }
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setYearValue("");
  }

  function stepYear(direction: 1 | -1): void {
    if (disabled || readOnly) return;

    const baseYear = currentValue ? Number(currentValue) : new Date().getFullYear();

    if (!Number.isFinite(baseYear)) return;

    setYearValue(baseYear + normalizedStep * direction);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-year-input-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-controls={!hideControls || undefined}
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
        <div className="nc-year-input__header">
          {label ? (
            <label htmlFor={inputId} className="nc-year-input__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-year-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-year-input__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-year-input__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        <input
          {...inputProps}
          id={inputId}
          className={cx("nc-year-input__input", inputProps?.className)}
          type="number"
          inputMode="numeric"
          value={currentValue}
          min={minYear ?? inputProps?.min}
          max={maxYear ?? inputProps?.max}
          step={normalizedStep}
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
          <button type="button" className="nc-year-input__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        {!hideControls ? (
          <span className="nc-year-input__controls" {...ncSlot("controls")}>
            <button type="button" className="nc-year-input__control-button" aria-label={incrementLabel} disabled={disabled || readOnly} onClick={() => stepYear(1)} {...ncSlot("increment")}>
              {incrementIcon}
            </button>

            <button type="button" className="nc-year-input__control-button" aria-label={decrementLabel} disabled={disabled || readOnly} onClick={() => stepYear(-1)} {...ncSlot("decrement")}>
              {decrementIcon}
            </button>
          </span>
        ) : null}

        {rightSection ? (
          <span className="nc-year-input__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-year-input__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});