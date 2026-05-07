import { forwardRef, useMemo, useState } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { PaginationItem, PaginationProps } from "./Pagination.types";

type PageRangeItem = number | "dots";

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
}

function createRange(start: number, end: number): number[] {
  const length = Math.max(end - start + 1, 0);
  return Array.from({ length }, (_, index) => start + index);
}

function getPaginationRange(total: number, page: number, siblings: number, boundaries: number): PageRangeItem[] {
  const totalPageNumbers = siblings * 2 + boundaries * 2 + 3;

  if (totalPageNumbers >= total) {
    return createRange(1, total);
  }

  const leftSibling = Math.max(page - siblings, boundaries + 1);
  const rightSibling = Math.min(page + siblings, total - boundaries);
  const showLeftDots = leftSibling > boundaries + 2;
  const showRightDots = rightSibling < total - boundaries - 1;
  const firstPages = createRange(1, boundaries);
  const lastPages = createRange(total - boundaries + 1, total);

  if (!showLeftDots && showRightDots) {
    const leftRange = createRange(1, boundaries + siblings * 2 + 2);
    return [...leftRange, "dots", ...lastPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = createRange(total - boundaries - siblings * 2 - 1, total);
    return [...firstPages, "dots", ...rightRange];
  }

  return [...firstPages, "dots", ...createRange(leftSibling, rightSibling), "dots", ...lastPages];
}

const previousIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M12.78 4.22a.75.75 0 0 1 0 1.06L8.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);

const nextIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L11.94 10L7.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const firstIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.75 4a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V4.75A.75.75 0 0 1 5.75 4Z" />
    <path fillRule="evenodd" d="M14.78 4.22a.75.75 0 0 1 0 1.06L10.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);

const lastIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M14.25 4a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 1.5 0V4.75a.75.75 0 0 0-.75-.75Z" />
    <path fillRule="evenodd" d="M5.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L9.94 10L5.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  props,
  ref
): ReactElement {
  const {
    className,
    page,
    defaultPage = 1,
    total = 1,
    onPageChange,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    siblings = 1,
    boundaries = 1,
    withEdges = false,
    withControls = true,
    previousLabel = previousIcon,
    nextLabel = nextIcon,
    firstLabel = firstIcon,
    lastLabel = lastIcon,
    dotsLabel = "…",
    shape = "rounded",
    compact = false,
    fullWidth = false,
    withBorder = true,
    ariaLabel = "Pagination",
    getItemAriaLabel,
    renderItem,
    buttonProps,
    ...rest
  } = props;

  const normalizedTotal = Math.max(1, normalizePositiveInteger(total, 1));
  const isControlled = page !== undefined;
  const [internalPage, setInternalPage] = useState(() => clamp(normalizePositiveInteger(defaultPage, 1), 1, normalizedTotal));
  const currentPage = clamp(normalizePositiveInteger(isControlled ? page : internalPage, 1), 1, normalizedTotal);
  const normalizedSiblings = normalizePositiveInteger(siblings, 1);
  const normalizedBoundaries = normalizePositiveInteger(boundaries, 1);

  const range = useMemo(
    () => getPaginationRange(normalizedTotal, currentPage, normalizedSiblings, normalizedBoundaries),
    [currentPage, normalizedBoundaries, normalizedSiblings, normalizedTotal]
  );

  function setPage(nextPage: number): void {
    const next = clamp(nextPage, 1, normalizedTotal);

    if (disabled || next === currentPage) return;

    if (!isControlled) {
      setInternalPage(next);
    }

    onPageChange?.(next);
  }

  function createItem(type: PaginationItem["type"], nextPage: number | null, label: React.ReactNode, itemDisabled = false): PaginationItem {
    const active = type === "page" && nextPage === currentPage;

    return {
      type,
      page: nextPage,
      label,
      active,
      disabled: disabled || itemDisabled,
      tone,
      ariaLabel:
        type === "page" && nextPage !== null
          ? `Go to page ${nextPage}`
          : type === "previous"
            ? "Go to previous page"
            : type === "next"
              ? "Go to next page"
              : type === "first"
                ? "Go to first page"
                : type === "last"
                  ? "Go to last page"
                  : "More pages"
    };
  }

  const items: PaginationItem[] = [
    ...(withEdges ? [createItem("first", 1, firstLabel, currentPage === 1)] : []),
    ...(withControls ? [createItem("previous", currentPage - 1, previousLabel, currentPage === 1)] : []),
    ...range.map((entry): PaginationItem => {
      if (entry === "dots") {
        return createItem("dots", null, dotsLabel, true);
      }

      return createItem("page", entry, entry);
    }),
    ...(withControls ? [createItem("next", currentPage + 1, nextLabel, currentPage === normalizedTotal)] : []),
    ...(withEdges ? [createItem("last", normalizedTotal, lastLabel, currentPage === normalizedTotal)] : [])
  ];

  function renderControl(item: PaginationItem, index: number): ReactElement {
    if (item.type === "dots") {
      return (
        <li key={`pagination-dots-${index}`} className="nc-pagination__item" data-type="dots" {...ncSlot("item")}>
          <span className="nc-pagination__dots" aria-hidden="true" {...ncSlot("dots")}>
            {renderItem ? renderItem(item) : item.label}
          </span>
        </li>
      );
    }

    const label = renderItem ? renderItem(item) : item.label;

    return (
      <li
        key={`pagination-${item.type}-${item.page ?? index}`}
        className="nc-pagination__item"
        data-active={item.active || undefined}
        data-disabled={item.disabled || undefined}
        data-type={item.type}
        data-tone={item.tone}
        {...ncSlot("item")}
      >
        <button
          {...buttonProps}
          type="button"
          className={cx("nc-pagination__button", buttonProps?.className)}
          disabled={item.disabled}
          aria-current={item.active ? "page" : undefined}
          aria-label={getItemAriaLabel?.(item) ?? item.ariaLabel}
          onClick={() => {
            if (item.page !== null) {
              setPage(item.page);
            }
          }}
          {...ncSlot("button")}
        >
          {label}
        </button>
      </li>
    );
  }

  return (
    <nav
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-pagination-root", className)}
      aria-label={ariaLabel}
      data-shape={shape}
      data-border={withBorder || undefined}
      data-compact={compact || undefined}
      data-full-width={fullWidth || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: normalizedTotal > 1 ? "interactive" : "single"
      })}
      {...rest}
    >
      <ol className="nc-pagination__list" {...ncSlot("list")}>
        {items.map((item, index) => renderControl(item, index))}
      </ol>
    </nav>
  );
});