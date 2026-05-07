import { forwardRef } from "react";
import type { MouseEvent, MutableRefObject, ReactElement, Ref, ReactNode } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { BreadcrumbItem, BreadcrumbProps } from "./Breadcrumb.types";

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

function normalizeMaxItems(value: number | undefined): number | null {
  if (value === undefined || !Number.isFinite(value) || value < 2) return null;
  return Math.floor(value);
}

function getVisibleItems(items: BreadcrumbItem[], maxItems: number | null, mode: BreadcrumbProps["collapseMode"]): Array<BreadcrumbItem | "collapse"> {
  if (!maxItems || items.length <= maxItems) return items;

  if (mode === "start") {
    return ["collapse", ...items.slice(items.length - (maxItems - 1))];
  }

  if (mode === "end") {
    return [...items.slice(0, maxItems - 1), "collapse"];
  }

  const headCount = Math.max(1, Math.ceil((maxItems - 1) / 2));
  const tailCount = Math.max(1, maxItems - headCount - 1);

  return [...items.slice(0, headCount), "collapse", ...items.slice(items.length - tailCount)];
}

function renderSeparator(separator: BreadcrumbProps["separator"]): ReactNode {
  if (separator === "slash") return "/";
  if (separator === "dot") return "•";
  if (separator === "arrow") return "→";

  if (separator === "chevron" || separator === undefined) {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L11.94 10L7.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
      </svg>
    );
  }

  return separator;
}

const homeIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v5a2 2 0 0 1-2 2h-2.5a.5.5 0 0 1-.5-.5v-4a1 1 0 1 0-2 0v4a.5.5 0 0 1-.5.5H6a2 2 0 0 1-2-2v-5H3a1 1 0 0 1-.707-1.707l7-7Z" />
  </svg>
);

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  props,
  ref
): ReactElement {
  const {
    className,
    items,
    separator = "chevron",
    activeId,
    onItemSelect,
    variant = "ghost",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    maxItems,
    collapseMode = "middle",
    collapseLabel = "…",
    withBorder = false,
    withHomeIcon = false,
    fullWidth = true,
    ariaLabel = "Breadcrumb",
    ...rest
  } = props;

  const normalizedMaxItems = normalizeMaxItems(maxItems);
  const visibleItems = getVisibleItems(items, normalizedMaxItems, collapseMode);
  const hasItems = items.length > 0;

  function selectItem(event: MouseEvent<HTMLAnchorElement>, item: BreadcrumbItem, isCurrent: boolean): void {
    if (disabled || item.disabled || isCurrent) {
      event.preventDefault();
      return;
    }

    item.onSelect?.(item);
    onItemSelect?.(item.id, item);
  }

  return (
    <nav
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-breadcrumb-root", className)}
      aria-label={ariaLabel}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
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
      <ol className="nc-breadcrumb__list" {...ncSlot("list")}>
        {visibleItems.map((entry, index) => {
          const isLast = index === visibleItems.length - 1;

          if (entry === "collapse") {
            return (
              <li key={`breadcrumb-collapse-${index}`} className="nc-breadcrumb__item" data-collapse {...ncSlot("item")}>
                <span className="nc-breadcrumb__collapse" aria-label="Collapsed breadcrumb items" {...ncSlot("collapse")}>
                  {collapseLabel}
                </span>

                {!isLast ? (
                  <span className="nc-breadcrumb__separator" aria-hidden="true" {...ncSlot("separator")}>
                    {renderSeparator(separator)}
                  </span>
                ) : null}
              </li>
            );
          }

          const item = entry;
          const current = item.current ?? (activeId !== null && activeId !== undefined ? item.id === activeId : isLast);
          const itemTone = item.tone ?? tone;
          const shouldShowHomeIcon = withHomeIcon && index === 0 && !item.icon;

          return (
            <li
              key={item.id}
              className="nc-breadcrumb__item"
              data-current={current || undefined}
              data-disabled={item.disabled || undefined}
              data-tone={itemTone}
              {...ncSlot("item")}
            >
              <a
                {...item.linkProps}
                className={cx("nc-breadcrumb__link", item.linkProps?.className)}
                href={disabled || item.disabled || current ? undefined : item.href ?? "#"}
                aria-current={current ? "page" : undefined}
                aria-disabled={disabled || item.disabled || undefined}
                onClick={(event) => selectItem(event, item, current)}
                {...ncSlot("link")}
              >
                {item.icon || shouldShowHomeIcon ? (
                  <span className="nc-breadcrumb__icon" aria-hidden="true" {...ncSlot("icon")}>
                    {item.icon ?? homeIcon}
                  </span>
                ) : null}

                <span className="nc-breadcrumb__label" {...ncSlot("label")}>
                  {item.label}
                </span>

                {item.description ? (
                  <span className="nc-breadcrumb__description" {...ncSlot("description")}>
                    {item.description}
                  </span>
                ) : null}
              </a>

              {!isLast ? (
                <span className="nc-breadcrumb__separator" aria-hidden="true" {...ncSlot("separator")}>
                  {renderSeparator(separator)}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});