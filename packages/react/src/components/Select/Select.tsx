import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SelectGroup, SelectOption, SelectProps, SelectStyle } from "./Select.types";

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

function groupOptions(options: SelectOption[], groups: SelectGroup[]): SelectGroup[] {
  if (groups.length > 0) return groups;
  if (options.length === 0) return [];
  return [{ id: "default", options }];
}

function flattenGroups(groups: SelectGroup[]): SelectOption[] {
  return groups.flatMap((group) => group.options);
}

function optionText(option: SelectOption): string {
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

function findNextEnabledIndex(options: SelectOption[], startIndex: number, direction: 1 | -1): number {
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

export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    options = [],
    groups = [],
    value,
    defaultValue = null,
    onValueChange,
    opened,
    defaultOpened = false,
    onOpenChange,
    label,
    description,
    placeholder = "Select option",
    emptyMessage = "No options found",
    clearLabel = "Clear selected option",
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    searchable = false,
    clearable = false,
    required,
    invalid,
    placement = "bottom",
    width = "full",
    withBorder = true,
    fullWidth = true,
    closeOnSelect = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    keepMounted = false,
    maxDropdownHeight = 240,
    buttonProps,
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
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const currentValue = isValueControlled ? value : internalValue;
  const isOpen = isOpenControlled ? opened : internalOpened;
  const normalizedGroups = useMemo(() => groupOptions(options, groups), [groups, options]);
  const allOptions = useMemo(() => flattenGroups(normalizedGroups), [normalizedGroups]);
  const selectedOption = allOptions.find((option) => option.value === currentValue) ?? null;
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
  const selectStyle: SelectStyle = { ...style };
  const dropdownHeight = toCssValue(maxDropdownHeight);

  if (dropdownHeight !== undefined) {
    selectStyle["--nc-select-max-dropdown-height"] = dropdownHeight;
  }

  function setOpen(nextOpened: boolean): void {
    if (disabled || readOnly) return;

    if (!isOpenControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function selectOption(option: SelectOption | null): void {
    if (disabled || readOnly || option?.disabled) return;

    const nextValue = option?.value ?? null;

    if (!isValueControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue, option);

    if (closeOnSelect) {
      setOpen(false);
    }
  }

  function clearSelection(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    selectOption(null);
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
        selectOption(option);
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

    const selectedIndex = filteredOptions.findIndex((option) => option.value === currentValue);
    const firstEnabled = filteredOptions.findIndex((option) => !option.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabled >= 0 ? firstEnabled : 0);
  }, [currentValue, filteredOptions, isOpen]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={rootId}
      className={cx("nc-select-root", className)}
      style={selectStyle}
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
        state: selectedOption ? "selected" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-select__header">
          {label ? (
            <div className="nc-select__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div className="nc-select__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        {...buttonProps}
        type="button"
        className={cx("nc-select__control", buttonProps?.className)}
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
        {selectedOption ? (
          <span className="nc-select__value" {...ncSlot("value")}>
            {selectedOption.icon ? (
              <span className="nc-select__value-icon" aria-hidden="true">
                {selectedOption.icon}
              </span>
            ) : null}
            {selectedOption.label}
          </span>
        ) : (
          <span className="nc-select__placeholder" {...ncSlot("placeholder")}>
            {placeholder}
          </span>
        )}

        {clearable && selectedOption && !disabled && !readOnly ? (
          <span
            role="button"
            tabIndex={-1}
            className="nc-select__clear"
            aria-label={clearLabel}
            onClick={(event) => clearSelection(event as unknown as MouseEvent<HTMLButtonElement>)}
            {...ncSlot("clear")}
          >
            {clearIcon}
          </span>
        ) : null}

        <span className="nc-select__chevron" aria-hidden="true" {...ncSlot("chevron")}>
          {chevronIcon}
        </span>
      </button>

      {shouldRenderDropdown ? (
        <div
          id={`${rootId}-dropdown`}
          className="nc-select__dropdown"
          role="listbox"
          aria-label={typeof label === "string" ? label : "Select options"}
          hidden={!isOpen}
          data-border={withBorder || undefined}
          {...ncSlot("dropdown")}
        >
          {searchable ? (
            <input
              ref={searchRef}
              className="nc-select__search"
              value={query}
              placeholder="Search"
              disabled={disabled}
              readOnly={readOnly}
              onChange={handleSearchChange}
              {...ncSlot("search")}
            />
          ) : null}

          {hasOptions ? (
            <div className="nc-select__content" {...ncSlot("content")}>
              {filteredGroups.map((group, groupIndex) => (
                <div key={group.id} className="nc-select__group" data-separated={group.separated || groupIndex > 0 || undefined} data-tone={group.tone ?? tone} {...ncSlot("group")}>
                  {group.separated || groupIndex > 0 ? <div className="nc-select__separator" aria-hidden="true" {...ncSlot("separator")} /> : null}

                  {group.label ? (
                    <div className="nc-select__group-label" {...ncSlot("group-label")}>
                      {group.label}
                    </div>
                  ) : null}

                  {group.options.map((option) => {
                    const optionIndex = filteredOptions.indexOf(option);
                    const selected = option.value === currentValue;
                    const active = optionIndex === activeIndex;
                    const optionTone = option.tone ?? group.tone ?? tone;

                    return (
                      <div
                        key={option.value}
                        className="nc-select__option"
                        data-active={active || undefined}
                        data-selected={selected || undefined}
                        data-disabled={option.disabled || undefined}
                        data-tone={optionTone}
                        {...ncSlot("option")}
                      >
                        <button
                          id={`${rootId}-option-${optionIndex}`}
                          type="button"
                          className="nc-select__option-button"
                          role="option"
                          aria-selected={selected}
                          disabled={disabled || option.disabled}
                          tabIndex={active ? 0 : -1}
                          onMouseEnter={() => setActiveIndex(optionIndex)}
                          onClick={() => selectOption(option)}
                          {...ncSlot("option-button")}
                        >
                          <span className="nc-select__indicator" aria-hidden="true" {...ncSlot("indicator")}>
                            {selected ? checkIcon : null}
                          </span>

                          {option.icon ? (
                            <span className="nc-select__icon" aria-hidden="true" {...ncSlot("icon")}>
                              {option.icon}
                            </span>
                          ) : null}

                          <span className="nc-select__option-content" {...ncSlot("option-content")}>
                            <span className="nc-select__option-label" {...ncSlot("option-label")}>
                              {option.label}
                            </span>

                            {option.description ? (
                              <span className="nc-select__option-description" {...ncSlot("option-description")}>
                                {option.description}
                              </span>
                            ) : null}
                          </span>

                          {option.badge ? (
                            <span className="nc-select__badge" {...ncSlot("badge")}>
                              {option.badge}
                            </span>
                          ) : null}

                          {option.rightSection ? (
                            <span className="nc-select__right-section" {...ncSlot("right-section")}>
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
            <div className="nc-select__empty" {...ncSlot("empty")}>
              {emptyMessage}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
});