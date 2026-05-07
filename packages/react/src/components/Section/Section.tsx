import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SectionProps, SectionStyle } from "./Section.types";

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

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    eyebrow,
    title,
    subtitle,
    description,
    header,
    footer,
    actions,
    aside,
    align = "left",
    headerLayout = "stacked",
    padded = true,
    bleed = false,
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

  const sectionStyle: SectionStyle = { ...style };
  const cssWidth = toCssSize(width);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);
  const hasHeading = Boolean(header || eyebrow || title || subtitle || description || actions);

  if (cssWidth !== undefined) {
    sectionStyle["--nc-section-width"] = cssWidth;
  }

  if (cssMinHeight !== undefined) {
    sectionStyle["--nc-section-min-height"] = cssMinHeight;
  }

  if (cssMaxWidth !== undefined) {
    sectionStyle["--nc-section-max-width"] = cssMaxWidth;
  }

  return (
    <section
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-section-root", className)}
      style={sectionStyle}
      data-align={align}
      data-bleed={bleed || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-has-aside={Boolean(aside) || undefined}
      data-header-layout={headerLayout}
      data-padded={padded || undefined}
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
        <div className="nc-section__header" {...ncSlot("header")}>
          <div className="nc-section__heading" {...ncSlot("heading")}>
            {header}

            {eyebrow ? (
              <div className="nc-section__eyebrow" {...ncSlot("eyebrow")}>
                {eyebrow}
              </div>
            ) : null}

            {title ? (
              <div className="nc-section__title" {...ncSlot("title")}>
                {title}
              </div>
            ) : null}

            {subtitle ? (
              <div className="nc-section__subtitle" {...ncSlot("subtitle")}>
                {subtitle}
              </div>
            ) : null}

            {description ? (
              <div className="nc-section__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}
          </div>

          {actions ? (
            <div className="nc-section__actions" {...ncSlot("actions")}>
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-section__layout" {...ncSlot("layout")}>
        <div className="nc-section__content" {...ncSlot("content")}>
          {children}
        </div>

        {aside ? (
          <div className="nc-section__aside" {...ncSlot("aside")}>
            {aside}
          </div>
        ) : null}
      </div>

      {footer ? (
        <div className="nc-section__footer" {...ncSlot("footer")}>
          {footer}
        </div>
      ) : null}
    </section>
  );
});