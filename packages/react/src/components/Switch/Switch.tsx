import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SwitchProps } from "./Switch.types";

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

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(function Switch(
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
    onLabel,
    offLabel,
    thumbIcon,
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
      className={cx("nc-switch-root", className)}
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
        className={cx("nc-switch__input", inputProps?.className)}
        type="checkbox"
        role="switch"
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

      <span className="nc-switch__track" aria-hidden="true" {...ncSlot("track")}>
        {onLabel || offLabel ? (
          <span className="nc-switch__track-label" {...ncSlot("track-label")}>
            {isChecked ? onLabel : offLabel}
          </span>
        ) : null}

        <span className="nc-switch__thumb" {...ncSlot("thumb")}>
          {thumbIcon ? (
            <span className="nc-switch__thumb-icon" {...ncSlot("thumb-icon")}>
              {thumbIcon}
            </span>
          ) : null}
        </span>
      </span>

      {hasText ? (
        <span className="nc-switch__content" {...ncSlot("content")}>
          {label ? (
            <span className="nc-switch__label" {...ncSlot("label")}>
              {label}
            </span>
          ) : null}

          {description ? (
            <span id={descriptionId} className="nc-switch__description" {...ncSlot("description")}>
              {description}
            </span>
          ) : null}
        </span>
      ) : null}

      {hasMessage ? (
        <span id={messageId} className="nc-switch__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </span>
      ) : null}
    </label>
  );
});