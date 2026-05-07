import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CheckboxProps } from "./Checkbox.types";

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

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

const minusIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M4.25 10A.75.75 0 0 1 5 9.25h10a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    checked,
    defaultChecked = false,
    onCheckedChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    icon,
    indeterminate = false,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    labelPosition = "right",
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;
  const isInvalid = invalid ?? Boolean(error);
  const hasText = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  function setCheckedValue(nextChecked: boolean): void {
    if (disabled || readOnly) return;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setCheckedValue(event.currentTarget.checked);
    }
  }

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-checkbox-root", className)}
      style={style}
      data-checked={isChecked || undefined}
      data-indeterminate={indeterminate || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-label-position={labelPosition}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: indeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked"
      })}
      {...rest}
    >
      <input
        {...inputProps}
        ref={(node) => {
          inputRef.current = node;
        }}
        id={inputId}
        className={cx("nc-checkbox__input", inputProps?.className)}
        type="checkbox"
        checked={isChecked}
        disabled={disabled || inputProps?.disabled}
        readOnly={readOnly || inputProps?.readOnly}
        required={required || inputProps?.required}
        aria-invalid={isInvalid || undefined}
        aria-required={required || undefined}
        aria-checked={indeterminate ? "mixed" : isChecked}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        onChange={handleChange}
        {...ncSlot("input")}
      />

      <span className="nc-checkbox__box" aria-hidden="true" {...ncSlot("box")}>
        <span className="nc-checkbox__icon" {...ncSlot("icon")}>
          {icon ?? (indeterminate ? minusIcon : checkIcon)}
        </span>
      </span>

      {hasText ? (
        <span className="nc-checkbox__content" {...ncSlot("content")}>
          {label ? (
            <span className="nc-checkbox__label" {...ncSlot("label")}>
              {label}
            </span>
          ) : null}

          {description ? (
            <span id={descriptionId} className="nc-checkbox__description" {...ncSlot("description")}>
              {description}
            </span>
          ) : null}
        </span>
      ) : null}

      {hasMessage ? (
        <span id={messageId} className="nc-checkbox__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </span>
      ) : null}
    </label>
  );
});