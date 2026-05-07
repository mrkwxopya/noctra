import { forwardRef, useId, useState } from "react";
import type { CSSProperties, KeyboardEvent, MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SegmentedControlOption, SegmentedControlProps } from "./SegmentedControl.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null): void {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
}

function findEnabledIndex(options: SegmentedControlOption[], startIndex: number, direction: 1 | -1): number {
  if (options.length === 0) return -1;

  let cursor = startIndex;

  for (let step = 0; step < options.length; step += 1) {
    cursor = (cursor + direction + options.length) % options.length;

    if (!options[cursor]?.disabled) {
      return cursor;
    }
  }

  return -1;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  props,
  ref
): ReactElement {
  const {
    className,
    options,
    value,
    defaultValue,
    onValueChange,
    variant = "solid",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    orientation = "horizontal",
    fullWidth = false,
    disabled,
    readOnly,
    required,
    invalid,
    name,
    label,
    description,
    error,
    id,
    style,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const segmentedId = id ?? generatedId;
  const labelId = label ? `${segmentedId}-label` : undefined;
  const descriptionId = description ? `${segmentedId}-description` : undefined;
  const errorId = error ? `${segmentedId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const firstEnabledOption = options.find((option) => !option.disabled);
  const fallbackValue = defaultValue ?? firstEnabledOption?.value ?? "";
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(fallbackValue);
  const currentValue = isControlled ? value : internalValue;
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === currentValue));
  const selectedOption = options[selectedIndex];
  const itemCount = Math.max(1, options.length);

  function commit(option: SegmentedControlOption): void {
    if (disabled || readOnly || option.disabled) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }

    onValueChange?.(option.value, option);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    const nextDirectionKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const previousDirectionKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";

    if (event.key === nextDirectionKey) {
      event.preventDefault();
      const nextIndex = findEnabledIndex(options, selectedIndex, 1);
      const option = options[nextIndex];
      if (option) commit(option);
      return;
    }

    if (event.key === previousDirectionKey) {
      event.preventDefault();
      const nextIndex = findEnabledIndex(options, selectedIndex, -1);
      const option = options[nextIndex];
      if (option) commit(option);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const firstIndex = options.findIndex((option) => !option.disabled);
      const option = options[firstIndex];
      if (option) commit(option);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastIndex = [...options].reverse().findIndex((option) => !option.disabled);
      const option = lastIndex >= 0 ? options[options.length - 1 - lastIndex] : undefined;
      if (option) commit(option);
    }
  }

  const rootStyle = {
    ...style,
    "--nc-segmented-control-count": itemCount,
    "--nc-segmented-control-index": selectedIndex
  } as CSSProperties;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={segmentedId}
      className={cx("nc-segmented-control-root", className)}
      style={rootStyle}
      data-full-width={fullWidth || undefined}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        orientation,
        disabled,
        readonly: readOnly,
        required,
        invalid,
        state: currentValue ? "selected" : "empty"
      })}
      {...rest}
    >
      {name ? <input type="hidden" name={name} value={currentValue} required={required} {...ncSlot("hidden-input")} /> : null}

      {label ? (
        <div id={labelId} className="nc-segmented-control__label" {...ncSlot("label")}>
          {label}
          {required ? <span className="nc-segmented-control__required" aria-hidden="true">*</span> : null}
        </div>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-segmented-control__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div
        className="nc-segmented-control__items"
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-disabled={disabled || undefined}
        {...ncSlot("items")}
      >
        {selectedOption ? <span className="nc-segmented-control__indicator" aria-hidden="true" {...ncSlot("indicator")} /> : null}

        {options.map((option) => {
          const selected = option.value === currentValue;

          return (
            <button
              key={option.value}
              type="button"
              className="nc-segmented-control__item"
              role="radio"
              aria-checked={selected}
              disabled={disabled || option.disabled}
              data-selected={selected || undefined}
              data-disabled={option.disabled || undefined}
              onClick={() => commit(option)}
              {...ncSlot("item")}
            >
              <span className="nc-segmented-control__item-label" {...ncSlot("item-label")}>
                {option.label}
              </span>

              {option.description ? (
                <span className="nc-segmented-control__item-description" {...ncSlot("item-description")}>
                  {option.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {error ? (
        <div id={errorId} className="nc-segmented-control__error" role="alert" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});