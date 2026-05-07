import { forwardRef, useId, useMemo, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SliderProps, SliderStyle } from "./Slider.types";

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

function normalizeNumber(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return value;
}

function normalizeStep(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) return 1;
  return value;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeValue(value: number, min: number, max: number, step: number): number {
  const clampedValue = clamp(value, min, max);
  const steppedValue = Math.round((clampedValue - min) / step) * step + min;
  const precision = Math.max(0, String(step).split(".")[1]?.length ?? 0);
  return Number(clamp(steppedValue, min, max).toFixed(precision));
}

function getProgress(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    min = 0,
    max = 100,
    step = 1,
    marks = [],
    formatValue,
    valueLabel,
    thumbLabel,
    trackLabel,
    variant = "surface",
    size = "md",
    radius = "full",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    inverted = false,
    showValue = false,
    showMarks = true,
    showTrackLabels = false,
    orientation = "horizontal",
    valuePlacement = "top",
    fullWidth = true,
    withBorder = false,
    inputProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const inputId = inputProps?.id ?? `${rootId}-input`;
  const normalizedMin = normalizeNumber(min, 0);
  const normalizedMax = Math.max(normalizeNumber(max, 100), normalizedMin);
  const normalizedStep = normalizeStep(step);
  const initialValue = normalizeValue(defaultValue ?? normalizedMin, normalizedMin, normalizedMax, normalizedStep);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(initialValue);
  const currentValue = normalizeValue(isControlled ? value : internalValue, normalizedMin, normalizedMax, normalizedStep);
  const progress = getProgress(currentValue, normalizedMin, normalizedMax);
  const visualStart = inverted ? `${progress}%` : "0%";
  const visualEnd = inverted ? "100%" : `${progress}%`;
  const sliderStyle: SliderStyle = { ...style };
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description || showValue || valueLabel);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const displayedValue = valueLabel ?? (formatValue ? formatValue(currentValue) : currentValue);
  const visibleMarks = useMemo(
    () =>
      marks
        .filter((mark) => Number.isFinite(mark.value) && mark.value >= normalizedMin && mark.value <= normalizedMax)
        .map((mark) => ({ ...mark, progress: getProgress(mark.value, normalizedMin, normalizedMax) })),
    [marks, normalizedMax, normalizedMin]
  );

  sliderStyle["--nc-slider-progress"] = `${progress}%`;
  sliderStyle["--nc-slider-progress-start"] = visualStart;
  sliderStyle["--nc-slider-progress-end"] = visualEnd;

  function commitValue(nextValue: number): void {
    if (disabled || readOnly) return;

    const normalizedNextValue = normalizeValue(nextValue, normalizedMin, normalizedMax, normalizedStep);

    if (!isControlled) {
      setInternalValue(normalizedNextValue);
    }

    onValueChange?.(normalizedNextValue);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      commitValue(Number(event.currentTarget.value));
    }
  }

  function handleCommit(): void {
    if (disabled || readOnly) return;
    onValueCommit?.(currentValue);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-slider-root", className)}
      style={sliderStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-inverted={inverted || undefined}
      data-orientation={orientation}
      data-value-placement={valuePlacement}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: currentValue > normalizedMin ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-slider__header" {...ncSlot("header")}>
          <div className="nc-slider__header-main">
            {label ? (
              <label htmlFor={inputId} className="nc-slider__label" {...ncSlot("label")}>
                {label}
              </label>
            ) : null}

            {description ? (
              <div id={descriptionId} className="nc-slider__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}
          </div>

          {showValue || valueLabel ? (
            <span className="nc-slider__value" {...ncSlot("value")}>
              {displayedValue}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="nc-slider__control" {...ncSlot("control")}>
        <div className="nc-slider__track" aria-hidden="true" {...ncSlot("track")}>
          <span className="nc-slider__range" {...ncSlot("range")} />
        </div>

        <input
          {...inputProps}
          id={inputId}
          className={cx("nc-slider__input", inputProps?.className)}
          type="range"
          min={normalizedMin}
          max={normalizedMax}
          step={normalizedStep}
          value={currentValue}
          disabled={disabled || inputProps?.disabled}
          readOnly={readOnly || inputProps?.readOnly}
          required={required || inputProps?.required}
          aria-label={thumbLabel ?? inputProps?.["aria-label"] ?? (typeof label === "string" ? label : "Slider")}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-orientation={orientation}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          onChange={handleChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          onKeyUp={handleCommit}
          {...ncSlot("input")}
        />

        {showMarks && visibleMarks.length > 0 ? (
          <div className="nc-slider__marks" aria-hidden="true" {...ncSlot("marks")}>
            {visibleMarks.map((mark) => (
              <span key={`${mark.value}`} className="nc-slider__mark" style={{ "--nc-slider-mark-progress": `${mark.progress}%` } as SliderStyle} {...ncSlot("mark")}>
                <span className="nc-slider__mark-dot" {...ncSlot("mark-dot")} />
                {mark.label ? (
                  <span className="nc-slider__mark-label" {...ncSlot("mark-label")}>
                    {mark.label}
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {showTrackLabels ? (
        <div className="nc-slider__footer" {...ncSlot("footer")}>
          <span className="nc-slider__min-label" {...ncSlot("min-label")}>
            {formatValue ? formatValue(normalizedMin) : normalizedMin}
          </span>
          <span className="nc-slider__max-label" {...ncSlot("max-label")}>
            {formatValue ? formatValue(normalizedMax) : normalizedMax}
          </span>
        </div>
      ) : null}

      {hasMessage ? (
        <div id={messageId} className="nc-slider__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});