import { forwardRef, useId } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NativeSelectProps } from "./NativeSelect.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
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
    placeholder,
    invalid,
    valid,
    loading = false,
    disabled,
    readOnly,
    required,
    rootProps,
    wrapperProps,
    id,
    children,
    ...rest
  } = props;

  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = description ? `${selectId}-description` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      {...rootProps}
      className={cx("nc-native-select-root", rootProps?.className)}
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
        <label className="nc-native-select__label" htmlFor={selectId} {...ncSlot("label")}>
          {label}
          {required ? <span className="nc-native-select__required" aria-hidden="true">*</span> : null}
        </label>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-native-select__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div
        {...wrapperProps}
        className={cx("nc-native-select__wrapper", wrapperProps?.className)}
        {...ncSlot("wrapper")}
      >
        <select
          ref={ref}
          id={selectId}
          className={cx("nc-native-select__field", className)}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-readonly={readOnly || undefined}
          {...ncSlot("field")}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>

        {loading ? (
          <span className="nc-native-select__loader" aria-hidden="true" {...ncSlot("loader")} />
        ) : (
          <span className="nc-native-select__arrow" aria-hidden="true" {...ncSlot("arrow")}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>

      {error ? (
        <div id={errorId} className="nc-native-select__error" role="alert" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});