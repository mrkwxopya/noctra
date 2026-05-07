import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CardAction, CardProps, CardStyle } from "./Card.types";

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

function renderAction(action: CardAction, slot: "primary-action" | "secondary-action", className: string): ReactElement {
  if (action.href) {
    const rel = action.rel ?? (action.target === "_blank" ? "noreferrer" : undefined);

    return (
      <a
        {...action.anchorProps}
        className={cx(className, action.anchorProps?.className)}
        href={action.disabled ? undefined : action.href}
        target={action.target}
        rel={rel}
        aria-disabled={action.disabled || undefined}
        data-disabled={action.disabled || undefined}
        {...ncSlot(slot)}
      >
        {action.label}
      </a>
    );
  }

  return (
    <button
      {...action.buttonProps}
      type={action.buttonProps?.type ?? "button"}
      className={cx(className, action.buttonProps?.className)}
      disabled={action.disabled || action.buttonProps?.disabled}
      onClick={action.onClick}
      {...ncSlot(slot)}
    >
      {action.label}
    </button>
  );
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    title,
    subtitle,
    description,
    eyebrow,
    media,
    image,
    header,
    footer,
    aside,
    actions,
    primaryAction,
    secondaryAction,
    orientation = "vertical",
    shadow = "sm",
    interactive = false,
    selected = false,
    muted = false,
    padded = true,
    width,
    minHeight,
    maxWidth,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = false,
    withBorder = true,
    id,
    style,
    ...rest
  } = props;

  const cardStyle: CardStyle = { ...style };
  const cssWidth = toCssSize(width);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);
  const hasHeaderContent = Boolean(header || eyebrow || title || subtitle || description);
  const hasActions = Boolean(actions || primaryAction || secondaryAction);

  if (cssWidth !== undefined) {
    cardStyle["--nc-card-width"] = cssWidth;
  }

  if (cssMinHeight !== undefined) {
    cardStyle["--nc-card-min-height"] = cssMinHeight;
  }

  if (cssMaxWidth !== undefined) {
    cardStyle["--nc-card-max-width"] = cssMaxWidth;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-card-root", className)}
      style={cardStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-has-aside={Boolean(aside) || undefined}
      data-interactive={interactive || undefined}
      data-muted={muted || undefined}
      data-orientation={orientation}
      data-padded={padded || undefined}
      data-selected={selected || undefined}
      data-shadow={shadow}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: selected ? "selected" : children || hasHeaderContent ? "filled" : "empty"
      })}
      {...rest}
    >
      {media || image ? (
        <div className="nc-card__media" {...ncSlot("media")}>
          {image ? (
            <div className="nc-card__image" {...ncSlot("image")}>
              {image}
            </div>
          ) : null}
          {media}
        </div>
      ) : null}

      <div className="nc-card__body">
        {hasHeaderContent ? (
          <div className="nc-card__header" {...ncSlot("header")}>
            {header}

            {eyebrow ? (
              <div className="nc-card__eyebrow" {...ncSlot("eyebrow")}>
                {eyebrow}
              </div>
            ) : null}

            {title ? (
              <div className="nc-card__title" {...ncSlot("title")}>
                {title}
              </div>
            ) : null}

            {subtitle ? (
              <div className="nc-card__subtitle" {...ncSlot("subtitle")}>
                {subtitle}
              </div>
            ) : null}

            {description ? (
              <div className="nc-card__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="nc-card__layout" {...ncSlot("layout")}>
          <div className="nc-card__content" {...ncSlot("content")}>
            {children}
          </div>

          {aside ? (
            <div className="nc-card__aside" {...ncSlot("aside")}>
              {aside}
            </div>
          ) : null}
        </div>

        {hasActions ? (
          <div className="nc-card__actions" {...ncSlot("actions")}>
            {actions}
            {primaryAction ? renderAction(primaryAction, "primary-action", "nc-card__primary-action") : null}
            {secondaryAction ? renderAction(secondaryAction, "secondary-action", "nc-card__secondary-action") : null}
          </div>
        ) : null}

        {footer ? (
          <div className="nc-card__footer" {...ncSlot("footer")}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
});