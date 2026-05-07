import { forwardRef, useId, useState } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ProgressProps, ProgressSection, ProgressStyle } from "./Progress.types";

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
  if (value === undefined || !Number.isFinite(value) || value <= 0) return 100;
  return value;
}

function normalizeMin(value: number | undefined, max: number): number {
  if (value === undefined || !Number.isFinite(value)) return 0;
  return Math.min(value, max - 1);
}

function clampValue(value: number | undefined, min: number, max: number): number {
  if (value === undefined || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function toPercent(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function normalizeSection(section: ProgressSection, min: number, max: number): ProgressSection {
  return {
    ...section,
    value: clampValue(section.value, min, max)
  };
}

function getDefaultValueLabel(value: number, max: number, percent: number): string {
  if (max === 100) return `${Math.round(percent)}%`;
  return `${value}/${max}`;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = 0,
    max,
    min,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    valueLabel,
    formatValue,
    sections,
    mode = "line",
    labelPosition = "outside",
    variant = "surface",
    size = "md",
    radius = "full",
    tone = "primary",
    density = "default",
    disabled,
    required,
    invalid,
    indeterminate = false,
    striped = false,
    animated = false,
    fullWidth = true,
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
  const normalizedMin = normalizeMin(min, normalizedMax);
  const [internalValue] = useState(() => clampValue(defaultValue, normalizedMin, normalizedMax));
  const currentValue = clampValue(value ?? internalValue, normalizedMin, normalizedMax);
  const percent = toPercent(currentValue, normalizedMin, normalizedMax);
  const normalizedSections = sections?.map((section) => normalizeSection(section, normalizedMin, normalizedMax)) ?? [];
  const hasSections = normalizedSections.length > 0;
  const progressStyle: ProgressStyle = { ...style };
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description || labelPosition === "outside");
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const renderedValueLabel = valueLabel ?? (formatValue ? formatValue(currentValue, normalizedMax, percent) : getDefaultValueLabel(currentValue, normalizedMax, percent));
  const circleRadius = 44;
  const circleDash = 2 * Math.PI * circleRadius;
  const circleOffset = circleDash - (circleDash * percent) / 100;

  progressStyle["--nc-progress-value"] = `${percent}%`;
  progressStyle["--nc-progress-circle-dash"] = `${circleDash}`;
  progressStyle["--nc-progress-circle-offset"] = `${circleOffset}`;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-progress-root", className)}
      style={progressStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-mode={mode}
      data-label-position={labelPosition}
      data-indeterminate={indeterminate || undefined}
      data-striped={striped || undefined}
      data-animated={animated || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: indeterminate ? "indeterminate" : percent >= 100 ? "complete" : percent > 0 ? "progress" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-progress__header" {...ncSlot("header")}>
          <div className="nc-progress__meta">
            {label ? (
              <div id={labelId} className="nc-progress__label" {...ncSlot("label")}>
                {label}
              </div>
            ) : null}

            {description ? (
              <div id={descriptionId} className="nc-progress__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}
          </div>

          {labelPosition === "outside" ? (
            <div className="nc-progress__value-label" {...ncSlot("value-label")}>
              {renderedValueLabel}
            </div>
          ) : null}
        </div>
      ) : null}

      {mode === "line" ? (
        <div
          className="nc-progress__track"
          role="progressbar"
          aria-labelledby={labelId}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          aria-valuemin={normalizedMin}
          aria-valuemax={normalizedMax}
          aria-valuenow={indeterminate ? undefined : currentValue}
          {...ncSlot("track")}
        >
          {hasSections ? (
            normalizedSections.map((section, index) => {
              const sectionPercent = toPercent(section.value, normalizedMin, normalizedMax);

              return (
                <span
                  key={`${index}-${section.value}`}
                  className="nc-progress__section"
                  title={section.title}
                  data-tone={section.tone}
                  style={{ width: `${sectionPercent}%` }}
                  {...ncSlot("section")}
                >
                  {section.label ? <span>{section.label}</span> : null}
                </span>
              );
            })
          ) : (
            <span className="nc-progress__bar" {...ncSlot("bar")}>
              {labelPosition === "inside" ? (
                <span className="nc-progress__value-label" {...ncSlot("value-label")}>
                  {renderedValueLabel}
                </span>
              ) : null}
            </span>
          )}
        </div>
      ) : (
        <div
          className="nc-progress__circle"
          role="progressbar"
          aria-labelledby={labelId}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          aria-valuemin={normalizedMin}
          aria-valuemax={normalizedMax}
          aria-valuenow={indeterminate ? undefined : currentValue}
          {...ncSlot("circle")}
        >
          <svg className="nc-progress__circle-svg" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="nc-progress__circle-track" cx="50" cy="50" r={circleRadius} {...ncSlot("circle-track")} />
            <circle className="nc-progress__circle-bar" cx="50" cy="50" r={circleRadius} {...ncSlot("circle-bar")} />
          </svg>

          {labelPosition !== "none" ? (
            <span className="nc-progress__circle-content" {...ncSlot("circle-content")}>
              {renderedValueLabel}
            </span>
          ) : null}
        </div>
      )}

      {hasMessage ? (
        <div id={messageId} className="nc-progress__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});