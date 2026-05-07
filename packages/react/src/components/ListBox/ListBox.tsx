import { forwardRef, useId, useMemo, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ListBoxOption, ListBoxProps, ListBoxStyle, ListBoxValue } from "./ListBox.types";

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

function normalizeValue(value: ListBoxValue | undefined, multiple: boolean): string[] {
  if (value === undefined || value === null) return [];

  if (Array.isArray(value)) {
    return multiple ? value : value.slice(0, 1);
  }

  return value ? [value] : [];
}

function serializeValue(values: string[], multiple: boolean): ListBoxValue {
  if (multiple) return values;
  return values[0] ?? null;
}

function includesQuery(option: ListBoxOption, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  const labelText = typeof option.label === "string" ? option.label : "";
  const descriptionText = typeof option.description === "string" ? option.description : "";
  const haystack = [option.value, labelText, descriptionText, ...(option.keywords ?? [])].join(" ").toLowerCase();

  return haystack.includes(normalizedQuery);
}

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

export const ListBox = forwardRef<HTMLDivElement, ListBoxProps>(function ListBox(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = null,
    onValueChange,
    options = [],
    label,
    description,
    error,
    successMessage,
    warningMessage,
    emptyMessage = "No options found",
    selectionLabel,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    multiple = false,
    searchable = false,
    searchValue,
    defaultSearchValue = "",
    onSearchChange,
    searchPlaceholder = "Search options...",
    maxHeight = 260,
    fullWidth = true,
    withBorder = true,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const labelId = label ? `${rootId}-label` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const isValueControlled = value !== undefined;
  const isSearchControlled = searchValue !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(() => normalizeValue(defaultValue, multiple));
  const [internalSearch, setInternalSearch] = useState(defaultSearchValue);
  const selectedValues = normalizeValue(isValueControlled ? value : internalValue, multiple);
  const selectedValueSet = new Set(selectedValues);
  const currentSearch = isSearchControlled ? searchValue : internalSearch;
  const filteredOptions = useMemo(() => options.filter((option) => includesQuery(option, currentSearch)), [currentSearch, options]);
  const listBoxStyle: ListBoxStyle = { ...style };
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  listBoxStyle["--nc-list-box-max-height"] = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

  function setSelectedValues(nextValues: string[]): void {
    const normalizedNextValues = multiple ? nextValues : nextValues.slice(0, 1);

    if (!isValueControlled) {
      setInternalValue(normalizedNextValues);
    }

    onValueChange?.(serializeValue(normalizedNextValues, multiple));
  }

  function toggleOption(option: ListBoxOption): void {
    if (disabled || readOnly || option.disabled) return;

    if (multiple) {
      const nextValues = selectedValueSet.has(option.value)
        ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
        : [...selectedValues, option.value];

      setSelectedValues(nextValues);
      return;
    }

    setSelectedValues([option.value]);
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextSearchValue = event.currentTarget.value;

    if (!isSearchControlled) {
      setInternalSearch(nextSearchValue);
    }

    onSearchChange?.(nextSearchValue);
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, option: ListBoxOption): void {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    toggleOption(option);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-list-box-root", className)}
      style={listBoxStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-multiple={multiple || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: selectedValues.length > 0 ? "selected" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-list-box__header">
          {label ? (
            <div id={labelId} className="nc-list-box__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-list-box__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      {searchable ? (
        <input
          className="nc-list-box__search"
          type="search"
          value={currentSearch}
          placeholder={searchPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={searchPlaceholder}
          onChange={handleSearchChange}
          {...ncSlot("search")}
        />
      ) : null}

      <div
        className="nc-list-box__list"
        role="listbox"
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        aria-multiselectable={multiple || undefined}
        aria-disabled={disabled || undefined}
        {...ncSlot("list")}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            const selected = selectedValueSet.has(option.value);
            const optionId = `${rootId}-option-${option.value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

            return (
              <button
                key={option.value}
                id={optionId}
                type="button"
                className="nc-list-box__option"
                role="option"
                aria-selected={selected}
                disabled={disabled || option.disabled}
                data-selected={selected || undefined}
                data-disabled={option.disabled || undefined}
                onClick={() => toggleOption(option)}
                onKeyDown={(event) => handleOptionKeyDown(event, option)}
                {...ncSlot("option")}
              >
                {option.icon ? (
                  <span className="nc-list-box__option-icon" aria-hidden="true" {...ncSlot("option-icon")}>
                    {option.icon}
                  </span>
                ) : null}

                <span className="nc-list-box__option-content" {...ncSlot("option-content")}>
                  <span className="nc-list-box__option-label" {...ncSlot("option-label")}>
                    {option.label}
                  </span>

                  {option.description ? (
                    <span className="nc-list-box__option-description" {...ncSlot("option-description")}>
                      {option.description}
                    </span>
                  ) : null}
                </span>

                {option.badge ? (
                  <span className="nc-list-box__option-badge" {...ncSlot("option-badge")}>
                    {option.badge}
                  </span>
                ) : null}

                <span className="nc-list-box__check" aria-hidden="true" {...ncSlot("check")}>
                  {checkIcon}
                </span>
              </button>
            );
          })
        ) : (
          <div className="nc-list-box__empty" {...ncSlot("empty")}>
            {emptyMessage}
          </div>
        )}
      </div>

      {selectionLabel ? (
        <div className="nc-list-box__selection" {...ncSlot("selection")}>
          {selectionLabel}
        </div>
      ) : null}

      {hasMessage ? (
        <div id={messageId} className="nc-list-box__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});