import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TextInputProps } from "./TextInput.types";

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

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const TextInput = forwardRef<HTMLDivElement, TextInputProps>(function TextInput(
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
    prefix,
    suffix,
    clearLabel = "Clear input",
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
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  function setInputValue(nextValue: string): void {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setInputValue(event.currentTarget.value);
    }
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setInputValue("");
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-text-input-root", className)}
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
        <div className="nc-text-input__header">
          {label ? (
            <label htmlFor={inputId} className="nc-text-input__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-text-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-text-input__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-text-input__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        {prefix ? (
          <span className="nc-text-input__prefix" {...ncSlot("prefix")}>
            {prefix}
          </span>
        ) : null}

        <input
          {...inputProps}
          id={inputId}
          className={cx("nc-text-input__input", inputProps?.className)}
          value={currentValue}
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

        {suffix ? (
          <span className="nc-text-input__suffix" {...ncSlot("suffix")}>
            {suffix}
          </span>
        ) : null}

        {clearable && currentValue && !disabled && !readOnly ? (
          <button type="button" className="nc-text-input__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        {rightSection ? (
          <span className="nc-text-input__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-text-input__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});