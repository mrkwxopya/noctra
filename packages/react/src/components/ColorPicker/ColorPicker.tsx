import { forwardRef, useId, useMemo, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ColorPickerProps, ColorPickerStyle } from "./ColorPicker.types";

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

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = "#000000",
    onValueChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    swatches = [],
    swatchesLabel,
    pickerLabel = "Pick color",
    previewLabel,
    valueLabel,
    format = "hex",
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    withPreview = true,
    withValue = true,
    fullWidth = false,
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
  const normalizedValue = useMemo(() => (format === "hex" ? normalizeHex(currentValue) : currentValue), [currentValue, format]);
  const pickerValue = toPickerValue(normalizedValue);
  const colorPickerStyle: ColorPickerStyle = { ...style };
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const hasSwatches = swatches.length > 0;
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  colorPickerStyle["--nc-color-picker-value"] = isValidHex(normalizedValue) ? normalizedValue : "transparent";

  function commitValue(nextValue: string): void {
    if (disabled || readOnly) return;

    const normalizedNextValue = format === "hex" ? normalizeHex(nextValue) : nextValue;

    if (!isControlled) {
      setInternalValue(normalizedNextValue);
    }

    onValueChange?.(normalizedNextValue);
  }

  function handleNativeChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      commitValue(event.currentTarget.value);
    }
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-color-picker-root", className)}
      style={colorPickerStyle}
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
        <div className="nc-color-picker__header">
          {label ? (
            <label htmlFor={inputId} className="nc-color-picker__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-color-picker__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-color-picker__panel" {...ncSlot("panel")}>
        {withPreview ? (
          <div className="nc-color-picker__preview" aria-label={typeof previewLabel === "string" ? previewLabel : undefined} {...ncSlot("preview")}>
            {previewLabel ? <span>{previewLabel}</span> : null}
          </div>
        ) : null}

        <input
          {...inputProps}
          id={inputId}
          className={cx("nc-color-picker__native", inputProps?.className)}
          type="color"
          value={pickerValue}
          disabled={disabled || inputProps?.disabled}
          readOnly={readOnly || inputProps?.readOnly}
          required={required || inputProps?.required}
          aria-label={pickerLabel}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          onChange={handleNativeChange}
          {...ncSlot("native")}
        />

        {withValue || valueLabel ? (
          <div className="nc-color-picker__value" {...ncSlot("value")}>
            {valueLabel ?? normalizedValue}
          </div>
        ) : null}
      </div>

      {hasSwatches ? (
        <div className="nc-color-picker__swatches" aria-label={typeof swatchesLabel === "string" ? swatchesLabel : "Color swatches"} {...ncSlot("swatches")}>
          {swatchesLabel ? <span className="nc-color-picker__swatches-label">{swatchesLabel}</span> : null}

          {swatches.map((swatch) => {
            const normalizedSwatchValue = normalizeHex(swatch.value);
            const selected = normalizedSwatchValue.toLowerCase() === normalizedValue.toLowerCase();

            return (
              <button
                key={`${swatch.value}-${swatch.label ?? ""}`}
                type="button"
                className="nc-color-picker__swatch"
                style={{ "--nc-color-picker-value": isValidHex(normalizedSwatchValue) ? normalizedSwatchValue : "transparent" } as ColorPickerStyle}
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
        <div id={messageId} className="nc-color-picker__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});