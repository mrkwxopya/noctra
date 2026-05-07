import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type {
  LayoutShellFooterProps,
  LayoutShellHeaderProps,
  LayoutShellMainProps,
  LayoutShellProps,
  LayoutShellSidebarProps
} from "./LayoutShell.types";

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

export const LayoutShell = forwardRef<HTMLDivElement, LayoutShellProps>(function LayoutShell(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    header,
    sidebar,
    aside,
    footer,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    mode = "fluid",
    disabled,
    withBorder = true,
    fixedHeader = false,
    sidebarState = sidebar ? "expanded" : "hidden",
    asideState = aside ? "expanded" : "hidden",
    ...rest
  } = props;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-layout-shell-root", className)}
      data-mode={mode}
      data-border={withBorder || undefined}
      data-fixed-header={fixedHeader || undefined}
      data-sidebar-state={sidebarState}
      data-aside-state={asideState}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: "ready"
      })}
      {...rest}
    >
      {header ? (
        <div className="nc-layout-shell__header-region" {...ncSlot("header")}>
          {header}
        </div>
      ) : null}

      <div className="nc-layout-shell__body" {...ncSlot("body")}>
        {sidebar && sidebarState !== "hidden" ? (
          <div className="nc-layout-shell__sidebar-region" data-state={sidebarState} {...ncSlot("sidebar")}>
            {sidebar}
          </div>
        ) : null}

        <main className="nc-layout-shell__main" {...ncSlot("main")}>
          {children}
        </main>

        {aside && asideState !== "hidden" ? (
          <div className="nc-layout-shell__aside-region" data-state={asideState} {...ncSlot("aside")}>
            {aside}
          </div>
        ) : null}
      </div>

      {footer ? (
        <div className="nc-layout-shell__footer-region" {...ncSlot("footer")}>
          {footer}
        </div>
      ) : null}
    </div>
  );
});

export const LayoutShellHeader = forwardRef<HTMLElement, LayoutShellHeaderProps>(function LayoutShellHeader(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    title,
    actions,
    sticky = false,
    withBorder = true,
    tone = "primary",
    ...rest
  } = props;

  return (
    <header
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-layout-shell-header", className)}
      data-sticky={sticky || undefined}
      data-border={withBorder || undefined}
      data-tone={tone}
      {...ncSlot("header")}
      {...rest}
    >
      <div className="nc-layout-shell-header__content" {...ncSlot("header-content")}>
        {title ? (
          <div className="nc-layout-shell-header__title" {...ncSlot("header-title")}>
            {title}
          </div>
        ) : null}

        {children ? <div className="nc-layout-shell-header__children">{children}</div> : null}
      </div>

      {actions ? (
        <div className="nc-layout-shell-header__actions" {...ncSlot("header-actions")}>
          {actions}
        </div>
      ) : null}
    </header>
  );
});

export const LayoutShellSidebar = forwardRef<HTMLElement, LayoutShellSidebarProps>(function LayoutShellSidebar(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    title,
    footer,
    position = "left",
    state = "expanded",
    withBorder = true,
    tone = "primary",
    ...rest
  } = props;

  return (
    <aside
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-layout-shell-sidebar", className)}
      data-position={position}
      data-state={state}
      data-border={withBorder || undefined}
      data-tone={tone}
      {...ncSlot(position === "right" ? "aside" : "sidebar")}
      {...rest}
    >
      {title ? (
        <div className="nc-layout-shell-sidebar__title" {...ncSlot("sidebar-title")}>
          {title}
        </div>
      ) : null}

      <div className="nc-layout-shell-sidebar__content" {...ncSlot("sidebar-content")}>
        {children}
      </div>

      {footer ? (
        <div className="nc-layout-shell-sidebar__footer" {...ncSlot("sidebar-footer")}>
          {footer}
        </div>
      ) : null}
    </aside>
  );
});

export const LayoutShellMain = forwardRef<HTMLElement, LayoutShellMainProps>(function LayoutShellMain(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    padded = true,
    ...rest
  } = props;

  return (
    <main
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-layout-shell-main", className)}
      data-padded={padded || undefined}
      {...ncSlot("main")}
      {...rest}
    >
      {children}
    </main>
  );
});

export const LayoutShellFooter = forwardRef<HTMLElement, LayoutShellFooterProps>(function LayoutShellFooter(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    withBorder = true,
    tone = "primary",
    ...rest
  } = props;

  return (
    <footer
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-layout-shell-footer", className)}
      data-border={withBorder || undefined}
      data-tone={tone}
      {...ncSlot("footer")}
      {...rest}
    >
      {children}
    </footer>
  );
});