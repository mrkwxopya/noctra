import { forwardRef, useId, useMemo, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { RangeSliderProps, RangeSliderStyle, RangeSliderValue } from "./RangeSlider.types";

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

function normalizeSingleValue(value: number, min: number, max: number, step: number): number {
  const clampedValue = clamp(value, min, max);
  const steppedValue = Math.round((clampedValue - min) / step) * step + min;
  const precision = Math.max(0, String(step).split(".")[1]?.length ?? 0);
  return Number(clamp(steppedValue, min, max).toFixed(precision));
}

function normalizeRangeValue(value: RangeSliderValue, min: number, max: number, step: number, minRange: number): RangeSliderValue {
  const first = normalizeSingleValue(value[0], min, max, step);
  const second = normalizeSingleValue(value[1], min, max, step);
  let start = Math.min(first, second);
  let end = Math.max(first, second);

  if (minRange > 0 && end - start < minRange) {
    const midpoint = (start + end) / 2;
    start = normalizeSingleValue(midpoint - minRange / 2, min, max, step);
    end = normalizeSingleValue(start + minRange, min, max, step);

    if (end > max) {
      end = max;
      start = normalizeSingleValue(max - minRange, min, max, step);
    }
  }

  return [start, end];
}

function getProgress(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider(
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
    minRange = 0,
    marks = [],
    formatValue,
    valueLabel,
    startThumbLabel,
    endThumbLabel,
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
    startInputProps,
    endInputProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const startInputId = startInputProps?.id ?? `${rootId}-start-input`;
  const endInputId = endInputProps?.id ?? `${rootId}-end-input`;
  const normalizedMin = normalizeNumber(min, 0);
  const normalizedMax = Math.max(normalizeNumber(max, 100), normalizedMin);
  const normalizedStep = normalizeStep(step);
  const normalizedMinRange = Math.max(0, minRange);
  const fallbackValue: RangeSliderValue = [normalizedMin, normalizedMax];
  const initialValue = normalizeRangeValue(defaultValue ?? fallbackValue, normalizedMin, normalizedMax, normalizedStep, normalizedMinRange);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<RangeSliderValue>(initialValue);
  const currentValue = normalizeRangeValue(value ?? internalValue, normalizedMin, normalizedMax, normalizedStep, normalizedMinRange);
  const startProgress = getProgress(currentValue[0], normalizedMin, normalizedMax);
  const endProgress = getProgress(currentValue[1], normalizedMin, normalizedMax);
  const visualStart = inverted ? `${100 - endProgress}%` : `${startProgress}%`;
  const visualEnd = inverted ? `${100 - startProgress}%` : `${endProgress}%`;
  const rangeSliderStyle: RangeSliderStyle = { ...style };
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description || showValue || valueLabel);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const displayedValue = valueLabel ?? `${formatValue ? formatValue(currentValue[0]) : currentValue[0]} – ${formatValue ? formatValue(currentValue[1]) : currentValue[1]}`;
  const visibleMarks = useMemo(
    () =>
      marks
        .filter((mark) => Number.isFinite(mark.value) && mark.value >= normalizedMin && mark.value <= normalizedMax)
        .map((mark) => ({ ...mark, progress: getProgress(mark.value, normalizedMin, normalizedMax) })),
    [marks, normalizedMax, normalizedMin]
  );

  rangeSliderStyle["--nc-range-slider-start"] = visualStart;
  rangeSliderStyle["--nc-range-slider-end"] = visualEnd;

  function emitValue(nextValue: RangeSliderValue): void {
    if (disabled || readOnly) return;

    const normalizedNextValue = normalizeRangeValue(nextValue, normalizedMin, normalizedMax, normalizedStep, normalizedMinRange);

    if (!isControlled) {
      setInternalValue(normalizedNextValue);
    }

    onValueChange?.(normalizedNextValue);
  }

  function handleStartChange(event: ChangeEvent<HTMLInputElement>): void {
    startInputProps?.onChange?.(event);

    if (event.defaultPrevented) return;

    const nextStart = Math.min(Number(event.currentTarget.value), currentValue[1] - normalizedMinRange);
    emitValue([nextStart, currentValue[1]]);
  }

  function handleEndChange(event: ChangeEvent<HTMLInputElement>): void {
    endInputProps?.onChange?.(event);

    if (event.defaultPrevented) return;

    const nextEnd = Math.max(Number(event.currentTarget.value), currentValue[0] + normalizedMinRange);
    emitValue([currentValue[0], nextEnd]);
  }

  function handleCommit(): void {
    if (disabled || readOnly) return;
    onValueCommit?.(currentValue);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-range-slider-root", className)}
      style={rangeSliderStyle}
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
        state: currentValue[0] > normalizedMin || currentValue[1] < normalizedMax ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-range-slider__header" {...ncSlot("header")}>
          <div className="nc-range-slider__header-main">
            {label ? (
              <label htmlFor={startInputId} className="nc-range-slider__label" {...ncSlot("label")}>
                {label}
              </label>
            ) : null}

            {description ? (
              <div id={descriptionId} className="nc-range-slider__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}
          </div>

          {showValue || valueLabel ? (
            <span className="nc-range-slider__value" {...ncSlot("value")}>
              {displayedValue}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="nc-range-slider__control" aria-label={trackLabel} {...ncSlot("control")}>
        <div className="nc-range-slider__track" aria-hidden="true" {...ncSlot("track")}>
          <span className="nc-range-slider__range" {...ncSlot("range")} />
        </div>

        <input
          {...startInputProps}
          id={startInputId}
          className={cx("nc-range-slider__input nc-range-slider__input--start", startInputProps?.className)}
          type="range"
          min={normalizedMin}
          max={normalizedMax}
          step={normalizedStep}
          value={currentValue[0]}
          disabled={disabled || startInputProps?.disabled}
          readOnly={readOnly || startInputProps?.readOnly}
          required={required || startInputProps?.required}
          aria-label={startThumbLabel ?? startInputProps?.["aria-label"] ?? "Minimum value"}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-orientation={orientation}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          onChange={handleStartChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          onKeyUp={handleCommit}
          {...ncSlot("start-input")}
        />

        <input
          {...endInputProps}
          id={endInputId}
          className={cx("nc-range-slider__input nc-range-slider__input--end", endInputProps?.className)}
          type="range"
          min={normalizedMin}
          max={normalizedMax}
          step={normalizedStep}
          value={currentValue[1]}
          disabled={disabled || endInputProps?.disabled}
          readOnly={readOnly || endInputProps?.readOnly}
          required={required || endInputProps?.required}
          aria-label={endThumbLabel ?? endInputProps?.["aria-label"] ?? "Maximum value"}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-orientation={orientation}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          onChange={handleEndChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          onKeyUp={handleCommit}
          {...ncSlot("end-input")}
        />

        {showMarks && visibleMarks.length > 0 ? (
          <div className="nc-range-slider__marks" aria-hidden="true" {...ncSlot("marks")}>
            {visibleMarks.map((mark) => (
              <span key={`${mark.value}`} className="nc-range-slider__mark" style={{ "--nc-range-slider-mark-progress": `${mark.progress}%` } as RangeSliderStyle} {...ncSlot("mark")}>
                <span className="nc-range-slider__mark-dot" {...ncSlot("mark-dot")} />
                {mark.label ? (
                  <span className="nc-range-slider__mark-label" {...ncSlot("mark-label")}>
                    {mark.label}
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {showTrackLabels ? (
        <div className="nc-range-slider__footer" {...ncSlot("footer")}>
          <span className="nc-range-slider__min-label" {...ncSlot("min-label")}>
            {formatValue ? formatValue(normalizedMin) : normalizedMin}
          </span>
          <span className="nc-range-slider__max-label" {...ncSlot("max-label")}>
            {formatValue ? formatValue(normalizedMax) : normalizedMax}
          </span>
        </div>
      ) : null}

      {hasMessage ? (
        <div id={messageId} className="nc-range-slider__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});