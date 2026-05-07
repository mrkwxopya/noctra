import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { RadioProps } from "./Radio.types";

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

const radioIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <circle cx="10" cy="10" r="5" />
  </svg>
);

export const Radio = forwardRef<HTMLLabelElement, RadioProps>(function Radio(
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
    name,
    value,
    variant = "surface",
    size = "md",
    radius = "full",
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

  return (
    <label
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-radio-root", className)}
      style={style}
      data-checked={isChecked || undefined}
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
        state: isChecked ? "checked" : "unchecked"
      })}
      {...rest}
    >
      <input
        {...inputProps}
        id={inputId}
        className={cx("nc-radio__input", inputProps?.className)}
        type="radio"
        name={name ?? inputProps?.name}
        value={value ?? inputProps?.value}
        checked={isChecked}
        disabled={disabled || inputProps?.disabled}
        readOnly={readOnly || inputProps?.readOnly}
        required={required || inputProps?.required}
        aria-invalid={isInvalid || undefined}
        aria-required={required || undefined}
        aria-checked={isChecked}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        onChange={handleChange}
        {...ncSlot("input")}
      />

      <span className="nc-radio__box" aria-hidden="true" {...ncSlot("box")}>
        <span className="nc-radio__icon" {...ncSlot("icon")}>
          {icon ?? radioIcon}
        </span>
      </span>

      {hasText ? (
        <span className="nc-radio__content" {...ncSlot("content")}>
          {label ? (
            <span className="nc-radio__label" {...ncSlot("label")}>
              {label}
            </span>
          ) : null}

          {description ? (
            <span id={descriptionId} className="nc-radio__description" {...ncSlot("description")}>
              {description}
            </span>
          ) : null}
        </span>
      ) : null}

      {hasMessage ? (
        <span id={messageId} className="nc-radio__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </span>
      ) : null}
    </label>
  );
});