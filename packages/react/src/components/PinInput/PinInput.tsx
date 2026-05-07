import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NcPinInputType, PinInputProps } from "./PinInput.types";

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

function normalizeGroupSize(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 3;
  return Math.max(1, Math.floor(value));
}

function sanitizeValue(value: string, type: NcPinInputType): string {
  if (type === "numeric") return value.replace(/\D/g, "");
  if (type === "alphanumeric") return value.replace(/[^a-zA-Z0-9]/g, "");
  return value.replace(/\s/g, "");
}

function getInputMode(type: NcPinInputType): "numeric" | "text" {
  return type === "numeric" ? "numeric" : "text";
}

function getPattern(type: NcPinInputType): string | undefined {
  if (type === "numeric") return "[0-9]*";
  if (type === "alphanumeric") return "[a-zA-Z0-9]*";
  return undefined;
}

function defaultSeparator(mode: PinInputProps["separatorMode"], separator: React.ReactNode): React.ReactNode {
  if (separator !== undefined) return separator;
  if (mode === "dash") return "–";
  if (mode === "space") return "";
  return null;
}

export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
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
    placeholder = "○",
    separator,
    separatorMode = "dash",
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
    length = 6,
    groupSize = 3,
    type = "numeric",
    mask = false,
    autoFocus = false,
    oneTimeCode = true,
    inputProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const normalizedLength = normalizeLength(length);
  const normalizedGroupSize = normalizeGroupSize(groupSize);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isControlled = value !== undefined;
  const initialValue = sanitizeValue(defaultValue, type).slice(0, normalizedLength);
  const [internalValue, setInternalValue] = useState(initialValue);
  const currentValue = sanitizeValue(isControlled ? value : internalValue, type).slice(0, normalizedLength);
  const chars = useMemo(() => Array.from({ length: normalizedLength }, (_, index) => currentValue[index] ?? ""), [currentValue, normalizedLength]);
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const separatorContent = defaultSeparator(separatorMode, separator);

  function emitValue(nextValue: string): void {
    const normalizedValue = sanitizeValue(nextValue, type).slice(0, normalizedLength);

    if (!isControlled) {
      setInternalValue(normalizedValue);
    }

    onValueChange?.(normalizedValue);

    if (normalizedValue.length === normalizedLength && !normalizedValue.includes("")) {
      onComplete?.(normalizedValue);
    }
  }

  function focusInput(index: number): void {
    const nextIndex = Math.max(0, Math.min(normalizedLength - 1, index));
    inputRefs.current[nextIndex]?.focus();
    inputRefs.current[nextIndex]?.select();
  }

  function updateAt(index: number, rawValue: string): void {
    if (disabled || readOnly) return;

    const cleanValue = sanitizeValue(rawValue, type);

    if (cleanValue.length > 1) {
      const nextChars = [...chars];

      cleanValue
        .slice(0, normalizedLength - index)
        .split("")
        .forEach((char, offset) => {
          nextChars[index + offset] = char;
        });

      emitValue(nextChars.join(""));
      focusInput(Math.min(index + cleanValue.length, normalizedLength - 1));
      return;
    }

    const nextChars = [...chars];
    nextChars[index] = cleanValue;
    emitValue(nextChars.join(""));

    if (cleanValue && index < normalizedLength - 1) {
      focusInput(index + 1);
    }
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      updateAt(index, event.currentTarget.value);
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>): void {
    inputProps?.onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    if (event.key === "Backspace") {
      event.preventDefault();

      const nextChars = [...chars];

      if (nextChars[index]) {
        nextChars[index] = "";
        emitValue(nextChars.join(""));
        return;
      }

      if (index > 0) {
        nextChars[index - 1] = "";
        emitValue(nextChars.join(""));
        focusInput(index - 1);
      }

      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      const nextChars = [...chars];
      nextChars[index] = "";
      emitValue(nextChars.join(""));
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

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>): void {
    inputProps?.onPaste?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    event.preventDefault();
    updateAt(index, event.clipboardData.getData("text"));
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    inputProps?.onFocus?.(event);

    if (!event.defaultPrevented) {
      event.currentTarget.select();
    }
  }

  useEffect(() => {
    if (!autoFocus) return;
    const frame = window.requestAnimationFrame(() => {
      focusInput(0);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [autoFocus]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-pin-input-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-mask={mask || undefined}
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
        <div className="nc-pin-input__header">
          {label ? (
            <div className="nc-pin-input__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-pin-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-pin-input__fields" role="group" aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined} {...ncSlot("fields")}>
        {Array.from({ length: normalizedLength }, (_, index) => {
          const showSeparator = separatorMode !== "none" && separatorContent !== null && index > 0 && index % normalizedGroupSize === 0;

          return (
            <span key={index} className="nc-pin-input__group" {...ncSlot("group")}>
              {showSeparator ? (
                <span className="nc-pin-input__separator" aria-hidden="true" {...ncSlot("separator")}>
                  {separatorContent}
                </span>
              ) : null}

              <input
                {...inputProps}
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                id={`${rootId}-input-${index}`}
                className={cx("nc-pin-input__input", inputProps?.className)}
                type={mask ? "password" : "text"}
                inputMode={getInputMode(type)}
                pattern={inputProps?.pattern ?? getPattern(type)}
                value={chars[index]}
                placeholder={placeholder}
                disabled={disabled || inputProps?.disabled}
                readOnly={readOnly || inputProps?.readOnly}
                required={required || inputProps?.required}
                aria-invalid={isInvalid || undefined}
                aria-required={required || undefined}
                autoComplete={oneTimeCode ? "one-time-code" : inputProps?.autoComplete}
                maxLength={normalizedLength}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={(event) => handlePaste(index, event)}
                onFocus={handleFocus}
                {...ncSlot("input")}
              />
            </span>
          );
        })}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-pin-input__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});