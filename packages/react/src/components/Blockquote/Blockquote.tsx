import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { BlockquoteProps } from "./Blockquote.types";

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

const defaultQuoteIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7.75 5.5A4.75 4.75 0 0 0 3 10.25v7A1.25 1.25 0 0 0 4.25 18.5h5A1.25 1.25 0 0 0 10.5 17.25v-5A1.25 1.25 0 0 0 9.25 11h-3A1.25 1.25 0 0 1 5 9.75A2.75 2.75 0 0 1 7.75 7h.75a.75.75 0 0 0 0-1.5h-.75Zm9 0A4.75 4.75 0 0 0 12 10.25v7a1.25 1.25 0 0 0 1.25 1.25h5a1.25 1.25 0 0 0 1.25-1.25v-5A1.25 1.25 0 0 0 18.25 11h-3A1.25 1.25 0 0 1 14 9.75A2.75 2.75 0 0 1 16.75 7h.75a.75.75 0 0 0 0-1.5h-.75Z" />
  </svg>
);

export const Blockquote = forwardRef<HTMLDivElement, BlockquoteProps>(function Blockquote(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    title,
    citation,
    citeUrl,
    icon,
    footer,
    align = "left",
    variant = "soft",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = true,
    id,
    style,
    ...rest
  } = props;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-blockquote-root", className)}
      style={style}
      data-align={align}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
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
      <span className="nc-blockquote__icon" aria-hidden="true" {...ncSlot("icon")}>
        {icon ?? defaultQuoteIcon}
      </span>

      <span className="nc-blockquote__content" {...ncSlot("content")}>
        {title ? (
          <span className="nc-blockquote__title" {...ncSlot("title")}>
            {title}
          </span>
        ) : null}

        <blockquote className="nc-blockquote__quote" cite={citeUrl} {...ncSlot("quote")}>
          {children}
        </blockquote>

        {citation ? (
          <span className="nc-blockquote__citation" {...ncSlot("citation")}>
            {citation}
          </span>
        ) : null}

        {footer ? (
          <span className="nc-blockquote__footer" {...ncSlot("footer")}>
            {footer}
          </span>
        ) : null}
      </span>
    </div>
  );
});