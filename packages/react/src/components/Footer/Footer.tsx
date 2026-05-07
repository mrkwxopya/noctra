import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { FooterLink, FooterProps, FooterSection } from "./Footer.types";

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

function renderLink(link: FooterLink, tone: string): ReactElement {
  const linkTone = link.tone ?? tone;

  return (
    <a
      key={link.id}
      className="nc-footer__link"
      href={link.disabled ? undefined : link.href ?? "#"}
      aria-disabled={link.disabled || undefined}
      data-disabled={link.disabled || undefined}
      data-tone={linkTone}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer" : undefined}
      {...ncSlot("link")}
    >
      {link.icon ? (
        <span className="nc-footer__link-icon" aria-hidden="true" {...ncSlot("link-icon")}>
          {link.icon}
        </span>
      ) : null}

      <span className="nc-footer__link-content" {...ncSlot("link-content")}>
        <span className="nc-footer__link-label" {...ncSlot("link-label")}>
          {link.label}
        </span>

        {link.description ? (
          <span className="nc-footer__link-description" {...ncSlot("link-description")}>
            {link.description}
          </span>
        ) : null}
      </span>
    </a>
  );
}

function renderSection(section: FooterSection, tone: string): ReactElement {
  const sectionTone = section.tone ?? tone;

  return (
    <section key={section.id} className="nc-footer__section" data-tone={sectionTone} {...ncSlot("section")}>
      {section.title ? (
        <div className="nc-footer__section-title" {...ncSlot("section-title")}>
          {section.title}
        </div>
      ) : null}

      {section.description ? (
        <div className="nc-footer__section-description" {...ncSlot("section-description")}>
          {section.description}
        </div>
      ) : null}

      {section.content ? section.content : null}

      {section.links?.length ? (
        <div className="nc-footer__links" {...ncSlot("links")}>
          {section.links.map((link) => renderLink(link, sectionTone))}
        </div>
      ) : null}
    </section>
  );
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    title,
    description,
    logo,
    brand,
    sections = [],
    links = [],
    actions,
    copyright,
    meta,
    variant = "surface",
    size = "md",
    radius = "none",
    tone = "primary",
    density = "default",
    layout = "columns",
    disabled,
    withBorder = true,
    compact = false,
    ...rest
  } = props;

  const hasBrand = Boolean(logo || brand || title || description);
  const hasSections = sections.length > 0;
  const hasLinks = links.length > 0;
  const hasBottom = Boolean(copyright || meta);
  const hasContent = Boolean(children || hasBrand || hasSections || hasLinks || actions || hasBottom);

  return (
    <footer
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-footer-root", className)}
      data-layout={layout}
      data-border={withBorder || undefined}
      data-compact={compact || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasContent ? "filled" : "empty"
      })}
      {...rest}
    >
      <div className="nc-footer__inner" {...ncSlot("inner")}>
        {hasBrand ? (
          <div className="nc-footer__brand" {...ncSlot("brand")}>
            {logo ? (
              <span className="nc-footer__logo" {...ncSlot("logo")}>
                {logo}
              </span>
            ) : null}

            <span className="nc-footer__brand-content" {...ncSlot("brand-content")}>
              {brand ? (
                <span className="nc-footer__title" {...ncSlot("title")}>
                  {brand}
                </span>
              ) : title ? (
                <span className="nc-footer__title" {...ncSlot("title")}>
                  {title}
                </span>
              ) : null}

              {description ? (
                <span className="nc-footer__description" {...ncSlot("description")}>
                  {description}
                </span>
              ) : null}
            </span>
          </div>
        ) : null}

        {children ? <div className="nc-footer__children">{children}</div> : null}

        {hasSections ? (
          <div className="nc-footer__sections" {...ncSlot("sections")}>
            {sections.map((section) => renderSection(section, tone))}
          </div>
        ) : null}

        {hasLinks ? (
          <div className="nc-footer__links" {...ncSlot("links")}>
            {links.map((link) => renderLink(link, tone))}
          </div>
        ) : null}

        {actions ? (
          <div className="nc-footer__actions" {...ncSlot("actions")}>
            {actions}
          </div>
        ) : null}

        {hasBottom ? (
          <div className="nc-footer__bottom" {...ncSlot("bottom")}>
            {copyright ? (
              <div className="nc-footer__copyright" {...ncSlot("copyright")}>
                {copyright}
              </div>
            ) : null}

            {meta ? (
              <div className="nc-footer__meta" {...ncSlot("meta")}>
                {meta}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
});