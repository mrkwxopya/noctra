import { forwardRef, useId, useMemo, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ColorInputProps, ColorInputStyle } from "./ColorInput.types";

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

function normalizeHex(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  const withoutHash = trimmedValue.replace(/^#/, "");

  if (/^[0-9a-fA-F]{3}$/.test(withoutHash)) {
    return `#${withoutHash.split("").map((char) => `${char}${char}`).join("").toLowerCase()}`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(withoutHash)) {
    return `#${withoutHash.toLowerCase()}`;
  }

  return trimmedValue;
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function toPickerValue(value: string): string {
  const normalizedValue = normalizeHex(value);
  return isValidHex(normalizedValue) ? normalizedValue : "#000000";
}

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const ColorInput = forwardRef<HTMLDivElement, ColorInputProps>(function ColorInput(
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
    placeholder = "#000000",
    leftSection,
    rightSection,
    clearLabel = "Clear color",
    pickerLabel = "Pick color",
    swatchesLabel,
    swatches = [],
    format = "hex",
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
    withPicker = true,
    withPreview = true,
    fullWidth = true,
    withBorder = true,
    inputProps,
    pickerProps,
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
  const normalizedValue = useMemo(() => (format === "hex" ? normalizeHex(currentValue) : currentValue), [currentValue, format]);
  const previewColor = isValidHex(normalizedValue) ? normalizedValue : "transparent";
  const colorInputStyle: ColorInputStyle = { ...style };
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const hasSwatches = swatches.length > 0;
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  colorInputStyle["--nc-color-input-preview-color"] = previewColor;

  function commitValue(nextValue: string): void {
    const normalizedNextValue = format === "hex" ? normalizeHex(nextValue) : nextValue;

    if (!isControlled) {
      setInternalValue(normalizedNextValue);
    }

    onValueChange?.(normalizedNextValue);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      commitValue(event.currentTarget.value);
    }
  }

  function handlePickerChange(event: ChangeEvent<HTMLInputElement>): void {
    pickerProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      commitValue(event.currentTarget.value);
    }
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    commitValue("");
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-color-input-root", className)}
      style={colorInputStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-valid-color={isValidHex(normalizedValue) || undefined}
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
        <div className="nc-color-input__header">
          {label ? (
            <label htmlFor={inputId} className="nc-color-input__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-color-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-color-input__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-color-input__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        {withPreview ? <span className="nc-color-input__preview" aria-hidden="true" {...ncSlot("preview")} /> : null}

        <input
          {...inputProps}
          id={inputId}
          className={cx("nc-color-input__input", inputProps?.className)}
          type="text"
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

        {withPicker ? (
          <label className="nc-color-input__picker-label" aria-label={pickerLabel}>
            <input
              {...pickerProps}
              className={cx("nc-color-input__picker", pickerProps?.className)}
              type="color"
              value={toPickerValue(normalizedValue)}
              disabled={disabled || pickerProps?.disabled}
              readOnly={readOnly || pickerProps?.readOnly}
              aria-label={pickerLabel}
              onChange={handlePickerChange}
              {...ncSlot("picker")}
            />
          </label>
        ) : null}

        {clearable && currentValue && !disabled && !readOnly ? (
          <button type="button" className="nc-color-input__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        {rightSection ? (
          <span className="nc-color-input__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {hasSwatches ? (
        <div className="nc-color-input__swatches" aria-label={typeof swatchesLabel === "string" ? swatchesLabel : "Color swatches"} {...ncSlot("swatches")}>
          {swatchesLabel ? <span className="nc-color-input__swatches-label">{swatchesLabel}</span> : null}

          {swatches.map((swatch) => {
            const normalizedSwatchValue = normalizeHex(swatch.value);
            const selected = normalizedSwatchValue.toLowerCase() === normalizedValue.toLowerCase();

            return (
              <button
                key={`${swatch.value}-${swatch.label ?? ""}`}
                type="button"
                className="nc-color-input__swatch"
                style={{ "--nc-color-input-preview-color": isValidHex(normalizedSwatchValue) ? normalizedSwatchValue : "transparent" } as ColorInputStyle}
                title={swatch.label ?? normalizedSwatchValue}
                aria-label={swatch.label ?? normalizedSwatchValue}
                aria-pressed={selected}
                data-selected={selected || undefined}
                disabled={disabled || readOnly}
                onClick={() => commitValue(normalizedSwatchValue)}
                {...ncSlot("swatch")}
              />
            );
          })}
        </div>
      ) : null}

      {hasMessage ? (
        <div id={messageId} className="nc-color-input__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});