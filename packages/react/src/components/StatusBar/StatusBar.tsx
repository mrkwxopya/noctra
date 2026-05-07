import { forwardRef, useState } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { StatusBarGroup, StatusBarItem, StatusBarProps } from "./StatusBar.types";

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
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16Zm.75-11.75a.75.75 0 0 0-1.5 0v4.25c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5h-2.25v-3.5Z" clipRule="evenodd" />
  </svg>
);

export const StatusBar = forwardRef<HTMLDivElement, StatusBarProps>(function StatusBar(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    items = [],
    groups = [],
    startSection,
    centerSection,
    endSection,
    activeId,
    defaultActiveId = null,
    onActiveIdChange,
    onItemSelect,
    variant = "surface",
    size = "md",
    radius = "none",
    tone = "primary",
    density = "default",
    disabled,
    position = "static",
    placement = "bottom",
    align = "between",
    withBorder = true,
    withValues = true,
    withLabels = true,
    compact = false,
    fullWidth = true,
    wrap = false,
    ariaLabel = "Status bar",
    ...rest
  } = props;

  const isControlled = activeId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const currentActiveId = isControlled ? activeId : internalActiveId;
  const normalizedGroups: StatusBarGroup[] = groups.length > 0 ? groups : items.length > 0 ? [{ id: "default", items }] : [];
  const hasGroups = normalizedGroups.some((group) => group.items.length > 0);
  const hasSections = Boolean(startSection || centerSection || endSection || children);

  function selectItem(item: StatusBarItem): void {
    if (disabled || item.disabled || item.interactive === false) return;

    if (!isControlled) {
      setInternalActiveId(item.id);
    }

    item.onSelect?.(item);
    onItemSelect?.(item);
    onActiveIdChange?.(item.id, item);
  }

  function renderItem(item: StatusBarItem, groupTone: StatusBarItem["tone"]): ReactElement {
    const selected = item.active ?? item.id === currentActiveId;
    const itemTone = item.tone ?? groupTone ?? tone;
    const interactive = item.interactive ?? Boolean(item.onSelect || onItemSelect || onActiveIdChange);
    const tooltip = typeof item.description === "string" ? item.description : typeof item.label === "string" ? item.label : undefined;

    const content = (
      <>
        <span className="nc-status-bar__icon" aria-hidden="true" {...ncSlot("icon")}>
          {item.icon ?? defaultIcon}
        </span>

        {withLabels || item.value || item.description ? (
          <span className="nc-status-bar__content" {...ncSlot("content")}>
            {withLabels ? (
              <span className="nc-status-bar__label" {...ncSlot("label")}>
                {item.label}
              </span>
            ) : null}

            {withValues && item.value ? (
              <span className="nc-status-bar__value" {...ncSlot("value")}>
                {item.value}
              </span>
            ) : null}

            {item.description ? (
              <span className="nc-status-bar__description" {...ncSlot("description")}>
                {item.description}
              </span>
            ) : null}
          </span>
        ) : null}

        {item.badge ? (
          <span className="nc-status-bar__badge" {...ncSlot("badge")}>
            {item.badge}
          </span>
        ) : null}
      </>
    );

    return (
      <span
        key={item.id}
        className="nc-status-bar__item"
        data-active={selected || undefined}
        data-disabled={item.disabled || undefined}
        data-interactive={interactive || undefined}
        data-tone={itemTone}
        {...ncSlot("item")}
      >
        {interactive ? (
          <button
            {...item.buttonProps}
            type="button"
            className={cx("nc-status-bar__button", item.buttonProps?.className)}
            disabled={disabled || item.disabled}
            aria-pressed={selected}
            title={tooltip}
            onClick={() => selectItem(item)}
            {...ncSlot("button")}
          >
            {content}
          </button>
        ) : (
          <span className="nc-status-bar__button" title={tooltip} {...ncSlot("button")}>
            {content}
          </span>
        )}
      </span>
    );
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-status-bar-root", className)}
      role="status"
      aria-label={ariaLabel}
      data-position={position}
      data-placement={placement}
      data-align={align}
      data-border={withBorder || undefined}
      data-values={withValues || undefined}
      data-labels={withLabels || undefined}
      data-compact={compact || undefined}
      data-full-width={fullWidth || undefined}
      data-wrap={wrap || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasGroups || hasSections ? "filled" : "empty"
      })}
      {...rest}
    >
      {startSection ? (
        <div className="nc-status-bar__section nc-status-bar__start-section" {...ncSlot("start-section")}>
          {startSection}
        </div>
      ) : null}

      {hasGroups ? (
        <div className="nc-status-bar__section nc-status-bar__center-section" {...ncSlot("center-section")}>
          {normalizedGroups.map((group, groupIndex) => (
            <span
              key={group.id}
              className="nc-status-bar__group"
              data-separated={group.separated || groupIndex > 0 || undefined}
              data-tone={group.tone ?? tone}
              {...ncSlot("group")}
            >
              {group.separated || groupIndex > 0 ? <span className="nc-status-bar__separator" aria-hidden="true" {...ncSlot("separator")} /> : null}

              {group.label ? (
                <span className="nc-status-bar__group-label" {...ncSlot("group-label")}>
                  {group.label}
                </span>
              ) : null}

              {group.items.map((item) => renderItem(item, group.tone))}
            </span>
          ))}
        </div>
      ) : centerSection ? (
        <div className="nc-status-bar__section nc-status-bar__center-section" {...ncSlot("center-section")}>
          {centerSection}
        </div>
      ) : children ? (
        <div className="nc-status-bar__section nc-status-bar__center-section" {...ncSlot("center-section")}>
          {children}
        </div>
      ) : null}

      {endSection ? (
        <div className="nc-status-bar__section nc-status-bar__end-section" {...ncSlot("end-section")}>
          {endSection}
        </div>
      ) : null}
    </div>
  );
});