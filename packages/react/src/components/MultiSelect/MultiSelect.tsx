import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { MultiSelectGroup, MultiSelectOption, MultiSelectProps, MultiSelectStyle } from "./MultiSelect.types";

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

function toCssValue(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}px`;
  return value;
}

function groupOptions(options: MultiSelectOption[], groups: MultiSelectGroup[]): MultiSelectGroup[] {
  if (groups.length > 0) return groups;
  if (options.length === 0) return [];
  return [{ id: "default", options }];
}

function flattenGroups(groups: MultiSelectGroup[]): MultiSelectOption[] {
  return groups.flatMap((group) => group.options);
}

function optionText(option: MultiSelectOption): string {
  return [
    option.value,
    typeof option.label === "string" ? option.label : "",
    typeof option.description === "string" ? option.description : "",
    ...(option.keywords ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function findNextEnabledIndex(options: MultiSelectOption[], startIndex: number, direction: 1 | -1): number {
  if (options.length === 0) return -1;

  let cursor = startIndex;

  for (let index = 0; index < options.length; index += 1) {
    cursor = (cursor + direction + options.length) % options.length;

    if (!options[cursor]?.disabled) {
      return cursor;
    }
  }

  return -1;
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

const chevronIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    options = [],
    groups = [],
    value,
    defaultValue = [],
    onValueChange,
    opened,
    defaultOpened = false,
    onOpenChange,
    label,
    description,
    placeholder = "Select options",
    emptyMessage = "No options found",
    clearLabel = "Clear selected options",
    removeLabel = "Remove option",
    maxSelectedValues,
    maxVisibleTags = 3,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    searchable = true,
    clearable = true,
    required,
    invalid,
    placement = "bottom",
    width = "full",
    withBorder = true,
    fullWidth = true,
    closeOnSelect = false,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    keepMounted = false,
    maxDropdownHeight = 260,
    buttonProps,
    optionButtonProps,
    id,
    onKeyDown,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const isValueControlled = value !== undefined;
  const isOpenControlled = opened !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(() => uniqueValues(defaultValue));
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const currentValues = uniqueValues(isValueControlled ? value ?? [] : internalValue);
  const isOpen = isOpenControlled ? opened : internalOpened;
  const normalizedGroups = useMemo(() => groupOptions(options, groups), [groups, options]);
  const allOptions = useMemo(() => flattenGroups(normalizedGroups), [normalizedGroups]);
  const selectedOptions = allOptions.filter((option) => currentValues.includes(option.value));
  const selectedValueSet = new Set(currentValues);
  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!searchable || normalizedQuery.length === 0) {
      return normalizedGroups;
    }

    return normalizedGroups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) => optionText(option).includes(normalizedQuery))
      }))
      .filter((group) => group.options.length > 0);
  }, [normalizedGroups, query, searchable]);
  const filteredOptions = useMemo(() => flattenGroups(filteredGroups), [filteredGroups]);
  const shouldRenderDropdown = keepMounted || isOpen;
  const hasHeader = Boolean(label || description);
  const hasOptions = filteredOptions.length > 0;
  const hasSelection = currentValues.length > 0;
  const visibleSelectedOptions = selectedOptions.slice(0, Math.max(0, maxVisibleTags));
  const hiddenSelectedCount = Math.max(selectedOptions.length - visibleSelectedOptions.length, 0);
  const multiSelectStyle: MultiSelectStyle = { ...style };
  const dropdownHeight = toCssValue(maxDropdownHeight);

  if (dropdownHeight !== undefined) {
    multiSelectStyle["--nc-multi-select-max-dropdown-height"] = dropdownHeight;
  }

  function emitValues(nextValues: string[]): void {
    const normalizedValues = uniqueValues(nextValues);
    const nextOptions = allOptions.filter((option) => normalizedValues.includes(option.value));

    if (!isValueControlled) {
      setInternalValue(normalizedValues);
    }

    onValueChange?.(normalizedValues, nextOptions);
  }

  function setOpen(nextOpened: boolean): void {
    if (disabled || readOnly) return;

    if (!isOpenControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function toggleOption(option: MultiSelectOption): void {
    if (disabled || readOnly || option.disabled) return;

    const selected = currentValues.includes(option.value);

    if (!selected && maxSelectedValues !== undefined && currentValues.length >= maxSelectedValues) {
      return;
    }

    const nextValues = selected
      ? currentValues.filter((item) => item !== option.value)
      : [...currentValues, option.value];

    emitValues(nextValues);

    if (closeOnSelect) {
      setOpen(false);
    }
  }

  function removeValue(event: MouseEvent<HTMLButtonElement>, option: MultiSelectOption): void {
    event.stopPropagation();
    emitValues(currentValues.filter((item) => item !== option.value));
  }

  function clearSelection(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    emitValues([]);
    setQuery("");
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.currentTarget.value);
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    if (closeOnEscape && event.key === "Escape" && isOpen) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Backspace" && !isOpen && currentValues.length > 0) {
      emitValues(currentValues.slice(0, -1));
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        setOpen(true);
        return;
      }

      const nextIndex = findNextEnabledIndex(filteredOptions, activeIndex, 1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-option-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        setOpen(true);
        return;
      }

      const nextIndex = findNextEnabledIndex(filteredOptions, activeIndex, -1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-option-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      if (!isOpen) {
        event.preventDefault();
        setOpen(true);
        return;
      }

      const option = filteredOptions[activeIndex];

      if (option) {
        event.preventDefault();
        toggleOption(option);
      }
    }
  }

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    function handlePointerDown(event: PointerEvent): void {
      const root = rootRef.current;

      if (!root || root.contains(event.target as Node)) {
        return;
      }

      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeOnOutsideClick, isOpen]);

  useEffect(() => {
    if (!isOpen || !searchable) return;

    const frame = window.requestAnimationFrame(() => {
      searchRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    const firstEnabled = filteredOptions.findIndex((option) => !option.disabled);
    setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
  }, [filteredOptions, isOpen]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={rootId}
      className={cx("nc-multi-select-root", className)}
      style={multiSelectStyle}
      data-open={isOpen || undefined}
      data-placement={placement}
      data-width={width}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-searchable={searchable || undefined}
      data-invalid={invalid || undefined}
      data-required={required || undefined}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasSelection ? "selected" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-multi-select__header">
          {label ? (
            <div className="nc-multi-select__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div className="nc-multi-select__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        {...buttonProps}
        type="button"
        className={cx("nc-multi-select__control", buttonProps?.className)}
        disabled={disabled || buttonProps?.disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${rootId}-dropdown`}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        onClick={(event) => {
          buttonProps?.onClick?.(event);

          if (!event.defaultPrevented && !readOnly) {
            setOpen(!isOpen);
          }
        }}
        {...ncSlot("control")}
      >
        {hasSelection ? (
          <span className="nc-multi-select__values" {...ncSlot("values")}>
            {visibleSelectedOptions.map((option) => (
              <span key={option.value} className="nc-multi-select__tag" data-tone={option.tone ?? tone} {...ncSlot("tag")}>
                {option.icon ? <span className="nc-multi-select__tag-icon" aria-hidden="true">{option.icon}</span> : null}
                <span className="nc-multi-select__tag-label">{option.label}</span>

                {!disabled && !readOnly ? (
                  <button
                    type="button"
                    className="nc-multi-select__tag-remove"
                    aria-label={`${removeLabel}: ${typeof option.label === "string" ? option.label : option.value}`}
                    onClick={(event) => removeValue(event, option)}
                    {...ncSlot("tag-remove")}
                  >
                    {clearIcon}
                  </button>
                ) : null}
              </span>
            ))}

            {hiddenSelectedCount > 0 ? (
              <span className="nc-multi-select__tag" data-overflow {...ncSlot("tag")}>
                +{hiddenSelectedCount}
              </span>
            ) : null}
          </span>
        ) : (
          <span className="nc-multi-select__placeholder" {...ncSlot("placeholder")}>
            {placeholder}
          </span>
        )}

        {clearable && hasSelection && !disabled && !readOnly ? (
          <button
            type="button"
            className="nc-multi-select__clear"
            aria-label={clearLabel}
            onClick={clearSelection}
            {...ncSlot("clear")}
          >
            {clearIcon}
          </button>
        ) : null}

        <span className="nc-multi-select__chevron" aria-hidden="true" {...ncSlot("chevron")}>
          {chevronIcon}
        </span>
      </button>

      {shouldRenderDropdown ? (
        <div
          id={`${rootId}-dropdown`}
          className="nc-multi-select__dropdown"
          role="listbox"
          aria-multiselectable="true"
          aria-label={typeof label === "string" ? label : "Select options"}
          hidden={!isOpen}
          data-border={withBorder || undefined}
          {...ncSlot("dropdown")}
        >
          {searchable ? (
            <input
              ref={searchRef}
              className="nc-multi-select__search"
              value={query}
              placeholder="Search"
              disabled={disabled}
              readOnly={readOnly}
              onChange={handleSearchChange}
              {...ncSlot("search")}
            />
          ) : null}

          {hasOptions ? (
            <div className="nc-multi-select__content" {...ncSlot("content")}>
              {filteredGroups.map((group, groupIndex) => (
                <div key={group.id} className="nc-multi-select__group" data-separated={group.separated || groupIndex > 0 || undefined} data-tone={group.tone ?? tone} {...ncSlot("group")}>
                  {group.separated || groupIndex > 0 ? <div className="nc-multi-select__separator" aria-hidden="true" {...ncSlot("separator")} /> : null}

                  {group.label ? (
                    <div className="nc-multi-select__group-label" {...ncSlot("group-label")}>
                      {group.label}
                    </div>
                  ) : null}

                  {group.options.map((option) => {
                    const optionIndex = filteredOptions.indexOf(option);
                    const selected = selectedValueSet.has(option.value);
                    const active = optionIndex === activeIndex;
                    const optionTone = option.tone ?? group.tone ?? tone;
                    const maxReached = !selected && maxSelectedValues !== undefined && currentValues.length >= maxSelectedValues;
                    const optionDisabled = option.disabled || maxReached;

                    return (
                      <div
                        key={option.value}
                        className="nc-multi-select__option"
                        data-active={active || undefined}
                        data-selected={selected || undefined}
                        data-disabled={optionDisabled || undefined}
                        data-tone={optionTone}
                        {...ncSlot("option")}
                      >
                        <button
                          {...optionButtonProps}
                          id={`${rootId}-option-${optionIndex}`}
                          type="button"
                          className={cx("nc-multi-select__option-button", optionButtonProps?.className)}
                          role="option"
                          aria-selected={selected}
                          disabled={disabled || optionDisabled || optionButtonProps?.disabled}
                          tabIndex={active ? 0 : -1}
                          onMouseEnter={() => setActiveIndex(optionIndex)}
                          onClick={(event) => {
                            optionButtonProps?.onClick?.(event);

                            if (!event.defaultPrevented) {
                              toggleOption(option);
                            }
                          }}
                          {...ncSlot("option-button")}
                        >
                          <span className="nc-multi-select__indicator" aria-hidden="true" {...ncSlot("indicator")}>
                            {selected ? checkIcon : null}
                          </span>

                          {option.icon ? (
                            <span className="nc-multi-select__icon" aria-hidden="true" {...ncSlot("icon")}>
                              {option.icon}
                            </span>
                          ) : null}

                          <span className="nc-multi-select__option-content" {...ncSlot("option-content")}>
                            <span className="nc-multi-select__option-label" {...ncSlot("option-label")}>
                              {option.label}
                            </span>

                            {option.description ? (
                              <span className="nc-multi-select__option-description" {...ncSlot("option-description")}>
                                {option.description}
                              </span>
                            ) : null}
                          </span>

                          {option.badge ? (
                            <span className="nc-multi-select__badge" {...ncSlot("badge")}>
                              {option.badge}
                            </span>
                          ) : null}

                          {option.rightSection ? (
                            <span className="nc-multi-select__right-section" {...ncSlot("right-section")}>
                              {option.rightSection}
                            </span>
                          ) : null}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : children ? (
            children
          ) : (
            <div className="nc-multi-select__empty" {...ncSlot("empty")}>
              {emptyMessage}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
});