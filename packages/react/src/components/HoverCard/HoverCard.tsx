import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { HoverCardProps, HoverCardStyle } from "./HoverCard.types";

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

export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    triggerContent,
    content,
    title,
    description,
    media,
    footer,
    opened,
    defaultOpened = false,
    onOpenChange,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    placement = "bottom",
    align = "center",
    width = "sm",
    withArrow = true,
    withBorder = true,
    keepMounted = false,
    offset = 10,
    openDelay = 120,
    closeDelay = 160,
    interactive = true,
    triggerButtonProps,
    id,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isControlled = opened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isOpen = isControlled ? opened : internalOpened;
  const shouldRenderDropdown = keepMounted || isOpen;
  const titleId = title ? `${rootId}-title` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const hoverCardStyle: HoverCardStyle = { ...style };

  hoverCardStyle["--nc-hover-card-offset"] = `${offset}px`;

  function clearTimers(): void {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function setOpen(nextOpened: boolean, delay: number): void {
    if (disabled) return;

    clearTimers();

    const timer = window.setTimeout(() => {
      if (!isControlled) {
        setInternalOpened(nextOpened);
      }

      onOpenChange?.(nextOpened);
    }, Math.max(0, delay));

    if (nextOpened) {
      openTimerRef.current = timer;
      return;
    }

    closeTimerRef.current = timer;
  }

  function open(): void {
    setOpen(true, openDelay);
  }

  function close(): void {
    setOpen(false, closeDelay);
  }

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={rootId}
      className={cx("nc-hover-card-root", className)}
      style={hoverCardStyle}
      data-open={isOpen || undefined}
      data-placement={placement}
      data-align={align}
      data-width={width}
      data-arrow={withArrow || undefined}
      data-interactive={interactive || undefined}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        open();
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        close();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        open();
      }}
      onBlur={(event) => {
        onBlur?.(event);

        if (!event.currentTarget.contains(event.relatedTarget)) {
          close();
        }
      }}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: isOpen ? "open" : "closed"
      })}
      {...rest}
    >
      <button
        {...triggerButtonProps}
        type="button"
        className={cx("nc-hover-card__trigger", triggerButtonProps?.className)}
        disabled={disabled || triggerButtonProps?.disabled}
        aria-describedby={isOpen ? `${rootId}-dropdown` : undefined}
        {...ncSlot("trigger")}
      >
        {triggerContent ?? children}
      </button>

      {shouldRenderDropdown ? (
        <div
          id={`${rootId}-dropdown`}
          className="nc-hover-card__dropdown"
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          hidden={!isOpen}
          data-border={withBorder || undefined}
          {...ncSlot("dropdown")}
        >
          {withArrow ? <span className="nc-hover-card__arrow" aria-hidden="true" {...ncSlot("arrow")} /> : null}

          {media ? (
            <div className="nc-hover-card__media" {...ncSlot("media")}>
              {media}
            </div>
          ) : null}

          {title || description ? (
            <div className="nc-hover-card__header" {...ncSlot("header")}>
              {title ? (
                <div id={titleId} className="nc-hover-card__title" {...ncSlot("title")}>
                  {title}
                </div>
              ) : null}

              {description ? (
                <div id={descriptionId} className="nc-hover-card__description" {...ncSlot("description")}>
                  {description}
                </div>
              ) : null}
            </div>
          ) : null}

          {content ? (
            <div className="nc-hover-card__body" {...ncSlot("body")}>
              {content}
            </div>
          ) : null}

          {footer ? (
            <div className="nc-hover-card__footer" {...ncSlot("footer")}>
              {footer}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});