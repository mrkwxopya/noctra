import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NcPinCodeType, PinCodeProps, PinCodeStyle } from "./PinCode.types";

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

function normalizeLength(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 6;
  return Math.max(1, Math.min(12, Math.floor(value)));
}

function isAllowedCharacter(value: string, type: NcPinCodeType): boolean {
  if (!value) return false;
  if (type === "numeric") return /^\d$/.test(value);
  if (type === "alphanumeric") return /^[a-zA-Z0-9]$/.test(value);
  return value.length === 1;
}

function normalizeValue(value: string | undefined, length: number, type: NcPinCodeType): string {
  const rawValue = value ?? "";
  const chars = Array.from(rawValue).filter((char) => isAllowedCharacter(char, type));
  return chars.slice(0, length).join("");
}

function valueToSlots(value: string, length: number): string[] {
  const chars = Array.from(value);
  return Array.from({ length }, (_, index) => chars[index] ?? "");
}

function slotsToValue(slots: string[]): string {
  return slots.join("");
}

function getInputMode(type: NcPinCodeType): "numeric" | "text" {
  return type === "numeric" ? "numeric" : "text";
}

export const PinCode = forwardRef<HTMLDivElement, PinCodeProps>(function PinCode(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = "",
    onValueChange,
    onComplete,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    length = 6,
    type = "numeric",
    mask = false,
    autoFocus = false,
    placeholder = "",
    separator,
    separatorEvery,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    fullWidth = false,
    withBorder = true,
    inputProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const normalizedLength = normalizeLength(length);
  const labelId = label ? `${rootId}-label` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => normalizeValue(defaultValue, normalizedLength, type));
  const currentValue = normalizeValue(isControlled ? value : internalValue, normalizedLength, type);
  const slots = valueToSlots(currentValue, normalizedLength);
  const pinCodeStyle: PinCodeStyle = { ...style };
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const isComplete = currentValue.length === normalizedLength;
  const normalizedSeparatorEvery = separatorEvery !== undefined && Number.isFinite(separatorEvery) ? Math.max(1, Math.floor(separatorEvery)) : undefined;

  pinCodeStyle["--nc-pin-code-length"] = String(normalizedLength);

  function focusInput(index: number): void {
    const nextIndex = Math.max(0, Math.min(normalizedLength - 1, index));
    const input = inputRefs.current[nextIndex];

    if (!input) return;

    input.focus();
    input.select();
  }

  function emitValue(nextSlots: string[]): void {
    const nextValue = normalizeValue(slotsToValue(nextSlots), normalizedLength, type);

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);

    if (nextValue.length === normalizedLength) {
      onComplete?.(nextValue);
    }
  }

  function setSlot(index: number, nextChar: string): void {
    if (disabled || readOnly) return;

    if (!isAllowedCharacter(nextChar, type)) return;

    const nextSlots = [...slots];
    nextSlots[index] = nextChar;
    emitValue(nextSlots);

    if (index < normalizedLength - 1) {
      focusInput(index + 1);
    }
  }

  function clearSlot(index: number): void {
    if (disabled || readOnly) return;

    const nextSlots = [...slots];
    nextSlots[index] = "";
    emitValue(nextSlots);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>, index: number): void {
    inputProps?.onChange?.(event);

    if (event.defaultPrevented) return;

    const rawValue = event.currentTarget.value;
    const chars = Array.from(rawValue).filter((char) => isAllowedCharacter(char, type));

    if (chars.length === 0) {
      clearSlot(index);
      return;
    }

    if (chars.length === 1) {
      setSlot(index, chars[0] ?? "");
      return;
    }

    const nextSlots = [...slots];

    chars.slice(0, normalizedLength - index).forEach((char, offset) => {
      nextSlots[index + offset] = char;
    });

    emitValue(nextSlots);
    focusInput(Math.min(index + chars.length, normalizedLength - 1));
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>, index: number): void {
    inputProps?.onPaste?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    const pastedValue = event.clipboardData.getData("text");

    if (!pastedValue) return;

    event.preventDefault();

    const chars = Array.from(pastedValue).filter((char) => isAllowedCharacter(char, type));
    const nextSlots = [...slots];

    chars.slice(0, normalizedLength - index).forEach((char, offset) => {
      nextSlots[index + offset] = char;
    });

    emitValue(nextSlots);
    focusInput(Math.min(index + chars.length, normalizedLength - 1));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number): void {
    inputProps?.onKeyDown?.(event);

    if (event.defaultPrevented) return;

    if (event.key === "Backspace") {
      event.preventDefault();

      if (slots[index]) {
        clearSlot(index);
        return;
      }

      if (index > 0) {
        focusInput(index - 1);
        clearSlot(index - 1);
      }

      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      clearSlot(index);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusInput(index + 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusInput(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusInput(normalizedLength - 1);
    }
  }

  useEffect(() => {
    if (!autoFocus) return;
    focusInput(0);
  }, [autoFocus]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-pin-code-root", className)}
      style={pinCodeStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-complete={isComplete || undefined}
      data-mask={mask || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: isComplete ? "complete" : currentValue ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-pin-code__header">
          {label ? (
            <div id={labelId} className="nc-pin-code__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-pin-code__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="nc-pin-code__group"
        role="group"
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        {...ncSlot("group")}
      >
        {slots.map((slotValue, index) => {
          const shouldRenderSeparator = separator && normalizedSeparatorEvery !== undefined && index > 0 && index % normalizedSeparatorEvery === 0;

          return (
            <span key={`${rootId}-${index}`} className="nc-pin-code__item">
              {shouldRenderSeparator ? (
                <span className="nc-pin-code__separator" aria-hidden="true" {...ncSlot("separator")}>
                  {separator}
                </span>
              ) : null}

              <input
                {...inputProps}
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                id={`${rootId}-input-${index}`}
                className={cx("nc-pin-code__input", inputProps?.className)}
                type={mask ? "password" : "text"}
                inputMode={inputProps?.inputMode ?? getInputMode(type)}
                autoComplete={inputProps?.autoComplete ?? "one-time-code"}
                value={slotValue}
                placeholder={placeholder}
                maxLength={1}
                disabled={disabled || inputProps?.disabled}
                readOnly={readOnly || inputProps?.readOnly}
                required={required || inputProps?.required}
                aria-invalid={isInvalid || undefined}
                aria-required={required || undefined}
                aria-label={`Digit ${index + 1} of ${normalizedLength}`}
                onChange={(event) => handleInputChange(event, index)}
                onPaste={(event) => handlePaste(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                {...ncSlot("input")}
              />
            </span>
          );
        })}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-pin-code__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});