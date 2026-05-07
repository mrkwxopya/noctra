import { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { FormFieldLabelProps, FormFieldMessageProps, FormFieldProps } from "./FormField.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  props,
  ref
): ReactElement {
  const {
    children,
    className,
    label,
    description,
    error,
    hint,
    required,
    invalid,
    disabled,
    readonly,
    size = "md",
    density = "default",
    variant = "default",
    orientation = "vertical",
    controlId,
    labelProps,
    ...rest
  } = props;

  const generatedId = useId();
  const fieldId = controlId ?? generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div
      ref={ref}
      className={cx("nc-form-field", className)}
      aria-disabled={disabled || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        density,
        orientation,
        invalid,
        disabled,
        readonly,
        required
      })}
      {...rest}
    >
      {label ? (
        <label
          {...labelProps}
          className={cx("nc-form-field__label", labelProps?.className)}
          htmlFor={labelProps?.htmlFor ?? fieldId}
          {...ncSlot("label")}
        >
          {label}
          {required ? <span className="nc-form-field__required" aria-hidden="true" {...ncSlot("required")}>*</span> : null}
        </label>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-form-field__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div
        className="nc-form-field__control"
        data-control-id={fieldId}
        data-description-id={descriptionId}
        data-hint-id={hintId}
        data-error-id={errorId}
        {...ncSlot("control")}
      >
        {children}
      </div>

      {hint ? (
        <div id={hintId} className="nc-form-field__hint" {...ncSlot("hint")}>
          {hint}
        </div>
      ) : null}

      {error ? (
        <div id={errorId} className="nc-form-field__error" role="alert" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});

export function FormFieldLabel(props: FormFieldLabelProps): ReactElement {
  const { className, children, required, ...rest } = props;

  return (
    <label className={cx("nc-form-field__label", className)} {...ncSlot("label")} {...rest}>
      {children}
      {required ? <span className="nc-form-field__required" aria-hidden="true" {...ncSlot("required")}>*</span> : null}
    </label>
  );
}

export function FormFieldMessage(props: FormFieldMessageProps): ReactElement {
  const { className, tone = "description", ...rest } = props;

  return (
    <div
      className={cx("nc-form-field__message", className)}
      data-tone={tone}
      role={tone === "error" ? "alert" : undefined}
      {...ncSlot("message")}
      {...rest}
    />
  );
}