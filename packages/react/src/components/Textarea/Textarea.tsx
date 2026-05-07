import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TextareaProps, TextareaStyle } from "./Textarea.types";

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

function toRows(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(1, Math.floor(value));
}

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const Textarea = forwardRef<HTMLDivElement, TextareaProps>(function Textarea(
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
    footer,
    counterLabel,
    clearLabel = "Clear textarea",
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
    autosize = false,
    resize = "vertical",
    minRows = 3,
    maxRows,
    maxLength,
    showCounter = false,
    fullWidth = true,
    withBorder = true,
    textareaProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const textareaId = textareaProps?.id ?? `${rootId}-textarea`;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasFooter = Boolean(footer || showCounter || counterLabel);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const effectiveMaxLength = maxLength ?? textareaProps?.maxLength;
  const textareaStyle: TextareaStyle = { ...style };
  const minRowsValue = toRows(minRows, 3);

  textareaStyle["--nc-textarea-min-rows"] = String(minRowsValue);

  if (maxRows !== undefined) {
    textareaStyle["--nc-textarea-max-rows"] = String(toRows(maxRows, minRowsValue));
  }

  function setTextareaValue(nextValue: string): void {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    textareaProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setTextareaValue(event.currentTarget.value);
    }
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setTextareaValue("");
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-textarea-root", className)}
      style={textareaStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-autosize={autosize || undefined}
      data-resize={resize}
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
        <div className="nc-textarea__header">
          {label ? (
            <label htmlFor={textareaId} className="nc-textarea__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-textarea__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-textarea__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-textarea__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        <textarea
          {...textareaProps}
          id={textareaId}
          className={cx("nc-textarea__textarea", textareaProps?.className)}
          value={currentValue}
          placeholder={placeholder ?? textareaProps?.placeholder}
          disabled={disabled || textareaProps?.disabled}
          readOnly={readOnly || textareaProps?.readOnly}
          required={required || textareaProps?.required}
          maxLength={effectiveMaxLength}
          rows={minRowsValue}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          onChange={handleTextareaChange}
          {...ncSlot("textarea")}
        />

        {clearable && currentValue && !disabled && !readOnly ? (
          <button type="button" className="nc-textarea__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        {rightSection ? (
          <span className="nc-textarea__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {hasFooter ? (
        <div className="nc-textarea__footer" {...ncSlot("footer")}>
          {footer}

          {showCounter || counterLabel ? (
            <span className="nc-textarea__counter" {...ncSlot("counter")}>
              {counterLabel ?? `${currentValue.length}${effectiveMaxLength ? ` / ${effectiveMaxLength}` : ""}`}
            </span>
          ) : null}
        </div>
      ) : null}

      {hasMessage ? (
        <div id={messageId} className="nc-textarea__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});