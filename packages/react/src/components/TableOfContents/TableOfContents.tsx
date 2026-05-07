import { forwardRef, useState } from "react";
import type { MouseEvent, MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TableOfContentsItem, TableOfContentsProps } from "./TableOfContents.types";

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

function normalizeDepth(depth: number | undefined): number {
  if (!depth || !Number.isFinite(depth)) return 6;
  return Math.min(Math.max(Math.floor(depth), 1), 12);
}

function itemHref(item: TableOfContentsItem): string {
  return item.href ?? "#" + item.id;
}

const chevronIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(function TableOfContents(
  props,
  ref
): ReactElement {
  const {
    className,
    items,
    heading = "On this page",
    description,
    emptyMessage = "No sections available",
    activeId,
    defaultActiveId = null,
    onActiveIdChange,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    sticky = false,
    collapsible = false,
    defaultCollapsed = false,
    showNestedGuides = true,
    maxDepth,
    linkTarget,
    ...rest
  } = props;

  const isControlled = activeId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const currentActiveId = isControlled ? activeId : internalActiveId;
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const normalizedMaxDepth = normalizeDepth(maxDepth);
  const hasHeader = Boolean(heading || description || collapsible);
  const hasItems = items.length > 0;

  function selectItem(event: MouseEvent<HTMLAnchorElement>, item: TableOfContentsItem): void {
    if (disabled || item.disabled) {
      event.preventDefault();
      return;
    }

    if (!isControlled) {
      setInternalActiveId(item.id);
    }

    onActiveIdChange?.(item.id, item);
  }

  function renderItems(tocItems: TableOfContentsItem[], level: number): ReactElement | null {
    if (level > normalizedMaxDepth) return null;

    return (
      <ol className={level === 1 ? "nc-table-of-contents__list" : "nc-table-of-contents__children"} data-level={level} {...ncSlot(level === 1 ? "list" : "children")}>
        {tocItems.map((item) => {
          const active = item.id === currentActiveId;
          const itemTone = item.tone ?? tone;
          const hasChildren = Boolean(item.children?.length);

          return (
            <li
              key={item.id}
              className="nc-table-of-contents__item"
              data-active={active || undefined}
              data-disabled={item.disabled || undefined}
              data-tone={itemTone}
              data-level={level}
              {...ncSlot("item")}
            >
              <a
                {...item.linkProps}
                className={cx("nc-table-of-contents__link", item.linkProps?.className)}
                href={itemHref(item)}
                target={item.linkProps?.target ?? linkTarget}
                aria-current={active ? "location" : undefined}
                aria-disabled={item.disabled || undefined}
                onClick={(event) => selectItem(event, item)}
                {...ncSlot("link")}
              >
                <span className="nc-table-of-contents__label" {...ncSlot("label")}>
                  {item.label}
                </span>

                {item.description ? (
                  <span className="nc-table-of-contents__item-description" {...ncSlot("item-description")}>
                    {item.description}
                  </span>
                ) : null}

                {item.badge ? (
                  <span className="nc-table-of-contents__badge" {...ncSlot("badge")}>
                    {item.badge}
                  </span>
                ) : null}
              </a>

              {hasChildren ? renderItems(item.children ?? [], level + 1) : null}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <nav
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-table-of-contents-root", className)}
      data-sticky={sticky || undefined}
      data-collapsed={collapsed || undefined}
      data-guides={showNestedGuides || undefined}
      aria-label={typeof heading === "string" ? heading : "Table of contents"}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasItems ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-table-of-contents__header" {...ncSlot("header")}>
          <div className="nc-table-of-contents__header-content">
            {heading ? (
              <div className="nc-table-of-contents__heading" {...ncSlot("heading")}>
                {heading}
              </div>
            ) : null}

            {description ? (
              <div className="nc-table-of-contents__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}
          </div>

          {collapsible ? (
            <button
              type="button"
              className="nc-table-of-contents__toggle"
              aria-expanded={!collapsed}
              disabled={disabled}
              onClick={() => setCollapsed((value) => !value)}
              {...ncSlot("toggle")}
            >
              {chevronIcon}
            </button>
          ) : null}
        </div>
      ) : null}

      {!collapsed ? (
        hasItems ? renderItems(items, 1) : (
          <div className="nc-table-of-contents__empty" {...ncSlot("empty")}>
            {emptyMessage}
          </div>
        )
      ) : null}
    </nav>
  );
});