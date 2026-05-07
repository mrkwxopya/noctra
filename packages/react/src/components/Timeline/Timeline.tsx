import { forwardRef, useId, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TimelineItem, TimelineProps } from "./Timeline.types";

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

const defaultMarkerIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <circle cx="10" cy="10" r="4" />
  </svg>
);

const completedIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(function Timeline(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    data = [],
    value,
    defaultValue = null,
    onValueChange,
    onItemSelect,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    emptyMessage = "No timeline items",
    variant = "surface",
    align = "left",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    selectable = true,
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
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const selectedValue = isControlled ? value : internalValue;
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  function selectItem(item: TimelineItem): void {
    if (!selectable || disabled || readOnly || item.disabled) return;

    const nextValue = item.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    onItemSelect?.(item);
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLButtonElement>, item: TimelineItem): void {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    selectItem(item);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-timeline-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-align={align}
      data-selectable={selectable || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: selectedValue ? "selected" : data.length > 0 ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-timeline__header">
          {label ? (
            <div id={labelId} className="nc-timeline__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-timeline__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="nc-timeline__list"
        role="list"
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        {...ncSlot("list")}
      >
        {data.length > 0 ? (
          data.map((item, index) => {
            const selected = selectedValue === item.value;
            const active = item.active ?? selected;
            const completed = item.completed ?? false;
            const itemTone = item.tone ?? tone;
            const isItemDisabled = disabled || item.disabled;
            const itemContent = (
              <>
                <span className="nc-timeline__rail" aria-hidden="true" {...ncSlot("rail")}>
                  <span className="nc-timeline__marker" {...ncSlot("marker")}>
                    <span className="nc-timeline__icon" {...ncSlot("icon")}>
                      {item.icon ?? (completed ? completedIcon : defaultMarkerIcon)}
                    </span>
                  </span>
                </span>

                <span className="nc-timeline__content" {...ncSlot("content")}>
                  <span className="nc-timeline__item-header" {...ncSlot("header")}>
                    <span className="nc-timeline__title" {...ncSlot("title")}>
                      {item.title}
                    </span>

                    {item.time ? (
                      <span className="nc-timeline__time" {...ncSlot("time")}>
                        {item.time}
                      </span>
                    ) : null}
                  </span>

                  {item.description ? (
                    <span className="nc-timeline__description-text" {...ncSlot("description-text")}>
                      {item.description}
                    </span>
                  ) : null}

                  {(item.meta || item.badge) ? (
                    <span className="nc-timeline__meta" {...ncSlot("meta")}>
                      {item.meta ? <span>{item.meta}</span> : null}
                      {item.badge ? (
                        <span className="nc-timeline__badge" {...ncSlot("badge")}>
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </span>
              </>
            );

            if (selectable) {
              return (
                <button
                  key={item.value}
                  type="button"
                  className="nc-timeline__item"
                  role="listitem"
                  disabled={isItemDisabled}
                  aria-current={active ? "step" : undefined}
                  aria-pressed={selected}
                  data-index={index}
                  data-active={active || undefined}
                  data-completed={completed || undefined}
                  data-selected={selected || undefined}
                  data-disabled={item.disabled || undefined}
                  data-tone={itemTone}
                  onClick={() => selectItem(item)}
                  onKeyDown={(event) => handleItemKeyDown(event, item)}
                  {...ncSlot("item")}
                >
                  {itemContent}
                </button>
              );
            }

            return (
              <div
                key={item.value}
                className="nc-timeline__item"
                role="listitem"
                aria-current={active ? "step" : undefined}
                data-index={index}
                data-active={active || undefined}
                data-completed={completed || undefined}
                data-selected={selected || undefined}
                data-disabled={item.disabled || undefined}
                data-tone={itemTone}
                {...ncSlot("item")}
              >
                {itemContent}
              </div>
            );
          })
        ) : (
          <div className="nc-timeline__empty" {...ncSlot("empty")}>
            {emptyMessage}
          </div>
        )}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-timeline__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});