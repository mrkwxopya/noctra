import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { AutocompleteGroup, AutocompleteOption, AutocompleteProps, AutocompleteStyle } from "./Autocomplete.types";

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

function groupOptions(options: AutocompleteOption[], groups: AutocompleteGroup[]): AutocompleteGroup[] {
  if (groups.length > 0) return groups;
  if (options.length === 0) return [];
  return [{ id: "default", options }];
}

function flattenGroups(groups: AutocompleteGroup[]): AutocompleteOption[] {
  return groups.flatMap((group) => group.options);
}

function optionText(option: AutocompleteOption): string {
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

function filterOption(option: AutocompleteOption, query: string, mode: AutocompleteProps["filterMode"]): boolean {
  if (mode === "none") return true;

  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length === 0) return true;

  const text = optionText(option);

  if (mode === "startsWith") {
    return text.startsWith(normalizedQuery);
  }

  return text.includes(normalizedQuery);
}

function findNextEnabledIndex(options: AutocompleteOption[], startIndex: number, direction: 1 | -1): number {
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

export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(function Autocomplete(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    options = [],
    groups = [],
    value,
    defaultValue = "",
    onValueChange,
    opened,
    defaultOpened = false,
    onOpenChange,
    label,
    description,
    placeholder = "Type to search",
    emptyMessage = "No options found",
    clearLabel = "Clear value",
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    clearable = true,
    autoSelectFirstOption = false,
    filterMode = "contains",
    placement = "bottom",
    width = "full",
    withBorder = true,
    fullWidth = true,
    closeOnSelect = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    keepMounted = false,
    maxDropdownHeight = 240,
    inputProps,
    id,
    onKeyDown,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isValueControlled = value !== undefined;
  const isOpenControlled = opened !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentValue = isValueControlled ? value : internalValue;
  const isOpen = isOpenControlled ? opened : internalOpened;
  const normalizedGroups = useMemo(() => groupOptions(options, groups), [groups, options]);
  const allOptions = useMemo(() => flattenGroups(normalizedGroups), [normalizedGroups]);
  const filteredGroups = useMemo(() => {
    return normalizedGroups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) => filterOption(option, currentValue, filterMode))
      }))
      .filter((group) => group.options.length > 0);
  }, [currentValue, filterMode, normalizedGroups]);
  const filteredOptions = useMemo(() => flattenGroups(filteredGroups), [filteredGroups]);
  const selectedOption = allOptions.find((option) => option.value === currentValue) ?? null;
  const shouldRenderDropdown = keepMounted || isOpen;
  const hasHeader = Boolean(label || description);
  const hasOptions = filteredOptions.length > 0;
  const autocompleteStyle: AutocompleteStyle = { ...style };
  const dropdownHeight = toCssValue(maxDropdownHeight);

  if (dropdownHeight !== undefined) {
    autocompleteStyle["--nc-autocomplete-max-dropdown-height"] = dropdownHeight;
  }

  function setOpen(nextOpened: boolean): void {
    if (disabled || readOnly) return;

    if (!isOpenControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function setInputValue(nextValue: string, option: AutocompleteOption | null): void {
    if (disabled || readOnly) return;

    if (!isValueControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue, option);
  }

  function selectOption(option: AutocompleteOption): void {
    if (disabled || readOnly || option.disabled) return;

    setInputValue(option.value, option);

    if (closeOnSelect) {
      setOpen(false);
    }

    inputRef.current?.focus();
  }

  function clearValue(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    setInputValue("", null);
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.currentTarget.value, null);
    setActiveIndex(0);
    setOpen(true);
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

    if (event.key === "Enter") {
      if (!isOpen) return;

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
    if (!isOpen) return;

    const selectedIndex = filteredOptions.findIndex((option) => option.value === currentValue);
    const firstEnabled = filteredOptions.findIndex((option) => !option.disabled);
    const nextIndex = autoSelectFirstOption ? firstEnabled : selectedIndex >= 0 ? selectedIndex : firstEnabled;
    setActiveIndex(nextIndex >= 0 ? nextIndex : 0);
  }, [autoSelectFirstOption, currentValue, filteredOptions, isOpen]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={rootId}
      className={cx("nc-autocomplete-root", className)}
      style={autocompleteStyle}
      data-open={isOpen || undefined}
      data-placement={placement}
      data-width={width}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
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
        state: currentValue ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-autocomplete__header">
          {label ? (
            <div className="nc-autocomplete__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div className="nc-autocomplete__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-autocomplete__control" {...ncSlot("control")}>
        <input
          {...inputProps}
          ref={(node) => {
            inputRef.current = node;
          }}
          className={cx("nc-autocomplete__input", inputProps?.className)}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled || inputProps?.disabled}
          readOnly={readOnly || inputProps?.readOnly}
          required={required || inputProps?.required}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-expanded={isOpen}
          aria-controls={`${rootId}-dropdown`}
          aria-activedescendant={isOpen && filteredOptions[activeIndex] ? `${rootId}-option-${activeIndex}` : undefined}
          role="combobox"
          autoComplete="off"
          onFocus={(event) => {
            inputProps?.onFocus?.(event);
            if (!event.defaultPrevented) {
              setOpen(true);
            }
          }}
          onChange={handleInputChange}
          {...ncSlot("input")}
        />

        {clearable && currentValue && !disabled && !readOnly ? (
          <button type="button" className="nc-autocomplete__clear" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        <button
          type="button"
          className="nc-autocomplete__chevron"
          aria-label={isOpen ? "Close options" : "Open options"}
          disabled={disabled}
          onClick={() => {
            if (!readOnly) setOpen(!isOpen);
          }}
          {...ncSlot("chevron")}
        >
          {chevronIcon}
        </button>
      </div>

      {shouldRenderDropdown ? (
        <div
          id={`${rootId}-dropdown`}
          className="nc-autocomplete__dropdown"
          role="listbox"
          aria-label={typeof label === "string" ? label : "Autocomplete options"}
          hidden={!isOpen}
          data-border={withBorder || undefined}
          {...ncSlot("dropdown")}
        >
          {hasOptions ? (
            <div className="nc-autocomplete__content" {...ncSlot("content")}>
              {filteredGroups.map((group, groupIndex) => (
                <div key={group.id} className="nc-autocomplete__group" data-separated={group.separated || groupIndex > 0 || undefined} data-tone={group.tone ?? tone} {...ncSlot("group")}>
                  {group.separated || groupIndex > 0 ? <div className="nc-autocomplete__separator" aria-hidden="true" {...ncSlot("separator")} /> : null}

                  {group.label ? (
                    <div className="nc-autocomplete__group-label" {...ncSlot("group-label")}>
                      {group.label}
                    </div>
                  ) : null}

                  {group.options.map((option) => {
                    const optionIndex = filteredOptions.indexOf(option);
                    const selected = option.value === selectedOption?.value;
                    const active = optionIndex === activeIndex;
                    const optionTone = option.tone ?? group.tone ?? tone;

                    return (
                      <div
                        key={option.value}
                        className="nc-autocomplete__option"
                        data-active={active || undefined}
                        data-selected={selected || undefined}
                        data-disabled={option.disabled || undefined}
                        data-tone={optionTone}
                        {...ncSlot("option")}
                      >
                        <button
                          id={`${rootId}-option-${optionIndex}`}
                          type="button"
                          className="nc-autocomplete__option-button"
                          role="option"
                          aria-selected={selected}
                          disabled={disabled || option.disabled}
                          tabIndex={-1}
                          onMouseEnter={() => setActiveIndex(optionIndex)}
                          onClick={() => selectOption(option)}
                          {...ncSlot("option-button")}
                        >
                          <span className="nc-autocomplete__indicator" aria-hidden="true" {...ncSlot("indicator")}>
                            {selected ? checkIcon : null}
                          </span>

                          {option.icon ? (
                            <span className="nc-autocomplete__icon" aria-hidden="true" {...ncSlot("icon")}>
                              {option.icon}
                            </span>
                          ) : null}

                          <span className="nc-autocomplete__option-content" {...ncSlot("option-content")}>
                            <span className="nc-autocomplete__option-label" {...ncSlot("option-label")}>
                              {option.label ?? option.value}
                            </span>

                            {option.description ? (
                              <span className="nc-autocomplete__option-description" {...ncSlot("option-description")}>
                                {option.description}
                              </span>
                            ) : null}
                          </span>

                          {option.badge ? (
                            <span className="nc-autocomplete__badge" {...ncSlot("badge")}>
                              {option.badge}
                            </span>
                          ) : null}

                          {option.rightSection ? (
                            <span className="nc-autocomplete__right-section" {...ncSlot("right-section")}>
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
            <div className="nc-autocomplete__empty" {...ncSlot("empty")}>
              {emptyMessage}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
});