import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, ReactNode } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { BreadcrumbsItem, BreadcrumbsProps } from "./Breadcrumbs.types";

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

function getSeparatorIcon(separator: BreadcrumbsProps["separator"], customSeparator: ReactNode): ReactNode {
  if (separator === "custom") return customSeparator;
  if (separator === "dot") return <span aria-hidden="true">•</span>;
  if (separator === "slash") return <span aria-hidden="true">/</span>;

  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  );
}

function collapseItems(items: BreadcrumbsItem[], maxItems?: number): BreadcrumbsItem[] {
  if (maxItems === undefined || maxItems < 3 || items.length <= maxItems) {
    return items;
  }

  const visibleTailCount = maxItems - 2;
  return [
    items[0],
    { value: "__ellipsis", label: "…", disabled: true },
    ...items.slice(items.length - visibleTailCount)
  ].filter(Boolean) as BreadcrumbsItem[];
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  props,
  ref
): ReactElement {
  const {
    className,
    items,
    variant = "plain",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    separator = "chevron",
    customSeparator,
    maxItems,
    ariaLabel = "Breadcrumb",
    ...rest
  } = props;

  const visibleItems = collapseItems(items, maxItems);
  const separatorNode = getSeparatorIcon(separator, customSeparator);

  return (
    <nav
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-breadcrumbs-root", className)}
      aria-label={ariaLabel}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        state: visibleItems.length > 0 ? "filled" : "empty"
      })}
      {...rest}
    >
      <ol className="nc-breadcrumbs__list" {...ncSlot("list")}>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const isCurrent = item.current ?? isLast;
          const isEllipsis = item.value === "__ellipsis";
          const key = item.value ?? `${index}`;

          return (
            <li
              key={key}
              className="nc-breadcrumbs__item"
              data-current={isCurrent || undefined}
              data-disabled={item.disabled || undefined}
              data-ellipsis={isEllipsis || undefined}
              {...ncSlot("item")}
            >
              {isEllipsis ? (
                <span className="nc-breadcrumbs__ellipsis" aria-hidden="true" {...ncSlot("ellipsis")}>
                  {item.label}
                </span>
              ) : item.href && !item.disabled && !isCurrent ? (
                <a
                  {...item.linkProps}
                  className={cx("nc-breadcrumbs__link", item.linkProps?.className)}
                  href={item.href}
                  {...ncSlot("link")}
                >
                  {item.icon ? (
                    <span className="nc-breadcrumbs__icon" aria-hidden="true" {...ncSlot("icon")}>
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="nc-breadcrumbs__label" {...ncSlot("label")}>
                    {item.label}
                  </span>
                </a>
              ) : (
                <span
                  className="nc-breadcrumbs__link"
                  aria-current={isCurrent ? "page" : undefined}
                  aria-disabled={item.disabled || undefined}
                  {...ncSlot("link")}
                >
                  {item.icon ? (
                    <span className="nc-breadcrumbs__icon" aria-hidden="true" {...ncSlot("icon")}>
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="nc-breadcrumbs__label" {...ncSlot("label")}>
                    {item.label}
                  </span>
                </span>
              )}

              {!isLast ? (
                <span className="nc-breadcrumbs__separator" aria-hidden="true" {...ncSlot("separator")}>
                  {separatorNode}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});