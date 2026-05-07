import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SpotlightAction, SpotlightProps } from "./Spotlight.types";

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

function actionSearchText(action: SpotlightAction): string {
  return [
    action.id,
    action.section,
    typeof action.title === "string" ? action.title : "",
    typeof action.description === "string" ? action.description : "",
    ...(action.keywords ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function groupActions(actions: SpotlightAction[]): Array<{ section: string; actions: SpotlightAction[] }> {
  const groups = new Map<string, SpotlightAction[]>();

  for (const action of actions) {
    const section = action.section ?? "";

    if (!groups.has(section)) {
      groups.set(section, []);
    }

    groups.get(section)?.push(action);
  }

  return Array.from(groups.entries()).map(([section, groupedActions]) => ({ section, actions: groupedActions }));
}

function findNextEnabledIndex(actions: SpotlightAction[], startIndex: number, direction: 1 | -1): number {
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

const closeIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const defaultActionIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 3.25a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const Spotlight = forwardRef<HTMLDivElement, SpotlightProps>(function Spotlight(
  props,
  ref
): ReactElement {
  const {
    className,
    actions,
    opened,
    defaultOpened = false,
    onOpenedChange,
    searchValue,
    defaultSearchValue = "",
    onSearchValueChange,
    onActionSelect,
    title = "Spotlight",
    description,
    placeholder = "Search commands",
    emptyMessage = "No results found",
    closeLabel = "Close spotlight",
    variant = "surface",
    size = "md",
    radius = "xl",
    tone = "primary",
    density = "default",
    placement = "center",
    disabled,
    closeOnSelect = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    withOverlay = true,
    withCloseButton = true,
    id,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const titleId = `${rootId}-title`;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const openedControlled = opened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isOpened = openedControlled ? opened : internalOpened;

  const searchControlled = searchValue !== undefined;
  const [internalSearchValue, setInternalSearchValue] = useState(defaultSearchValue);
  const currentSearchValue = searchControlled ? searchValue : internalSearchValue;
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredActions = useMemo(() => {
    const normalized = currentSearchValue.trim().toLowerCase();

    if (!normalized) {
      return actions;
    }

    return actions.filter((action) => actionSearchText(action).includes(normalized));
  }, [actions, currentSearchValue]);

  const groupedActions = useMemo(() => groupActions(filteredActions), [filteredActions]);

  function setOpened(nextOpened: boolean): void {
    if (disabled && nextOpened) return;

    if (!openedControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenedChange?.(nextOpened);
  }

  function setSearch(nextValue: string): void {
    if (!searchControlled) {
      setInternalSearchValue(nextValue);
    }

    onSearchValueChange?.(nextValue);
  }

  function closeSpotlight(): void {
    setOpened(false);
    setSearch("");
    setActiveIndex(0);
  }

  function selectAction(action: SpotlightAction): void {
    if (disabled || action.disabled) return;

    action.onSelect?.(action);
    onActionSelect?.(action);

    if (closeOnSelect) {
      closeSpotlight();
    }
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    setSearch(event.currentTarget.value);
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) return;

    if (event.key === "Escape" && closeOnEscape) {
      event.preventDefault();
      closeSpotlight();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(filteredActions, activeIndex, 1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-action-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(filteredActions, activeIndex, -1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-action-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
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
    if (!isOpened) return;

    window.requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
  }, [isOpened]);

  useEffect(() => {
    const firstEnabled = filteredActions.findIndex((action) => !action.disabled);
    setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
  }, [filteredActions]);

  if (!isOpened) {
    return (
      <div
        ref={(node) => assignRef(ref, node)}
        id={rootId}
        className={cx("nc-spotlight-root", className)}
        data-opened="false"
        hidden
        {...ncSlot("root")}
        {...ncDataAttributes({
          variant,
          size,
          radius,
          tone,
          density,
          disabled,
          state: "closed"
        })}
        {...rest}
      />
    );
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-spotlight-root", className)}
      data-placement={placement}
      data-opened="true"
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: filteredActions.length > 0 ? "filled" : "empty"
      })}
      {...rest}
    >
      {withOverlay ? (
        <button
          type="button"
          className="nc-spotlight__overlay"
          aria-label={closeLabel}
          onClick={() => {
            if (closeOnOutsideClick) {
              closeSpotlight();
            }
          }}
          {...ncSlot("overlay")}
        />
      ) : null}

      <div
        ref={dialogRef}
        className="nc-spotlight__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onKeyDown={handleKeyDown}
        {...ncSlot("dialog")}
      >
        <div className="nc-spotlight__header" {...ncSlot("header")}>
          <div className="nc-spotlight__header-content">
            {title ? (
              <div id={titleId} className="nc-spotlight__title" {...ncSlot("title")}>
                {title}
              </div>
            ) : null}

            {description ? (
              <div id={descriptionId} className="nc-spotlight__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}
          </div>

          {withCloseButton ? (
            <button type="button" className="nc-spotlight__close-button" aria-label={closeLabel} onClick={closeSpotlight} {...ncSlot("close-button")}>
              {closeIcon}
            </button>
          ) : null}
        </div>

        <div className="nc-spotlight__search-wrap">
          <span className="nc-spotlight__search-icon" aria-hidden="true">
            {searchIcon}
          </span>
          <input
            ref={searchRef}
            className="nc-spotlight__search"
            value={currentSearchValue}
            placeholder={placeholder}
            disabled={disabled}
            role="combobox"
            aria-expanded="true"
            aria-controls={`${rootId}-list`}
            aria-activedescendant={filteredActions[activeIndex] ? `${rootId}-action-${activeIndex}` : undefined}
            onChange={handleSearchChange}
            {...ncSlot("search")}
          />
        </div>

        <div className="nc-spotlight__body" {...ncSlot("body")}>
          {filteredActions.length > 0 ? (
            <div id={`${rootId}-list`} className="nc-spotlight__list" role="listbox" {...ncSlot("list")}>
              {groupedActions.map(({ section, actions: sectionActions }) => (
                <div key={section || "default"} className="nc-spotlight__section" role="group" aria-label={section || undefined} {...ncSlot("section")}>
                  {section ? (
                    <div className="nc-spotlight__section-title" {...ncSlot("section-title")}>
                      {section}
                    </div>
                  ) : null}

                  {sectionActions.map((action) => {
                    const actionIndex = filteredActions.indexOf(action);
                    const active = actionIndex === activeIndex;
                    const actionTone = action.tone ?? tone;

                    return (
                      <button
                        key={action.id}
                        id={`${rootId}-action-${actionIndex}`}
                        type="button"
                        className="nc-spotlight__action"
                        role="option"
                        aria-selected={active}
                        data-active={active || undefined}
                        data-tone={actionTone}
                        disabled={disabled || action.disabled}
                        onMouseEnter={() => setActiveIndex(actionIndex)}
                        onClick={() => selectAction(action)}
                        {...ncSlot("action")}
                      >
                        <span className="nc-spotlight__action-icon" aria-hidden="true" {...ncSlot("action-icon")}>
                          {action.icon ?? defaultActionIcon}
                        </span>

                        <span className="nc-spotlight__action-content" {...ncSlot("action-content")}>
                          <span className="nc-spotlight__action-title" {...ncSlot("action-title")}>
                            {action.title}
                          </span>

                          {action.description ? (
                            <span className="nc-spotlight__action-description" {...ncSlot("action-description")}>
                              {action.description}
                            </span>
                          ) : null}
                        </span>

                        {action.shortcut ? (
                          <span className="nc-spotlight__shortcut" {...ncSlot("shortcut")}>
                            {action.shortcut}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="nc-spotlight__empty" {...ncSlot("empty")}>
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});