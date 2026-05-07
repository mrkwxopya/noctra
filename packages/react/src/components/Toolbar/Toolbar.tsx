import { forwardRef, useState } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ToolbarGroup, ToolbarItem, ToolbarProps } from "./Toolbar.types";

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

function toJustify(value: ToolbarProps["justify"]): string | undefined {
  if (value === "between") return "space-between";
  if (value === "around") return "space-around";
  if (value === "evenly") return "space-evenly";
  return value;
}

const defaultIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 3.25a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    items = [],
    groups = [],
    label,
    description,
    activeId,
    defaultActiveId = null,
    onActiveIdChange,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    orientation = "horizontal",
    align = "center",
    justify = "start",
    withBorder = true,
    withLabels = true,
    withShortcuts = true,
    compact = false,
    fullWidth = true,
    wrap = true,
    ariaLabel = "Toolbar",
    ...rest
  } = props;

  const isControlled = activeId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState<string | null>(defaultActiveId);
  const currentActiveId = isControlled ? activeId : internalActiveId;
  const hasHeader = Boolean(label || description);
  const normalizedGroups: ToolbarGroup[] = groups.length > 0 ? groups : items.length > 0 ? [{ id: "default", items }] : [];
  const hasItems = normalizedGroups.some((group) => group.items.length > 0);

  function selectItem(item: ToolbarItem): void {
    if (disabled || item.disabled) return;

    if (!isControlled) {
      setInternalActiveId(item.id);
    }

    item.onSelect?.(item);
    onActiveIdChange?.(item.id, item);
  }

  function renderItem(item: ToolbarItem, groupTone: ToolbarItem["tone"]): ReactElement {
    const selected = item.active ?? item.id === currentActiveId;
    const itemTone = item.tone ?? groupTone ?? tone;
    const tooltip = typeof item.label === "string" ? item.label : undefined;

    return (
      <span
        key={item.id}
        className="nc-toolbar__item"
        data-active={selected || undefined}
        data-disabled={item.disabled || undefined}
        data-danger={item.danger || undefined}
        data-tone={itemTone}
        {...ncSlot("item")}
      >
        <button
          {...item.buttonProps}
          type="button"
          className={cx("nc-toolbar__button", item.buttonProps?.className)}
          disabled={disabled || item.disabled}
          aria-pressed={selected}
          title={tooltip}
          onClick={() => selectItem(item)}
          {...ncSlot("button")}
        >
          <span className="nc-toolbar__icon" aria-hidden="true" {...ncSlot("icon")}>
            {item.icon ?? defaultIcon}
          </span>

          {withLabels || item.description ? (
            <span className="nc-toolbar__button-content" {...ncSlot("button-content")}>
              {withLabels ? (
                <span className="nc-toolbar__button-label" {...ncSlot("button-label")}>
                  {item.label}
                </span>
              ) : null}

              {item.description ? (
                <span className="nc-toolbar__button-description" {...ncSlot("button-description")}>
                  {item.description}
                </span>
              ) : null}
            </span>
          ) : null}

          {withShortcuts && item.shortcut ? (
            <span className="nc-toolbar__shortcut" {...ncSlot("shortcut")}>
              {item.shortcut}
            </span>
          ) : null}
        </button>
      </span>
    );
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-toolbar-root", className)}
      data-orientation={orientation}
      data-align={align}
      data-justify={toJustify(justify)}
      data-border={withBorder || undefined}
      data-labels={withLabels || undefined}
      data-shortcuts={withShortcuts || undefined}
      data-compact={compact || undefined}
      data-full-width={fullWidth || undefined}
      data-wrap={wrap || undefined}
      role="toolbar"
      aria-label={typeof label === "string" ? label : ariaLabel}
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
      {hasHeader ? (
        <div className="nc-toolbar__header" {...ncSlot("header")}>
          {label ? (
            <div className="nc-toolbar__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div className="nc-toolbar__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-toolbar__content" {...ncSlot("content")}>
        {hasItems ? (
          normalizedGroups.map((group, groupIndex) => (
            <div key={group.id} className="nc-toolbar__group" data-separated={group.separated || groupIndex > 0 || undefined} data-tone={group.tone ?? tone} {...ncSlot("group")}>
              {group.separated || groupIndex > 0 ? <span className="nc-toolbar__separator" aria-hidden="true" {...ncSlot("separator")} /> : null}

              {group.label ? (
                <span className="nc-toolbar__group-label" {...ncSlot("group-label")}>
                  {group.label}
                </span>
              ) : null}

              {group.items.map((item) => renderItem(item, group.tone))}
            </div>
          ))
        ) : (
          children
        )}
      </div>
    </div>
  );
});