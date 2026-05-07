import { forwardRef, useId, useMemo, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NumberInputProps } from "./NumberInput.types";

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

function clamp(value: number, min: number | undefined, max: number | undefined): number {
  let nextValue = value;

  if (min !== undefined) {
    nextValue = Math.max(nextValue, min);
  }

  if (max !== undefined) {
    nextValue = Math.min(nextValue, max);
  }

  return nextValue;
}

function normalizeStep(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) return 1;
  return value;
}

function applyPrecision(value: number, precision: number | undefined): number {
  if (precision === undefined || !Number.isFinite(precision)) return value;
  return Number(value.toFixed(Math.max(0, Math.floor(precision))));
}

function formatValue(value: number | null, precision: number | undefined): string {
  if (value === null || !Number.isFinite(value)) return "";

  if (precision !== undefined && Number.isFinite(precision)) {
    return value.toFixed(Math.max(0, Math.floor(precision)));
  }

  return String(value);
}

function parseValue(value: string, allowNegative: boolean, allowDecimal: boolean): number | null {
  let normalizedValue = value.trim();

  if (!allowNegative) {
    normalizedValue = normalizedValue.replace(/-/g, "");
  }

  if (!allowDecimal) {
    normalizedValue = normalizedValue.replace(/[.,].*$/g, "");
  }

  normalizedValue = normalizedValue.replace(",", ".");

  if (normalizedValue === "" || normalizedValue === "-" || normalizedValue === "." || normalizedValue === "-.") {
    return null;
  }

  const parsed = Number(normalizedValue);

  return Number.isFinite(parsed) ? parsed : null;
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

export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>(function NumberInput(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = null,
    onValueChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    placeholder,
    leftSection,
    rightSection,
    prefix,
    suffix,
    clearLabel = "Clear number",
    incrementLabel = "Increment number",
    decrementLabel = "Decrement number",
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
    min,
    max,
    step = 1,
    precision,
    clampBehavior = "blur",
    allowNegative = true,
    allowDecimal = true,
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
  const [internalValue, setInternalValue] = useState<number | null>(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const [draftValue, setDraftValue] = useState(() => formatValue(currentValue ?? null, precision));
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const normalizedStep = normalizeStep(step);
  const displayValue = useMemo(() => {
    if (draftValue !== formatValue(currentValue ?? null, precision)) return draftValue;
    return formatValue(currentValue ?? null, precision);
  }, [currentValue, draftValue, precision]);

  function commitValue(nextValue: number | null): void {
    let normalizedValue = nextValue;

    if (normalizedValue !== null) {
      normalizedValue = applyPrecision(normalizedValue, precision);

      if (clampBehavior === "strict") {
        normalizedValue = clamp(normalizedValue, min, max);
      }
    }

    if (!isControlled) {
      setInternalValue(normalizedValue);
    }

    setDraftValue(formatValue(normalizedValue, precision));
    onValueChange?.(normalizedValue);
  }

  function stepValue(direction: 1 | -1): void {
    if (disabled || readOnly) return;

    const baseValue = currentValue ?? 0;
    const nextValue = clamp(applyPrecision(baseValue + normalizedStep * direction, precision), min, max);
    commitValue(nextValue);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (event.defaultPrevented) return;

    const nextDraftValue = event.currentTarget.value;
    const parsedValue = parseValue(nextDraftValue, allowNegative, allowDecimal);

    setDraftValue(nextDraftValue);

    if (clampBehavior === "strict") {
      commitValue(parsedValue);
      return;
    }

    if (!isControlled) {
      setInternalValue(parsedValue);
    }

    onValueChange?.(parsedValue);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>): void {
    inputProps?.onBlur?.(event);

    if (event.defaultPrevented) return;

    const parsedValue = parseValue(event.currentTarget.value, allowNegative, allowDecimal);

    if (parsedValue === null) {
      commitValue(null);
      return;
    }

    const nextValue = clampBehavior === "blur" ? clamp(parsedValue, min, max) : parsedValue;
    commitValue(nextValue);
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    commitValue(null);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-number-input-root", className)}
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
        state: currentValue !== null && currentValue !== undefined ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-number-input__header">
          {label ? (
            <label htmlFor={inputId} className="nc-number-input__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-number-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-number-input__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-number-input__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        {prefix ? (
          <span className="nc-number-input__prefix" {...ncSlot("prefix")}>
            {prefix}
          </span>
        ) : null}

        <input
          {...inputProps}
          id={inputId}
          className={cx("nc-number-input__input", inputProps?.className)}
          type="text"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          value={displayValue}
          placeholder={placeholder ?? inputProps?.placeholder}
          disabled={disabled || inputProps?.disabled}
          readOnly={readOnly || inputProps?.readOnly}
          required={required || inputProps?.required}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          onChange={handleInputChange}
          onBlur={handleBlur}
          {...ncSlot("input")}
        />

        {suffix ? (
          <span className="nc-number-input__suffix" {...ncSlot("suffix")}>
            {suffix}
          </span>
        ) : null}

        {clearable && currentValue !== null && currentValue !== undefined && !disabled && !readOnly ? (
          <button type="button" className="nc-number-input__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        {rightSection ? (
          <span className="nc-number-input__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}

        {!hideControls ? (
          <span className="nc-number-input__controls" {...ncSlot("controls")}>
            <button
              type="button"
              className="nc-number-input__control-button"
              aria-label={incrementLabel}
              disabled={disabled || readOnly || (max !== undefined && currentValue !== null && currentValue !== undefined && currentValue >= max)}
              onClick={() => stepValue(1)}
              {...ncSlot("increment")}
            >
              {incrementIcon}
            </button>

            <button
              type="button"
              className="nc-number-input__control-button"
              aria-label={decrementLabel}
              disabled={disabled || readOnly || (min !== undefined && currentValue !== null && currentValue !== undefined && currentValue <= min)}
              onClick={() => stepValue(-1)}
              {...ncSlot("decrement")}
            >
              {decrementIcon}
            </button>
          </span>
        ) : null}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-number-input__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});