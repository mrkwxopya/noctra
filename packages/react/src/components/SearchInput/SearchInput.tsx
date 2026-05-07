import { forwardRef, useId, useRef } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SearchInputProps } from "./SearchInput.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }
  };
}

function emitInputEvents(input: HTMLInputElement): void {
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

const defaultSearchIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.473 9.765l2.631 2.63a.75.75 0 1 0 1.061-1.06l-2.63-2.632A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clipRule="evenodd" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
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
    clearable = false,
    searchIcon = defaultSearchIcon,
    clearLabel = "Clear search",
    onClear,
    disabled,
    readOnly,
    required,
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleClear(): void {
    const input = inputRef.current;

    if (!input || disabled || readOnly) return;

    input.value = "";
    emitInputEvents(input);
    input.focus();
    onClear?.();
  }

  return (
    <div
      {...rootProps}
      className={cx("nc-search-input-root", rootProps?.className)}
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
      data-clearable={clearable || undefined}
    >
      {label ? (
        <label className="nc-search-input__label" htmlFor={inputId} {...ncSlot("label")}>
          {label}
          {required ? <span className="nc-search-input__required" aria-hidden="true">*</span> : null}
        </label>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-search-input__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div
        {...wrapperProps}
        className={cx("nc-search-input__wrapper", wrapperProps?.className)}
        {...ncSlot("wrapper")}
      >
        <span className="nc-search-input__search-icon" aria-hidden="true" {...ncSlot("search-icon")}>
          {searchIcon}
        </span>

        <input
          ref={mergeRefs(inputRef, ref)}
          id={inputId}
          className={cx("nc-search-input__field", className)}
          type="search"
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...ncSlot("field")}
          {...rest}
        />

        {loading ? (
          <span className="nc-search-input__loader" aria-hidden="true" {...ncSlot("loader")} />
        ) : clearable ? (
          <button
            type="button"
            className="nc-search-input__clear-button"
            aria-label={clearLabel}
            disabled={disabled || readOnly}
            onClick={handleClear}
            {...ncSlot("clear-button")}
          >
            <span className="nc-search-input__clear-icon" aria-hidden="true" {...ncSlot("clear-icon")}>
              {clearIcon}
            </span>
          </button>
        ) : null}
      </div>

      {error ? (
        <div id={errorId} className="nc-search-input__error" role="alert" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});