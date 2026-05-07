import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { FloatLabelProps } from "./FloatLabel.types";

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

export const FloatLabel = forwardRef<HTMLDivElement, FloatLabelProps>(function FloatLabel(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    htmlFor,
    active,
    variant = "surface",
    placement = "inside",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    fullWidth = true,
    withBorder = true,
    style,
    ...rest
  } = props;

  const isInvalid = invalid ?? Boolean(error);
  const hasMessage = Boolean(error || successMessage || warningMessage);
  const message = error ?? successMessage ?? warningMessage;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-float-label-root", className)}
      style={style}
      data-active={active || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-placement={placement}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: active ? "active" : "idle"
      })}
      {...rest}
    >
      <div className="nc-float-label__field" {...ncSlot("field")}>
        <div className="nc-float-label__content" {...ncSlot("content")}>
          {children}
        </div>

        <label className="nc-float-label__label" htmlFor={htmlFor} {...ncSlot("label")}>
          <span>{label}</span>
          {required ? (
            <span className="nc-float-label__required" aria-hidden="true" {...ncSlot("required")}>
              *
            </span>
          ) : null}
        </label>
      </div>

      {description ? (
        <div className="nc-float-label__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      {hasMessage ? (
        <div className="nc-float-label__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});