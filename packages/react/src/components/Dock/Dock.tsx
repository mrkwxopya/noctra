import { forwardRef, useState } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { DockItem, DockProps } from "./Dock.types";

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

const defaultIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 3.25a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const Dock = forwardRef<HTMLDivElement, DockProps>(function Dock(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    items = [],
    activeId,
    defaultActiveId = null,
    onActiveIdChange,
    variant = "surface",
    size = "md",
    radius = "xl",
    tone = "primary",
    density = "default",
    disabled,
    position = "bottom",
    orientation = position === "left" || position === "right" ? "vertical" : "horizontal",
    floating = true,
    withBorder = true,
    withLabels = false,
    withTooltips = true,
    compact = false,
    fullWidth = false,
    ariaLabel = "Dock navigation",
    ...rest
  } = props;

  const isControlled = activeId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const currentActiveId = isControlled ? activeId : internalActiveId;
  const hasItems = items.length > 0;

  function selectItem(item: DockItem): void {
    if (disabled || item.disabled) return;

    if (!isControlled) {
      setInternalActiveId(item.id);
    }

    item.onSelect?.(item);
    onActiveIdChange?.(item.id, item);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-dock-root", className)}
      data-position={position}
      data-orientation={orientation}
      data-floating={floating || undefined}
      data-border={withBorder || undefined}
      data-labels={withLabels || undefined}
      data-tooltips={withTooltips || undefined}
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
        state: hasItems || children ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasItems ? (
        <div className="nc-dock__list" role="toolbar" aria-label={ariaLabel} {...ncSlot("list")}>
          {items.map((item) => {
            const selected = item.active ?? item.id === currentActiveId;
            const itemTone = item.tone ?? tone;
            const tooltip = typeof item.label === "string" ? item.label : undefined;

            return (
              <span
                key={item.id}
                className="nc-dock__item"
                data-active={selected || undefined}
                data-disabled={item.disabled || undefined}
                data-tone={itemTone}
                {...ncSlot("item")}
              >
                <button
                  {...item.buttonProps}
                  type="button"
                  className={cx("nc-dock__button", item.buttonProps?.className)}
                  disabled={disabled || item.disabled}
                  aria-pressed={selected}
                  aria-label={tooltip}
                  title={withTooltips ? tooltip : undefined}
                  onClick={() => selectItem(item)}
                  {...ncSlot("button")}
                >
                  <span className="nc-dock__icon" aria-hidden="true" {...ncSlot("icon")}>
                    {item.icon ?? defaultIcon}
                  </span>

                  {withLabels || item.description || item.badge ? (
                    <span className="nc-dock__content" {...ncSlot("content")}>
                      {withLabels ? (
                        <span className="nc-dock__label" {...ncSlot("label")}>
                          {item.label}
                        </span>
                      ) : null}

                      {item.description ? (
                        <span className="nc-dock__description" {...ncSlot("description")}>
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  ) : null}

                  {item.badge ? (
                    <span className="nc-dock__badge" {...ncSlot("badge")}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        children
      )}
    </div>
  );
});