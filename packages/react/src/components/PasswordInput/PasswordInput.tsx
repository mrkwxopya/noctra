import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NcPasswordInputStrength, PasswordInputProps } from "./PasswordInput.types";

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

function inferStrength(value: string): NcPasswordInputStrength {
  if (!value) return "none";

  let score = 0;

  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (score >= 4) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const eyeIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 4.5c-4.25 0-7.15 3.07-8.12 4.3a1.9 1.9 0 0 0 0 2.4c.97 1.23 3.87 4.3 8.12 4.3s7.15-3.07 8.12-4.3a1.9 1.9 0 0 0 0-2.4C17.15 7.57 14.25 4.5 10 4.5Zm0 8.25a2.75 2.75 0 1 1 0-5.5a2.75 2.75 0 0 1 0 5.5Z" />
  </svg>
);

const eyeOffIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-2.2-2.2a12.2 12.2 0 0 0 2.54-2.82a1.9 1.9 0 0 0 0-2.4C17.15 8.07 14.25 5 10 5c-1.12 0-2.14.21-3.06.55L3.28 2.22Z" />
    <path d="M10 15c-4.25 0-7.15-3.07-8.12-4.3a1.9 1.9 0 0 1 0-2.4a12.32 12.32 0 0 1 2.53-2.82l2.18 2.18A3.5 3.5 0 0 0 11.84 12.9l1.22 1.22c-.92.55-1.94.88-3.06.88Z" />
  </svg>
);

export const PasswordInput = forwardRef<HTMLDivElement, PasswordInputProps>(function PasswordInput(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = "",
    onValueChange,
    visible,
    defaultVisible = false,
    onVisibleChange,
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
    clearLabel = "Clear password",
    revealLabel = "Show password",
    hideLabel = "Hide password",
    strength,
    strengthLabel,
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
    revealable = true,
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
  const isValueControlled = value !== undefined;
  const isVisibleControlled = visible !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const currentValue = isValueControlled ? value : internalValue;
  const isVisible = isVisibleControlled ? visible : internalVisible;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const resolvedStrength = strength ?? inferStrength(currentValue);

  function setPasswordValue(nextValue: string): void {
    if (!isValueControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function setPasswordVisible(nextVisible: boolean): void {
    if (!isVisibleControlled) {
      setInternalVisible(nextVisible);
    }

    onVisibleChange?.(nextVisible);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setPasswordValue(event.currentTarget.value);
    }
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setPasswordValue("");
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-password-input-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-visible={isVisible || undefined}
      data-strength={resolvedStrength}
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
        <div className="nc-password-input__header">
          {label ? (
            <label htmlFor={inputId} className="nc-password-input__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-password-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-password-input__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-password-input__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        {prefix ? (
          <span className="nc-password-input__prefix" {...ncSlot("prefix")}>
            {prefix}
          </span>
        ) : null}

        <input
          {...inputProps}
          id={inputId}
          className={cx("nc-password-input__input", inputProps?.className)}
          type={isVisible ? "text" : "password"}
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
          <span className="nc-password-input__suffix" {...ncSlot("suffix")}>
            {suffix}
          </span>
        ) : null}

        {clearable && currentValue && !disabled && !readOnly ? (
          <button type="button" className="nc-password-input__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        {revealable ? (
          <button
            type="button"
            className="nc-password-input__reveal"
            aria-label={isVisible ? hideLabel : revealLabel}
            aria-pressed={isVisible}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (!readOnly) {
                setPasswordVisible(!isVisible);
              }
            }}
            {...ncSlot("reveal")}
          >
            {isVisible ? eyeOffIcon : eyeIcon}
          </button>
        ) : null}

        {rightSection ? (
          <span className="nc-password-input__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {resolvedStrength !== "none" || strengthLabel ? (
        <div className="nc-password-input__strength" data-strength={resolvedStrength} {...ncSlot("strength")}>
          <span className="nc-password-input__strength-bar" {...ncSlot("strength-bar")} />
          {strengthLabel ? (
            <span className="nc-password-input__strength-label" {...ncSlot("strength-label")}>
              {strengthLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      {hasMessage ? (
        <div id={messageId} className="nc-password-input__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});