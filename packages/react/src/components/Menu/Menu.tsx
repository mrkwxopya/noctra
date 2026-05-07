import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { MenuGroup, MenuItem, MenuProps, MenuStyle } from "./Menu.types";

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

function groupItems(items: MenuItem[], groups: MenuGroup[]): MenuGroup[] {
  if (groups.length > 0) return groups;
  if (items.length === 0) return [];
  return [{ id: "default", items }];
}

function flattenGroups(groups: MenuGroup[]): MenuItem[] {
  return groups.flatMap((group) => group.items).filter((item) => item.type !== "separator");
}

function findNextEnabledIndex(items: MenuItem[], startIndex: number, direction: 1 | -1, loop: boolean): number {
  if (items.length === 0) return -1;

  let cursor = startIndex;

  for (let index = 0; index < items.length; index += 1) {
    cursor = cursor + direction;

    if (cursor < 0) cursor = loop ? items.length - 1 : 0;
    if (cursor >= items.length) cursor = loop ? 0 : items.length - 1;

    const item = items[cursor];

    if (item && !item.disabled) {
      return cursor;
    }
  }

  return -1;
}

const defaultTrigger = (
  <>
    Menu
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  </>
);

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

const radioIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <circle cx="10" cy="10" r="4" />
  </svg>
);

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    triggerContent,
    items = [],
    groups = [],
    label,
    description,
    footer,
    opened,
    defaultOpened = false,
    onOpenChange,
    onItemSelect,
    activeId,
    defaultActiveId = null,
    onActiveIdChange,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    placement = "bottom",
    align = "start",
    trigger = "click",
    width = "sm",
    withArrow = true,
    withBorder = true,
    withShortcuts = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    closeOnSelect = true,
    keepMounted = false,
    offset = 8,
    loop = true,
    triggerButtonProps,
    ariaLabel = "Menu",
    id,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isOpenControlled = opened !== undefined;
  const isActiveControlled = activeId !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const [activeIndex, setActiveIndex] = useState(0);
  const isOpen = isOpenControlled ? opened : internalOpened;
  const currentActiveId = isActiveControlled ? activeId : internalActiveId;
  const normalizedGroups = useMemo(() => groupItems(items, groups), [groups, items]);
  const actionableItems = useMemo(() => flattenGroups(normalizedGroups), [normalizedGroups]);
  const shouldRenderDropdown = keepMounted || isOpen;
  const hasHeader = Boolean(label || description);
  const hasItems = normalizedGroups.some((group) => group.items.length > 0);
  const menuStyle: MenuStyle = { ...style };

  menuStyle["--nc-menu-offset"] = `${offset}px`;

  function setOpen(nextOpened: boolean): void {
    if (disabled || trigger === "manual") return;

    if (!isOpenControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function setOpenFromInternal(nextOpened: boolean): void {
    if (disabled) return;

    if (!isOpenControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function selectItem(item: MenuItem): void {
    if (disabled || item.disabled || item.type === "separator") return;

    if (!isActiveControlled) {
      setInternalActiveId(item.id);
    }

    item.onSelect?.(item);
    onItemSelect?.(item);
    onActiveIdChange?.(item.id, item);

    if (item.closeOnSelect ?? closeOnSelect) {
      setOpenFromInternal(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) return;

    if (closeOnEscape && event.key === "Escape" && isOpen) {
      event.preventDefault();
      setOpenFromInternal(false);
      return;
    }

    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && isOpen) {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = findNextEnabledIndex(actionableItems, activeIndex, direction, loop);

      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-item-${nextIndex}`)?.focus();
      }

      return;
    }

    if (event.key === "Home" && isOpen) {
      event.preventDefault();
      setActiveIndex(0);
      document.getElementById(`${rootId}-item-0`)?.focus();
      return;
    }

    if (event.key === "End" && isOpen) {
      event.preventDefault();
      const lastIndex = Math.max(actionableItems.length - 1, 0);
      setActiveIndex(lastIndex);
      document.getElementById(`${rootId}-item-${lastIndex}`)?.focus();
    }
  }

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    function handlePointerDown(event: PointerEvent): void {
      const root = rootRef.current;

      if (!root || root.contains(event.target as Node)) {
        return;
      }

      setOpenFromInternal(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeOnOutsideClick, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const firstEnabled = actionableItems.findIndex((item) => !item.disabled);
    setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
  }, [actionableItems, isOpen]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={rootId}
      className={cx("nc-menu-root", className)}
      style={menuStyle}
      data-open={isOpen || undefined}
      data-placement={placement}
      data-align={align}
      data-width={width}
      data-arrow={withArrow || undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (trigger === "hover") setOpen(true);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        if (trigger === "hover") setOpen(false);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (trigger === "focus") setOpen(true);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (trigger === "focus" && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: isOpen ? "open" : "closed"
      })}
      {...rest}
    >
      <button
        {...triggerButtonProps}
        type="button"
        className={cx("nc-menu__trigger", triggerButtonProps?.className)}
        disabled={disabled || triggerButtonProps?.disabled}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={`${rootId}-dropdown`}
        onClick={(event) => {
          triggerButtonProps?.onClick?.(event);

          if (!event.defaultPrevented && trigger === "click") {
            setOpen(!isOpen);
          }
        }}
        {...ncSlot("trigger")}
      >
        {triggerContent ?? children ?? defaultTrigger}
      </button>

      {shouldRenderDropdown ? (
        <div
          id={`${rootId}-dropdown`}
          className="nc-menu__dropdown"
          role="menu"
          aria-label={ariaLabel}
          hidden={!isOpen}
          data-border={withBorder || undefined}
          {...ncSlot("dropdown")}
        >
          {withArrow ? <span className="nc-menu__arrow" aria-hidden="true" {...ncSlot("arrow")} /> : null}

          {hasHeader ? (
            <div className="nc-menu__header" {...ncSlot("header")}>
              {label ? (
                <div className="nc-menu__label" {...ncSlot("label")}>
                  {label}
                </div>
              ) : null}

              {description ? (
                <div className="nc-menu__description" {...ncSlot("description")}>
                  {description}
                </div>
              ) : null}
            </div>
          ) : null}

          {hasItems ? (
            <div className="nc-menu__content" {...ncSlot("content")}>
              {normalizedGroups.map((group, groupIndex) => (
                <div key={group.id} className="nc-menu__group" data-separated={group.separated || groupIndex > 0 || undefined} data-tone={group.tone ?? tone} {...ncSlot("group")}>
                  {group.separated || groupIndex > 0 ? <div className="nc-menu__separator" role="separator" {...ncSlot("separator")} /> : null}

                  {group.label ? (
                    <div className="nc-menu__group-label" {...ncSlot("group-label")}>
                      {group.label}
                    </div>
                  ) : null}

                  {group.items.map((item) => {
                    if (item.type === "separator") {
                      return <div key={item.id} className="nc-menu__separator" role="separator" {...ncSlot("separator")} />;
                    }

                    const itemIndex = actionableItems.indexOf(item);
                    const selected = item.active ?? item.id === currentActiveId;
                    const checked = Boolean(item.checked);
                    const itemTone = item.tone ?? group.tone ?? tone;
                    const role = item.type === "checkbox" ? "menuitemcheckbox" : item.type === "radio" ? "menuitemradio" : "menuitem";

                    return (
                      <div
                        key={item.id}
                        className="nc-menu__item"
                        data-active={itemIndex === activeIndex || undefined}
                        data-selected={selected || undefined}
                        data-checked={checked || undefined}
                        data-disabled={item.disabled || undefined}
                        data-danger={item.danger || undefined}
                        data-type={item.type ?? "item"}
                        data-tone={itemTone}
                        {...ncSlot("item")}
                      >
                        <button
                          {...item.buttonProps}
                          id={`${rootId}-item-${itemIndex}`}
                          type="button"
                          className={cx("nc-menu__button", item.buttonProps?.className)}
                          role={role}
                          aria-checked={item.type === "checkbox" || item.type === "radio" ? checked : undefined}
                          disabled={disabled || item.disabled}
                          tabIndex={itemIndex === activeIndex ? 0 : -1}
                          onMouseEnter={() => setActiveIndex(itemIndex)}
                          onClick={(event) => {
                            item.buttonProps?.onClick?.(event);

                            if (!event.defaultPrevented) {
                              selectItem(item);
                            }
                          }}
                          {...ncSlot("button")}
                        >
                          <span className="nc-menu__indicator" aria-hidden="true" {...ncSlot("indicator")}>
                            {item.type === "checkbox" && checked ? checkIcon : item.type === "radio" && checked ? radioIcon : null}
                          </span>

                          {item.icon ? (
                            <span className="nc-menu__icon" aria-hidden="true" {...ncSlot("icon")}>
                              {item.icon}
                            </span>
                          ) : null}

                          <span className="nc-menu__button-content" {...ncSlot("button-content")}>
                            <span className="nc-menu__item-label" {...ncSlot("item-label")}>
                              {item.label}
                            </span>

                            {item.description ? (
                              <span className="nc-menu__item-description" {...ncSlot("item-description")}>
                                {item.description}
                              </span>
                            ) : null}
                          </span>

                          {item.badge ? (
                            <span className="nc-menu__badge" {...ncSlot("badge")}>
                              {item.badge}
                            </span>
                          ) : null}

                          {withShortcuts && item.shortcut ? (
                            <span className="nc-menu__shortcut" {...ncSlot("shortcut")}>
                              {item.shortcut}
                            </span>
                          ) : null}

                          {item.rightSection ? (
                            <span className="nc-menu__right-section" {...ncSlot("right-section")}>
                              {item.rightSection}
                            </span>
                          ) : null}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : null}

          {footer ? (
            <div className="nc-menu__footer" {...ncSlot("footer")}>
              {footer}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});