import { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { InputProps } from "./Input.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
): ReactElement {
  const {
    className,
    variant = "outline",
    size = "md",
    radius = "md",
    density = "default",
    label,
    description,
    error,
    invalid,
    valid,
    loading = false,
    disabled,
    readOnly,
    required,
    leftSection,
    rightSection,
    rootProps,
    wrapperProps,
    id,
    ...rest
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      {...rootProps}
      className={cx("nc-input-root", rootProps?.className)}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        density,
        invalid,
        valid,
        disabled,
        readonly: readOnly,
        required,
        loading
      })}
    >
      {label ? (
        <label className="nc-input__label" htmlFor={inputId} {...ncSlot("label")}>
          {label}
          {required ? <span className="nc-input__required" aria-hidden="true">*</span> : null}
        </label>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-input__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div
        {...wrapperProps}
        className={cx("nc-input__wrapper", wrapperProps?.className)}
        {...ncSlot("wrapper")}
      >
        {leftSection ? (
          <span className="nc-input__section nc-input__section--left" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          className={cx("nc-input__field", className)}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...ncSlot("field")}
          {...rest}
        />

        {loading ? (
          <span className="nc-input__loader" aria-hidden="true" {...ncSlot("loader")} />
        ) : rightSection ? (
          <span className="nc-input__section nc-input__section--right" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {error ? (
        <div id={errorId} className="nc-input__error" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});