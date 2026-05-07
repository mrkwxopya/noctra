import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CommandBarAction, CommandBarProps } from "./CommandBar.types";

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

function actionSearchText(action: CommandBarAction): string {
  return [
    action.id,
    action.section,
    typeof action.label === "string" ? action.label : "",
    typeof action.description === "string" ? action.description : "",
    ...(action.keywords ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function groupActions(actions: CommandBarAction[]): Array<{ section: string; actions: CommandBarAction[] }> {
  const groups = new Map<string, CommandBarAction[]>();

  for (const action of actions) {
    const section = action.section ?? "";

    if (!groups.has(section)) {
      groups.set(section, []);
    }

    groups.get(section)?.push(action);
  }

  return Array.from(groups.entries()).map(([section, groupedActions]) => ({ section, actions: groupedActions }));
}

function findNextEnabledIndex(actions: CommandBarAction[], startIndex: number, direction: 1 | -1): number {
  if (actions.length === 0) return -1;

  let cursor = startIndex;

  for (let index = 0; index < actions.length; index += 1) {
    cursor = (cursor + direction + actions.length) % actions.length;

    if (!actions[cursor]?.disabled) {
      return cursor;
    }
  }

  return -1;
}

const searchIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.473 9.767l2.63 2.63a.75.75 0 1 0 1.06-1.06l-2.63-2.63A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0a4 4 0 0 1-8 0Z" clipRule="evenodd" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const defaultIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 3.25a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const CommandBar = forwardRef<HTMLDivElement, CommandBarProps>(function CommandBar(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    actions = [],
    value,
    defaultValue = "",
    onValueChange,
    activeId,
    defaultActiveId = null,
    onActiveIdChange,
    onActionSelect,
    label,
    description,
    placeholder = "Search commands",
    emptyMessage = "No commands found",
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    placement = "inline",
    selectionMode = "single",
    searchable = true,
    clearable = true,
    withBorder = true,
    withShortcuts = true,
    fullWidth = true,
    compact = false,
    autoFocus = false,
    ariaLabel = "Command bar",
    id,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const valueControlled = value !== undefined;
  const activeControlled = activeId !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentValue = valueControlled ? value : internalValue;
  const currentActiveId = activeControlled ? activeId : internalActiveId;

  const filteredActions = useMemo(() => {
    const normalized = currentValue.trim().toLowerCase();

    if (!searchable || !normalized) {
      return actions;
    }

    return actions.filter((action) => actionSearchText(action).includes(normalized));
  }, [actions, currentValue, searchable]);

  const groupedActions = useMemo(() => groupActions(filteredActions), [filteredActions]);
  const hasHeader = Boolean(label || description);
  const hasValue = currentValue.length > 0;
  const hasActions = filteredActions.length > 0;

  function setSearchValue(nextValue: string): void {
    if (!valueControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function selectAction(action: CommandBarAction): void {
    if (disabled || action.disabled) return;

    if (selectionMode === "single") {
      if (!activeControlled) {
        setInternalActiveId(action.id);
      }

      onActiveIdChange?.(action.id, action);
    }

    action.onSelect?.(action);
    onActionSelect?.(action);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setSearchValue(event.currentTarget.value);
    setActiveIndex(0);
  }

  function handleClear(): void {
    setSearchValue("");
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(filteredActions, activeIndex, 1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-command-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(filteredActions, activeIndex, -1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-command-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(filteredActions.length - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      const action = filteredActions[activeIndex];

      if (action) {
        event.preventDefault();
        selectAction(action);
      }
    }
  }

  useEffect(() => {
    const firstEnabled = filteredActions.findIndex((action) => !action.disabled);
    setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
  }, [filteredActions]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-command-bar-root", className)}
      data-placement={placement}
      data-border={withBorder || undefined}
      data-shortcuts={withShortcuts || undefined}
      data-compact={compact || undefined}
      data-full-width={fullWidth || undefined}
      data-searchable={searchable || undefined}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasActions || children ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-command-bar__header" {...ncSlot("header")}>
          {label ? (
            <div className="nc-command-bar__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div className="nc-command-bar__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      {searchable ? (
        <div className="nc-command-bar__control" {...ncSlot("control")}>
          <span className="nc-command-bar__search-icon" aria-hidden="true" {...ncSlot("search-icon")}>
            {searchIcon}
          </span>

          <input
            ref={inputRef}
            className="nc-command-bar__input"
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            role="combobox"
            aria-label={ariaLabel}
            aria-expanded="true"
            aria-controls={`${rootId}-actions`}
            aria-activedescendant={filteredActions[activeIndex] ? `${rootId}-command-${activeIndex}` : undefined}
            onChange={handleInputChange}
            {...ncSlot("input")}
          />

          {clearable && hasValue && !disabled && !readOnly ? (
            <button type="button" className="nc-command-bar__clear-button" aria-label="Clear command search" onClick={handleClear} {...ncSlot("clear-button")}>
              {clearIcon}
            </button>
          ) : null}
        </div>
      ) : null}

      {hasActions ? (
        <div id={`${rootId}-actions`} className="nc-command-bar__actions" role="listbox" aria-label={ariaLabel} {...ncSlot("actions")}>
          {groupedActions.map(({ section, actions: sectionActions }) => (
            <div key={section || "default"} className="nc-command-bar__section" role="group" aria-label={section || undefined} {...ncSlot("section")}>
              {section ? (
                <div className="nc-command-bar__section-title" {...ncSlot("section-title")}>
                  {section}
                </div>
              ) : null}

              {sectionActions.map((action) => {
                const actionIndex = filteredActions.indexOf(action);
                const selected = action.active ?? action.id === currentActiveId;
                const active = actionIndex === activeIndex;
                const actionTone = action.tone ?? tone;

                return (
                  <span
                    key={action.id}
                    className="nc-command-bar__item"
                    data-active={active || undefined}
                    data-selected={selected || undefined}
                    data-disabled={action.disabled || undefined}
                    data-danger={action.danger || undefined}
                    data-tone={actionTone}
                    {...ncSlot("item")}
                  >
                    <button
                      {...action.buttonProps}
                      id={`${rootId}-command-${actionIndex}`}
                      type="button"
                      className={cx("nc-command-bar__button", action.buttonProps?.className)}
                      role="option"
                      aria-selected={selected}
                      disabled={disabled || action.disabled}
                      onMouseEnter={() => setActiveIndex(actionIndex)}
                      onClick={() => selectAction(action)}
                      {...ncSlot("button")}
                    >
                      <span className="nc-command-bar__icon" aria-hidden="true" {...ncSlot("icon")}>
                        {action.icon ?? defaultIcon}
                      </span>

                      <span className="nc-command-bar__content" {...ncSlot("content")}>
                        <span className="nc-command-bar__item-label" {...ncSlot("item-label")}>
                          {action.label}
                        </span>

                        {action.description ? (
                          <span className="nc-command-bar__item-description" {...ncSlot("item-description")}>
                            {action.description}
                          </span>
                        ) : null}
                      </span>

                      {withShortcuts && action.shortcut ? (
                        <span className="nc-command-bar__shortcut" {...ncSlot("shortcut")}>
                          {action.shortcut}
                        </span>
                      ) : null}
                    </button>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      ) : children ? (
        children
      ) : (
        <div className="nc-command-bar__empty" {...ncSlot("empty")}>
          {emptyMessage}
        </div>
      )}
    </div>
  );
});