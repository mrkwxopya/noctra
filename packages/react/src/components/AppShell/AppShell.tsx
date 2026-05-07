import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { AppShellProps } from "./AppShell.types";

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

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    logo,
    brand,
    header,
    navbar,
    aside,
    footer,
    toolbar,
    actions,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    mode = "fluid",
    disabled,
    withBorder = true,
    fixedHeader = true,
    navbarState = navbar ? "expanded" : "hidden",
    asideState = aside ? "expanded" : "hidden",
    ...rest
  } = props;

  const hasTopHeader = Boolean(logo || brand || header || toolbar || actions);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-app-shell-root", className)}
      data-mode={mode}
      data-border={withBorder || undefined}
      data-fixed-header={fixedHeader || undefined}
      data-navbar-state={navbarState}
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
      {hasTopHeader ? (
        <header className="nc-app-shell__header" {...ncSlot("header")}>
          {logo || brand ? (
            <div className="nc-app-shell__brand" {...ncSlot("brand")}>
              {logo ? (
                <span className="nc-app-shell__logo" {...ncSlot("logo")}>
                  {logo}
                </span>
              ) : null}

              {brand ? (
                <span className="nc-app-shell__brand-label" {...ncSlot("brand-label")}>
                  {brand}
                </span>
              ) : null}
            </div>
          ) : null}

          {header ? <div className="nc-app-shell__header-content">{header}</div> : null}

          {toolbar ? (
            <div className="nc-app-shell__toolbar" {...ncSlot("toolbar")}>
              {toolbar}
            </div>
          ) : null}

          {actions ? (
            <div className="nc-app-shell__actions" {...ncSlot("actions")}>
              {actions}
            </div>
          ) : null}
        </header>
      ) : null}

      <div className="nc-app-shell__body" {...ncSlot("body")}>
        {navbar && navbarState !== "hidden" ? (
          <aside className="nc-app-shell__navbar" data-state={navbarState} {...ncSlot("navbar")}>
            {navbar}
          </aside>
        ) : null}

        <main className="nc-app-shell__main" {...ncSlot("main")}>
          {children}
        </main>

        {aside && asideState !== "hidden" ? (
          <aside className="nc-app-shell__aside" data-state={asideState} {...ncSlot("aside")}>
            {aside}
          </aside>
        ) : null}
      </div>

      {footer ? (
        <footer className="nc-app-shell__footer" {...ncSlot("footer")}>
          {footer}
        </footer>
      ) : null}
    </div>
  );
});