import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { PageProps, PageStyle } from "./Page.types";

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

export const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
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
    nav,
    title,
    subtitle,
    description,
    actions,
    layout = "default",
    align = "left",
    padded = true,
    bleed = false,
    stickyHeader = false,
    stickySidebar = false,
    width,
    minHeight,
    maxWidth,
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

  const pageStyle: PageStyle = { ...style };
  const cssWidth = toCssSize(width);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);
  const hasHeading = Boolean(title || subtitle || description || actions || nav || header);

  if (cssWidth !== undefined) {
    pageStyle["--nc-page-width"] = cssWidth;
  }

  if (cssMinHeight !== undefined) {
    pageStyle["--nc-page-min-height"] = cssMinHeight;
  }

  if (cssMaxWidth !== undefined) {
    pageStyle["--nc-page-max-width"] = cssMaxWidth;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-page-root", className)}
      style={pageStyle}
      data-align={align}
      data-bleed={bleed || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-has-aside={Boolean(aside) || undefined}
      data-has-sidebar={Boolean(sidebar) || undefined}
      data-layout={layout}
      data-padded={padded || undefined}
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
        state: children || hasHeading ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeading ? (
        <header className="nc-page__header" {...ncSlot("header")}>
          {nav ? (
            <div className="nc-page__nav" {...ncSlot("nav")}>
              {nav}
            </div>
          ) : null}

          {header}

          {title || subtitle || description || actions ? (
            <div className="nc-page__heading" {...ncSlot("heading")}>
              <div className="nc-page__heading-main">
                {title ? (
                  <div className="nc-page__title" {...ncSlot("title")}>
                    {title}
                  </div>
                ) : null}

                {subtitle ? (
                  <div className="nc-page__subtitle" {...ncSlot("subtitle")}>
                    {subtitle}
                  </div>
                ) : null}

                {description ? (
                  <div className="nc-page__description" {...ncSlot("description")}>
                    {description}
                  </div>
                ) : null}
              </div>

              {actions ? (
                <div className="nc-page__actions" {...ncSlot("actions")}>
                  {actions}
                </div>
              ) : null}
            </div>
          ) : null}
        </header>
      ) : null}

      <div className="nc-page__shell" {...ncSlot("shell")}>
        {sidebar ? (
          <aside className="nc-page__sidebar" {...ncSlot("sidebar")}>
            {sidebar}
          </aside>
        ) : null}

        <main className="nc-page__main" {...ncSlot("main")}>
          <div className="nc-page__content" {...ncSlot("content")}>
            {children}
          </div>
        </main>

        {aside ? (
          <aside className="nc-page__aside" {...ncSlot("aside")}>
            {aside}
          </aside>
        ) : null}
      </div>

      {footer ? (
        <footer className="nc-page__footer" {...ncSlot("footer")}>
          {footer}
        </footer>
      ) : null}
    </div>
  );
});