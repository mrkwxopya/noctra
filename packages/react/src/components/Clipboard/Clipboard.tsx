import { forwardRef, useEffect, useId, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ClipboardProps } from "./Clipboard.types";

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

async function copyToClipboard(value: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard API is not available.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    const copied = document.execCommand("copy");

    if (!copied) {
      throw new Error("Copy command failed.");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

const copyIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M6.5 2.5A2.5 2.5 0 0 0 4 5v8a.75.75 0 0 0 1.5 0V5a1 1 0 0 1 1-1h7a.75.75 0 0 0 0-1.5h-7Z" />
    <path d="M8 6.5A2.5 2.5 0 0 1 10.5 4h4A2.5 2.5 0 0 1 17 6.5v7A2.5 2.5 0 0 1 14.5 16h-4A2.5 2.5 0 0 1 8 13.5v-7Zm2.5-1A1 1 0 0 0 9.5 6.5v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-4Z" />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const Clipboard = forwardRef<HTMLDivElement, ClipboardProps>(function Clipboard(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = "",
    copyText,
    onValueChange,
    onCopied,
    onCopyError,
    copied,
    defaultCopied = false,
    copiedTimeout = 1600,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    placeholder = "Paste or type text to copy",
    copyLabel = "Copy",
    copiedLabel = "Copied",
    clearLabel = "Clear clipboard value",
    icon,
    copiedIcon,
    leftSection,
    rightSection,
    mode = "input",
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
    buttonProps,
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
  const isCopiedControlled = copied !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalCopied, setInternalCopied] = useState(defaultCopied);
  const currentValue = isValueControlled ? value : internalValue;
  const copiedState = isCopiedControlled ? copied : internalCopied;
  const copyValue = copyText ?? currentValue;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const isButtonOnly = mode === "button";
  const isDisplayMode = mode === "display";

  function setClipboardValue(nextValue: string): void {
    if (!isValueControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function setCopiedState(nextCopied: boolean): void {
    if (!isCopiedControlled) {
      setInternalCopied(nextCopied);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setClipboardValue(event.currentTarget.value);
    }
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setClipboardValue("");
    setCopiedState(false);
  }

  async function handleCopy(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    buttonProps?.onClick?.(event);

    if (event.defaultPrevented || disabled || readOnly || !copyValue) return;

    try {
      await copyToClipboard(copyValue);
      setCopiedState(true);
      onCopied?.(copyValue);
    } catch (copyError) {
      setCopiedState(false);
      onCopyError?.(copyError);
    }
  }

  useEffect(() => {
    if (!copiedState || isCopiedControlled || copiedTimeout <= 0) return;

    const timer = window.setTimeout(() => {
      setInternalCopied(false);
    }, copiedTimeout);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copiedState, copiedTimeout, isCopiedControlled]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-clipboard-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-copied={copiedState || undefined}
      data-mode={mode}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: copiedState ? "copied" : copyValue ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-clipboard__header">
          {label ? (
            <label htmlFor={isButtonOnly ? undefined : inputId} className="nc-clipboard__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-clipboard__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-clipboard__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-clipboard__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        {!isButtonOnly && !isDisplayMode ? (
          <input
            {...inputProps}
            id={inputId}
            className={cx("nc-clipboard__input", inputProps?.className)}
            type={inputProps?.type ?? "text"}
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
        ) : null}

        {!isButtonOnly && isDisplayMode ? (
          <div className="nc-clipboard__display" title={copyValue} {...ncSlot("display")}>
            {copyValue || placeholder}
          </div>
        ) : null}

        {clearable && currentValue && !disabled && !readOnly && !isButtonOnly ? (
          <button type="button" className="nc-clipboard__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        <button
          {...buttonProps}
          type="button"
          className={cx("nc-clipboard__copy", buttonProps?.className)}
          disabled={disabled || buttonProps?.disabled || !copyValue}
          aria-live="polite"
          onClick={handleCopy}
          {...ncSlot("copy")}
        >
          <span className="nc-clipboard__copy-icon" aria-hidden="true" {...ncSlot("copy-icon")}>
            {copiedState ? copiedIcon ?? checkIcon : icon ?? copyIcon}
          </span>
          <span>{copiedState ? copiedLabel : copyLabel}</span>
        </button>

        {rightSection ? (
          <span className="nc-clipboard__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-clipboard__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});