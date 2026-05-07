import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject, ReactElement, ReactNode } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CommandItem, CommandProps } from "./Command.types";

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

function isSelectable(item: CommandItem): boolean {
  return (item.kind ?? "item") === "item" && !item.disabled;
}

function getSearchText(item: CommandItem): string {
  return [item.value, typeof item.label === "string" ? item.label : "", item.description, item.group, ...(item.keywords ?? [])]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

function findNextIndex(items: CommandItem[], startIndex: number, direction: 1 | -1): number {
  if (items.length === 0) return -1;

  let cursor = startIndex;

  for (let step = 0; step < items.length; step += 1) {
    cursor = (cursor + direction + items.length) % items.length;

    if (isSelectable(items[cursor] as CommandItem)) {
      return cursor;
    }
  }

  return -1;
}

function renderGroups(items: CommandItem[]): Array<{ group: string; items: CommandItem[] }> {
  const groups = new Map<string, CommandItem[]>();

  for (const item of items) {
    const group = item.group ?? "";

    if (!groups.has(group)) {
      groups.set(group, []);
    }

    groups.get(group)?.push(item);
  }

  return Array.from(groups.entries()).map(([group, groupedItems]) => ({ group, items: groupedItems }));
}

const searchIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.473 9.765l3.131 3.131a.75.75 0 1 0 1.06-1.06l-3.13-3.132A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0A4 4 0 0 1 5 9Z" clipRule="evenodd" />
  </svg>
);

