import { forwardRef, useState } from "react";
import type { MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { AnchorItem, AnchorProps } from "./Anchor.types";

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

function getHref(item: AnchorItem): string {
  return item.href ?? `#${item.id}`;
}

const defaultIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06L7.56 8.5H16a.75.75 0 0 1 0 1.5H7.56l3.47 3.47a.75.75 0 1 1-1.06 1.06l-4.75-4.75a.75.75 0 0 1 0-1.06l4.75-4.75a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
);

export const Anchor = forwardRef<HTMLElement, AnchorProps>(function Anchor(
  props,
  ref
): ReactElement {
  const {
    className,
    items,
    heading,
    description,
    emptyMessage = "No anchors available",
    activeId,
    defaultActiveId = null,
    onActiveIdChange,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    orientation = "vertical",
    sticky = false,
    compact = false,
    withIndicator = true,
    linkTarget,
    ...rest
  } = props;

  const isControlled = activeId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const currentActiveId = isControlled ? activeId : internalActiveId;
  const hasHeader = Boolean(heading || description);
  const hasItems = items.length > 0;

  function selectItem(event: MouseEvent<HTMLAnchorElement>, item: AnchorItem): void {
    if (disabled || item.disabled) {
      event.preventDefault();
      return;
    }

    if (!isControlled) {
      setInternalActiveId(item.id);
    }

    onActiveIdChange?.(item.id, item);
  }

  return (
    <nav
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-anchor-root", className)}
      data-orientation={orientation}
      data-sticky={sticky || undefined}
      data-compact={compact || undefined}
      data-indicator={withIndicator || undefined}
      aria-label={typeof heading === "string" ? heading : "Anchor navigation"}
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
        <div className="nc-anchor__header" {...ncSlot("header")}>
          {heading ? (
            <div className="nc-anchor__heading" {...ncSlot("heading")}>
              {heading}
            </div>
          ) : null}

          {description ? (
            <div className="nc-anchor__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      {hasItems ? (
        <ol className="nc-anchor__list" {...ncSlot("list")}>
          {items.map((item) => {
            const active = item.id === currentActiveId;
            const itemTone = item.tone ?? tone;

            return (
              <li
                key={item.id}
                className="nc-anchor__item"
                data-active={active || undefined}
                data-disabled={item.disabled || undefined}
                data-tone={itemTone}
                {...ncSlot("item")}
              >
                <a
                  {...item.linkProps}
                  className={cx("nc-anchor__link", item.linkProps?.className)}
                  href={getHref(item)}
                  target={item.linkProps?.target ?? linkTarget}
                  aria-current={active ? "location" : undefined}
                  aria-disabled={item.disabled || undefined}
                  onClick={(event) => selectItem(event, item)}
                  {...ncSlot("link")}
                >
                  {withIndicator ? <span className="nc-anchor__indicator" aria-hidden="true" {...ncSlot("indicator")} /> : null}

                  <span className="nc-anchor__icon" aria-hidden="true" {...ncSlot("icon")}>
                    {item.icon ?? defaultIcon}
                  </span>

                  <span className="nc-anchor__content" {...ncSlot("content")}>
                    <span className="nc-anchor__label" {...ncSlot("label")}>
                      {item.label}
                    </span>

                    {item.description ? (
                      <span className="nc-anchor__item-description" {...ncSlot("item-description")}>
                        {item.description}
                      </span>
                    ) : null}
                  </span>

                  {item.badge ? (
                    <span className="nc-anchor__badge" {...ncSlot("badge")}>
                      {item.badge}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="nc-anchor__empty" {...ncSlot("empty")}>
          {emptyMessage}
        </div>
      )}
    </nav>
  );
});