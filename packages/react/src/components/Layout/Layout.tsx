import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { LayoutProps, LayoutStyle } from "./Layout.types";

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

function toCssSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(function Layout(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    header,
    footer,
    sidebar,
    aside,
    toolbar,
    mode = "default",
    sidebarPosition = "left",
    stickyHeader = false,
    stickyFooter = false,
    stickySidebar = false,
    collapsibleSidebar = false,
    sidebarCollapsed = false,
    padded = true,
    bleed = false,
    width,
    minHeight,
    maxWidth,
    sidebarWidth,
    asideWidth,
    headerHeight,
    footerHeight,
    variant = "ghost",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const layoutStyle: LayoutStyle = { ...style };
  const cssWidth = toCssSize(width);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);
  const cssSidebarWidth = toCssSize(sidebarWidth);
  const cssAsideWidth = toCssSize(asideWidth);
  const cssHeaderHeight = toCssSize(headerHeight);
  const cssFooterHeight = toCssSize(footerHeight);

  if (cssWidth !== undefined) layoutStyle["--nc-layout-width"] = cssWidth;
  if (cssMinHeight !== undefined) layoutStyle["--nc-layout-min-height"] = cssMinHeight;
  if (cssMaxWidth !== undefined) layoutStyle["--nc-layout-max-width"] = cssMaxWidth;
  if (cssSidebarWidth !== undefined) layoutStyle["--nc-layout-sidebar-width"] = cssSidebarWidth;
  if (cssAsideWidth !== undefined) layoutStyle["--nc-layout-aside-width"] = cssAsideWidth;
  if (cssHeaderHeight !== undefined) layoutStyle["--nc-layout-header-height"] = cssHeaderHeight;
  if (cssFooterHeight !== undefined) layoutStyle["--nc-layout-footer-height"] = cssFooterHeight;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-layout-root", className)}
      style={layoutStyle}
      data-bleed={bleed || undefined}
      data-border={withBorder || undefined}
      data-collapsible-sidebar={collapsibleSidebar || undefined}
      data-full-width={fullWidth || undefined}
      data-has-aside={Boolean(aside) || undefined}
      data-has-sidebar={Boolean(sidebar) || undefined}
      data-mode={mode}
      data-padded={padded || undefined}
      data-sidebar-collapsed={sidebarCollapsed || undefined}
      data-sidebar-position={sidebarPosition}
      data-sticky-footer={stickyFooter || undefined}
      data-sticky-header={stickyHeader || undefined}
      data-sticky-sidebar={stickySidebar || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: children ? "filled" : "empty"
      })}
      {...rest}
    >
      {header ? (
        <header className="nc-layout__header" {...ncSlot("header")}>
          {header}
        </header>
      ) : null}

      {toolbar ? (
        <div className="nc-layout__toolbar" {...ncSlot("toolbar")}>
          {toolbar}
        </div>
      ) : null}

      <div className="nc-layout__shell" {...ncSlot("shell")}>
        {sidebar ? (
          <aside className="nc-layout__sidebar" {...ncSlot("sidebar")}>
            {sidebar}
          </aside>
        ) : null}

        <main className="nc-layout__main" {...ncSlot("main")}>
          <div className="nc-layout__content" {...ncSlot("content")}>
            {children}
          </div>
        </main>

        {aside ? (
          <aside className="nc-layout__aside" {...ncSlot("aside")}>
            {aside}
          </aside>
        ) : null}
      </div>

      {footer ? (
        <footer className="nc-layout__footer" {...ncSlot("footer")}>
          {footer}
        </footer>
      ) : null}
    </div>
  );
});