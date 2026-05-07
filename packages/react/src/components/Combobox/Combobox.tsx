import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ComboboxOption, ComboboxProps } from "./Combobox.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null): void {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
}

function getSearchText(option: ComboboxOption): string {
  return [
    option.value,
    option.group,
    typeof option.label === "string" ? option.label : "",
    typeof option.description === "string" ? option.description : "",
    ...(option.keywords ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function groupOptions(options: ComboboxOption[]): Array<{ group: string; options: ComboboxOption[] }> {
  const groups = new Map<string, ComboboxOption[]>();

  for (const option of options) {
    const group = option.group ?? "";

    if (!groups.has(group)) {
      groups.set(group, []);
    }

    groups.get(group)?.push(option);
  }

  return Array.from(groups.entries()).map(([group, groupedOptions]) => ({ group, options: groupedOptions }));
}

function findNextEnabledIndex(options: ComboboxOption[], startIndex: number, direction: 1 | -1): number {
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

function optionLabelToString(option: ComboboxOption | null | undefined): string {
  if (!option) return "";
  return typeof option.label === "string" ? option.label : option.value;
}

const chevronIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.313a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.08l6.54-6.596a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  props,
  ref
): ReactElement {
  const {
    className,
    options,
    value,
    defaultValue = null,
    onValueChange,
    searchValue,
    defaultSearchValue = "",
    onSearchValueChange,
    label,
    description,
    error,
    placeholder = "Select option",
    emptyMessage = "No options found",
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    placement = "bottom-start",
    disabled,
    readOnly,
    required,
    invalid,
    searchable = true,
    clearable = true,
    closeOnSelect = true,
    openLabel = "Open options",
    clearLabel = "Clear selection",
    id,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const comboboxId = id ?? generatedId;
  const labelId = label ? `${comboboxId}-label` : undefined;
  const descriptionId = description ? `${comboboxId}-description` : undefined;
  const errorId = error ? `${comboboxId}-error` : undefined;
  const inputId = `${comboboxId}-input`;
  const listId = `${comboboxId}-list`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const valueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const currentValue = valueControlled ? value : internalValue;
  const selectedOption = options.find((option) => option.value === currentValue) ?? null;

  const searchControlled = searchValue !== undefined;
  const [internalSearchValue, setInternalSearchValue] = useState(defaultSearchValue);
  const currentSearchValue = searchControlled ? searchValue : internalSearchValue;

  const [opened, setOpened] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isInvalid = invalid || Boolean(error);

  const shownInputValue = opened && searchable ? currentSearchValue : optionLabelToString(selectedOption);

  const filteredOptions = useMemo(() => {
    const normalized = currentSearchValue.trim().toLowerCase();

    if (!searchable || !normalized) {
      return options;
    }

    return options.filter((option) => getSearchText(option).includes(normalized));
  }, [currentSearchValue, options, searchable]);

  const groupedOptions = useMemo(() => groupOptions(filteredOptions), [filteredOptions]);

  function setSearch(nextValue: string): void {
    if (!searchControlled) {
      setInternalSearchValue(nextValue);
    }

    onSearchValueChange?.(nextValue);
  }

  function openCombobox(): void {
    if (disabled || readOnly) return;
    setOpened(true);
    setSearch("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeCombobox(): void {
    setOpened(false);
    setSearch("");
  }

  function commitValue(nextValue: string | null, option: ComboboxOption | null): void {
    if (disabled || readOnly) return;

    if (!valueControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue, option);
  }

  function selectOption(option: ComboboxOption): void {
    if (disabled || readOnly || option.disabled) return;

    commitValue(option.value, option);

    if (closeOnSelect) {
      closeCombobox();
    }

    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function clearValue(): void {
    commitValue(null, null);
    setSearch("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    if (!opened) {
      setOpened(true);
    }

    setSearch(event.currentTarget.value);
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    if (!opened && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openCombobox();
      return;
    }

    if (!opened) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeCombobox();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(filteredOptions, activeIndex, 1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${comboboxId}-option-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(filteredOptions, activeIndex, -1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${comboboxId}-option-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    if (event.key === "Enter") {
      const option = filteredOptions[activeIndex];

      if (option) {
        event.preventDefault();
        selectOption(option);
      }
    }
  }

  useEffect(() => {
    const firstEnabled = filteredOptions.findIndex((option) => !option.disabled);
    setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
  }, [filteredOptions]);

  useEffect(() => {
    if (!opened) return;

    function handleDocumentPointerDown(event: PointerEvent): void {
      if (!rootRef.current?.contains(event.target as Node | null)) {
        closeCombobox();
      }
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    return () => document.removeEventListener("pointerdown", handleDocumentPointerDown);
  }, [opened]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={comboboxId}
      className={cx("nc-combobox-root", className)}
      data-placement={placement}
      data-readonly={readOnly || undefined}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        invalid: isInvalid,
        expanded: opened,
        state: currentValue ? "filled" : "empty"
      })}
      {...rest}
    >
      {label ? (
        <label id={labelId} className="nc-combobox__label" htmlFor={inputId} {...ncSlot("label")}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-combobox__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div className="nc-combobox__control" {...ncSlot("control")}>
        <input
          ref={inputRef}
          id={inputId}
          className="nc-combobox__input"
          value={shownInputValue}
          placeholder={placeholder}
          readOnly={!searchable || readOnly}
          disabled={disabled}
          required={required}
          role="combobox"
          aria-autocomplete={searchable ? "list" : "none"}
          aria-expanded={opened}
          aria-controls={opened ? listId : undefined}
          aria-activedescendant={opened && filteredOptions[activeIndex] ? `${comboboxId}-option-${activeIndex}` : undefined}
          aria-invalid={isInvalid || undefined}
          aria-labelledby={labelId}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          onClick={openCombobox}
          onChange={handleSearchChange}
          {...ncSlot("input")}
        />

        {clearable && currentValue && !disabled && !readOnly ? (
          <button type="button" className="nc-combobox__clear-button" aria-label={clearLabel} onClick={clearValue} {...ncSlot("clear-button")}>
            {clearIcon}
          </button>
        ) : null}

        <button
          type="button"
          className="nc-combobox__toggle-button"
          aria-label={openLabel}
          aria-haspopup="listbox"
          aria-expanded={opened}
          disabled={disabled || readOnly}
          onClick={() => {
            if (opened) {
              closeCombobox();
            } else {
              openCombobox();
            }
          }}
          {...ncSlot("toggle-button")}
        >
          {chevronIcon}
        </button>
      </div>

      {opened ? (
        <div className="nc-combobox__dropdown" {...ncSlot("dropdown")}>
          {filteredOptions.length > 0 ? (
            <div id={listId} className="nc-combobox__list" role="listbox" {...ncSlot("list")}>
              {groupedOptions.map(({ group, options: groupOptionsList }) => (
                <div key={group || "default"} className="nc-combobox__group" role="group" aria-label={group || undefined} {...ncSlot("group")}>
                  {group ? (
                    <div className="nc-combobox__group-label" {...ncSlot("group-label")}>
                      {group}
                    </div>
                  ) : null}

                  {groupOptionsList.map((option) => {
                    const optionIndex = filteredOptions.indexOf(option);
                    const selected = option.value === currentValue;
                    const active = optionIndex === activeIndex;
                    const optionTone = option.tone ?? tone;

                    return (
                      <button
                        key={option.value}
                        id={`${comboboxId}-option-${optionIndex}`}
                        type="button"
                        className="nc-combobox__option"
                        role="option"
                        aria-selected={selected}
                        data-active={active || undefined}
                        data-selected={selected || undefined}
                        data-tone={optionTone}
                        disabled={option.disabled}
                        onMouseEnter={() => setActiveIndex(optionIndex)}
                        onClick={() => selectOption(option)}
                        {...ncSlot("option")}
                      >
                        <span className="nc-combobox__option-icon" aria-hidden="true" {...ncSlot("option-icon")}>
                          {selected ? checkIcon : option.icon}
                        </span>

                        <span className="nc-combobox__option-content" {...ncSlot("option-content")}>
                          <span className="nc-combobox__option-label" {...ncSlot("option-label")}>
                            {option.label}
                          </span>

                          {option.description ? (
                            <span className="nc-combobox__option-description" {...ncSlot("option-description")}>
                              {option.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="nc-combobox__empty" {...ncSlot("empty")}>
              {emptyMessage}
            </div>
          )}
        </div>
      ) : null}

      {error ? (
        <div id={errorId} className="nc-combobox__error" role="alert" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});