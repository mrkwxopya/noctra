import { forwardRef, useId, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { RatingProps, RatingStyle } from "./Rating.types";

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

function normalizeMax(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 5;
  return Math.max(1, Math.min(10, Math.floor(value)));
}

function normalizeValue(value: number | undefined, max: number, precision: 0.5 | 1): number {
  if (value === undefined || !Number.isFinite(value)) return 0;

  const clampedValue = Math.max(0, Math.min(max, value));
  const multiplier = precision === 0.5 ? 2 : 1;

  return Math.round(clampedValue * multiplier) / multiplier;
}

function getFillRatio(value: number, itemValue: number): number {
  if (value >= itemValue) return 1;
  if (value <= itemValue - 1) return 0;
  return Math.max(0, Math.min(1, value - (itemValue - 1)));
}

const starIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M9.104 2.9a1 1 0 0 1 1.792 0l1.79 3.63l4.006.582a1 1 0 0 1 .554 1.706l-2.899 2.826l.684 3.99a1 1 0 0 1-1.45 1.053L10 14.804l-3.581 1.883a1 1 0 0 1-1.45-1.054l.684-3.989l-2.899-2.826a1 1 0 0 1 .554-1.706l4.006-.582L9.104 2.9Z" />
  </svg>
);

export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = 0,
    onValueChange,
    onHoverChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    emptyMessage = "No rating selected",
    icon,
    emptyIcon,
    getItemLabel,
    max = 5,
    precision = 1,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "warning",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    allowClear = true,
    fullWidth = false,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const labelId = label ? `${rootId}-label` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const normalizedMax = normalizeMax(max);
  const normalizedPrecision = precision === 0.5 ? 0.5 : 1;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => normalizeValue(defaultValue, normalizedMax, normalizedPrecision));
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const currentValue = normalizeValue(isControlled ? value : internalValue, normalizedMax, normalizedPrecision);
  const visibleValue = hoverValue ?? currentValue;
  const ratingStyle: RatingStyle = { ...style };
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  ratingStyle["--nc-rating-max"] = String(normalizedMax);

  function setRatingValue(nextValue: number): void {
    if (disabled || readOnly) return;

    const normalizedNextValue = normalizeValue(nextValue, normalizedMax, normalizedPrecision);
    const clearedValue = allowClear && normalizedNextValue === currentValue ? 0 : normalizedNextValue;

    if (!isControlled) {
      setInternalValue(clearedValue);
    }

    onValueChange?.(clearedValue);
  }

  function setHoverRating(nextValue: number | null): void {
    if (disabled || readOnly) return;

    setHoverValue(nextValue);
    onHoverChange?.(nextValue);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, itemValue: number): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setRatingValue(itemValue);
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setRatingValue(Math.min(normalizedMax, currentValue + normalizedPrecision));
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setRatingValue(Math.max(0, currentValue - normalizedPrecision));
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setRatingValue(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setRatingValue(normalizedMax);
    }
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-rating-root", className)}
      style={ratingStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-empty={currentValue === 0 || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: currentValue > 0 ? "selected" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-rating__header">
          {label ? (
            <div id={labelId} className="nc-rating__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-rating__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="nc-rating__group"
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        aria-disabled={disabled || undefined}
        onMouseLeave={() => setHoverRating(null)}
        {...ncSlot("group")}
      >
        {Array.from({ length: normalizedMax }, (_, index) => {
          const itemValue = index + 1;
          const fillRatio = getFillRatio(visibleValue, itemValue);
          const selected = currentValue === itemValue;
          const ariaLabel = getItemLabel ? getItemLabel(itemValue, normalizedMax) : `${itemValue} of ${normalizedMax}`;

          return (
            <button
              key={itemValue}
              type="button"
              className="nc-rating__item"
              role="radio"
              aria-label={ariaLabel}
              aria-checked={selected}
              disabled={disabled}
              data-filled={fillRatio > 0 || undefined}
              data-half={fillRatio > 0 && fillRatio < 1 || undefined}
              data-selected={selected || undefined}
              onClick={() => setRatingValue(itemValue)}
              onMouseEnter={() => setHoverRating(itemValue)}
              onFocus={() => setHoverRating(itemValue)}
              onBlur={() => setHoverRating(null)}
              onKeyDown={(event) => handleKeyDown(event, itemValue)}
              {...ncSlot("item")}
            >
              <span className="nc-rating__empty-icon" aria-hidden="true" {...ncSlot("empty-icon")}>
                {emptyIcon ?? icon ?? starIcon}
              </span>

              <span className="nc-rating__icon" aria-hidden="true" style={{ width: `${fillRatio * 100}%` }} {...ncSlot("icon")}>
                {icon ?? starIcon}
              </span>
            </button>
          );
        })}
      </div>

      <div className="nc-rating__value" aria-live="polite" {...ncSlot("value")}>
        {currentValue > 0 ? `${currentValue}/${normalizedMax}` : emptyMessage}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-rating__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});