import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SidebarProps } from "./Sidebar.types";

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

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    title,
    subtitle,
    header,
    footer,
    logo,
    actions,
    variant = "surface",
    size = "md",
    radius = "none",
    tone = "primary",
    density = "default",
    position = "left",
    state = "expanded",
    disabled,
    withBorder = true,
    collapsible = false,
    compact = false,
    scrollable = true,
    ...rest
  } = props;

  const hasHeader = Boolean(header || logo || title || subtitle || actions);

  return (
    <aside
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-sidebar-root", className)}
      data-position={position}
      data-state={state}
      data-border={withBorder || undefined}
      data-collapsible={collapsible || undefined}
      data-compact={compact || undefined}
      data-scrollable={scrollable || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-sidebar__header" {...ncSlot("header")}>
          {header ? (
            header
          ) : (
            <>
              {logo ? (
                <span className="nc-sidebar__logo" {...ncSlot("logo")}>
                  {logo}
                </span>
              ) : null}

              {title || subtitle ? (
                <span className="nc-sidebar__title-group" {...ncSlot("title-group")}>
                  {title ? (
                    <span className="nc-sidebar__title" {...ncSlot("title")}>
                      {title}
                    </span>
                  ) : null}

                  {subtitle ? (
                    <span className="nc-sidebar__subtitle" {...ncSlot("subtitle")}>
                      {subtitle}
                    </span>
                  ) : null}
                </span>
              ) : null}

              {actions ? (
                <span className="nc-sidebar__actions" {...ncSlot("actions")}>
                  {actions}
                </span>
              ) : null}
            </>
          )}
        </div>
      ) : null}

      <div className="nc-sidebar__content" {...ncSlot("content")}>
        {children}
      </div>

      {footer ? (
        <div className="nc-sidebar__footer" {...ncSlot("footer")}>
          {footer}
        </div>
      ) : null}
    </aside>
  );
});