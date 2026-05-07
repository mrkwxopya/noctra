import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { HeaderProps } from "./Header.types";

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

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    logo,
    brand,
    title,
    subtitle,
    navigation,
    toolbar,
    actions,
    startSection,
    endSection,
    variant = "surface",
    size = "md",
    radius = "none",
    tone = "primary",
    density = "default",
    position = "static",
    disabled,
    withBorder = true,
    transparent = false,
    compact = false,
    ...rest
  } = props;

  const hasBrand = Boolean(logo || brand || title || subtitle);
  const hasCenter = Boolean(children || navigation || toolbar);
  const hasEnd = Boolean(actions || endSection);

  return (
    <header
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-header-root", className)}
      data-position={position}
      data-border={withBorder || undefined}
      data-transparent={transparent || undefined}
      data-compact={compact || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasBrand || hasCenter || hasEnd ? "filled" : "empty"
      })}
      {...rest}
    >
      <div className="nc-header__inner" {...ncSlot("inner")}>
        {startSection ? (
          <div className="nc-header__start-section" {...ncSlot("start-section")}>
            {startSection}
          </div>
        ) : null}

        {hasBrand ? (
          <div className="nc-header__brand" {...ncSlot("brand")}>
            {logo ? (
              <span className="nc-header__logo" {...ncSlot("logo")}>
                {logo}
              </span>
            ) : null}

            <span className="nc-header__brand-content" {...ncSlot("brand-content")}>
              {brand ? (
                <span className="nc-header__title" {...ncSlot("title")}>
                  {brand}
                </span>
              ) : title ? (
                <span className="nc-header__title" {...ncSlot("title")}>
                  {title}
                </span>
              ) : null}

              {subtitle ? (
                <span className="nc-header__subtitle" {...ncSlot("subtitle")}>
                  {subtitle}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}

        {navigation ? (
          <nav className="nc-header__navigation" aria-label="Header navigation" {...ncSlot("navigation")}>
            {navigation}
          </nav>
        ) : null}

        {children ? (
          <div className="nc-header__toolbar" {...ncSlot("toolbar")}>
            {children}
          </div>
        ) : toolbar ? (
          <div className="nc-header__toolbar" {...ncSlot("toolbar")}>
            {toolbar}
          </div>
        ) : null}

        {actions ? (
          <div className="nc-header__actions" {...ncSlot("actions")}>
            {actions}
          </div>
        ) : null}

        {endSection ? (
          <div className="nc-header__end-section" {...ncSlot("end-section")}>
            {endSection}
          </div>
        ) : null}
      </div>
    </header>
  );
});