export const Command = forwardRef<HTMLDivElement, CommandProps>(function Command(
  props,
  ref
): ReactElement {
  const {
    className,
    items,
    trigger,
    heading = "Command",
    placeholder = "Type a command or search",
    emptyMessage = "No commands found",
    opened,
    defaultOpened = false,
    onOpenChange,
    onItemSelect,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    placement = "center",
    disabled,
    closeOnEscape = true,
    closeOnSelect = true,
    triggerLabel = "Open command menu",
    searchLabel = "Search commands",
    id,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const commandId = id ?? generatedId;
  const triggerId = `${commandId}-trigger`;
  const dialogId = `${commandId}-dialog`;
  const headingId = `${commandId}-heading`;
  const searchId = `${commandId}-search`;
  const isControlled = opened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const [query, setQuery] = useState("");
  const isOpen = isControlled ? opened : internalOpened;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(() => items.findIndex(isSelectable));

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const kind = item.kind ?? "item";

      if (kind !== "item") {
        return false;
      }

      return getSearchText(item).includes(normalizedQuery);
    });
  }, [items, query]);

  const groupedItems = useMemo(() => renderGroups(filteredItems), [filteredItems]);

  function setOpen(nextOpened: boolean): void {
    if (disabled) return;

    if (!isControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function openCommand(): void {
    setOpen(true);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeCommand(): void {
    setOpen(false);
    setQuery("");
    document.getElementById(triggerId)?.focus();
  }

  function selectItem(item: CommandItem): void {
    if (disabled || !isSelectable(item)) return;

    onItemSelect?.(item);

    if (closeOnSelect) {
      closeCommand();
    }
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.currentTarget.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) return;

    if (!isOpen && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openCommand();
      return;
    }

    if (!isOpen) return;

    if (event.key === "Escape" && closeOnEscape) {
      event.preventDefault();
      closeCommand();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = findNextIndex(filteredItems, activeIndex, 1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${commandId}-item-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = findNextIndex(filteredItems, activeIndex, -1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${commandId}-item-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    if (event.key === "Enter") {
      const item = filteredItems[activeIndex];

      if (item && isSelectable(item)) {
        event.preventDefault();
        selectItem(item);
      }
    }
  }

  useEffect(() => {
    const firstIndex = filteredItems.findIndex(isSelectable);
    setActiveIndex(firstIndex);
  }, [filteredItems]);

  useEffect(() => {
    if (!isOpen) return;

    function handleDocumentKeyDown(event: globalThis.KeyboardEvent): void {
      const isMacCommand = event.metaKey && event.key.toLowerCase() === "k";
      const isCtrlCommand = event.ctrlKey && event.key.toLowerCase() === "k";

      if (isMacCommand || isCtrlCommand) {
        event.preventDefault();
        closeCommand();
      }
    }

    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => document.removeEventListener("keydown", handleDocumentKeyDown);
  }, [isOpen]);

  useEffect(() => {
    function handleGlobalShortcut(event: globalThis.KeyboardEvent): void {
      const isMacCommand = event.metaKey && event.key.toLowerCase() === "k";
      const isCtrlCommand = event.ctrlKey && event.key.toLowerCase() === "k";

      if (!disabled && (isMacCommand || isCtrlCommand)) {
        event.preventDefault();
        setOpen(!isOpen);
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }
    }

    document.addEventListener("keydown", handleGlobalShortcut);
    return () => document.removeEventListener("keydown", handleGlobalShortcut);
  }, [disabled, isOpen]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={commandId}
      className={cx("nc-command-root", className)}
      data-placement={placement}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        expanded: isOpen,
        state: isOpen ? "open" : "closed"
      })}
      {...rest}
    >
      {trigger ? (
        <button
          id={triggerId}
          type="button"
          className="nc-command__trigger"
          aria-label={typeof trigger === "string" ? undefined : triggerLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dialogId : undefined}
          disabled={disabled}
          onClick={openCommand}
          {...ncSlot("trigger")}
        >
          {trigger}
        </button>
      ) : null}

      {isOpen ? (
        <>
          <button type="button" className="nc-command__overlay" aria-label="Close command menu" onClick={closeCommand} {...ncSlot("overlay")} />

          <div id={dialogId} className="nc-command__dialog" role="dialog" aria-labelledby={headingId} {...ncSlot("dialog")}>
            <div className="nc-command__header" {...ncSlot("header")}>
              <div id={headingId} className="nc-command__heading" {...ncSlot("heading")}>
                {heading}
              </div>

              <label className="nc-command__search-wrap" htmlFor={searchId}>
                <span className="nc-command__search-icon" aria-hidden="true">
                  {searchIcon}
                </span>
                <input
                  ref={inputRef}
                  id={searchId}
                  className="nc-command__search"
                  value={query}
                  placeholder={placeholder}
                  aria-label={searchLabel}
                  onChange={handleSearchChange}
                  {...ncSlot("search")}
                />
              </label>
            </div>

            <div className="nc-command__list" role="listbox" aria-activedescendant={activeIndex >= 0 ? `${commandId}-item-${activeIndex}` : undefined} {...ncSlot("list")}>
              {filteredItems.length > 0 ? (
                groupedItems.map(({ group, items: groupItems }) => (
                  <div key={group || "default"} className="nc-command__group" role="group" aria-label={group || undefined} {...ncSlot("group")}>
                    {group ? (
                      <div className="nc-command__group-label" {...ncSlot("group-label")}>
                        {group}
                      </div>
                    ) : null}

                    {groupItems.map((item) => {
                      const itemIndex = filteredItems.indexOf(item);
                      const kind = item.kind ?? "item";

                      if (kind === "separator") {
                        return <div key={item.value} className="nc-command__separator" role="separator" {...ncSlot("separator")} />;
                      }

                      if (kind === "label") {
                        return (
                          <div key={item.value} className="nc-command__group-label" {...ncSlot("group-label")}>
                            {item.label}
                          </div>
                        );
                      }

                      const active = itemIndex === activeIndex;

                      return (
                        <button
                          key={item.value}
                          id={`${commandId}-item-${itemIndex}`}
                          type="button"
                          className="nc-command__item"
                          role="option"
                          aria-selected={active}
                          disabled={item.disabled}
                          data-active={active || undefined}
                          data-danger={item.danger || undefined}
                          onMouseEnter={() => setActiveIndex(itemIndex)}
                          onClick={() => selectItem(item)}
                          {...ncSlot("item")}
                        >
                          {item.icon ? (
                            <span className="nc-command__item-icon" aria-hidden="true" {...ncSlot("item-icon")}>
                              {item.icon}
                            </span>
                          ) : null}

                          <span className="nc-command__item-content" {...ncSlot("item-content")}>
                            <span className="nc-command__item-label" {...ncSlot("item-label")}>
                              {item.label}
                            </span>

                            {item.description ? (
                              <span className="nc-command__item-description" {...ncSlot("item-description")}>
                                {item.description}
                              </span>
                            ) : null}
                          </span>

                          {item.shortcut ? (
                            <span className="nc-command__item-shortcut" {...ncSlot("item-shortcut")}>
                              {item.shortcut}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="nc-command__empty" {...ncSlot("empty")}>
                  {emptyMessage as ReactNode}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
});