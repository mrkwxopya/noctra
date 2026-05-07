import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { PopoverProps } from "./Popover.types";

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

const closeIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
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
    trigger = "click",
    width = "sm",
    withArrow = true,
    withBorder = true,
    withCloseButton = false,
    closeLabel = "Close popover",
    closeOnEscape = true,
    closeOnOutsideClick = true,
    keepMounted = false,
    offset = 8,
    triggerButtonProps,
    closeButtonProps,
    id,
    onKeyDown,
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
  const isControlled = opened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isOpen = isControlled ? opened : internalOpened;
  const shouldRenderDropdown = keepMounted || isOpen;
  const titleId = title ? `${rootId}-title` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const popoverStyle = { ...style, "--nc-popover-offset": `${offset}px` } as React.CSSProperties & { "--nc-popover-offset": string };

  function setOpen(nextOpened: boolean): void {
    if (disabled || trigger === "manual") return;

    if (!isControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function setOpenFromInternal(nextOpened: boolean): void {
    if (disabled) return;

    if (!isControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented) return;

    if (closeOnEscape && event.key === "Escape" && isOpen) {
      event.preventDefault();
      setOpenFromInternal(false);
    }
  }

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    function handlePointerDown(event: PointerEvent): void {
      const root = rootRef.current;

      if (!root || root.contains(event.target as Node)) {
        return;
      }

      setOpenFromInternal(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeOnOutsideClick, isOpen]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={rootId}
      className={cx("nc-popover-root", className)}
      style={popoverStyle}
      data-open={isOpen || undefined}
      data-placement={placement}
      data-align={align}
      data-width={width}
      data-arrow={withArrow || undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (trigger === "hover") setOpen(true);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        if (trigger === "hover") setOpen(false);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (trigger === "focus") setOpen(true);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (trigger === "focus" && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
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
        className={cx("nc-popover__trigger", triggerButtonProps?.className)}
        disabled={disabled || triggerButtonProps?.disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={`${rootId}-dropdown`}
        onClick={(event) => {
          triggerButtonProps?.onClick?.(event);

          if (!event.defaultPrevented && trigger === "click") {
            setOpen(!isOpen);
          }
        }}
        {...ncSlot("trigger")}
      >
        {triggerContent ?? children}
      </button>

      {shouldRenderDropdown ? (
        <div
          id={`${rootId}-dropdown`}
          className="nc-popover__dropdown"
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          hidden={!isOpen}
          data-border={withBorder || undefined}
          {...ncSlot("dropdown")}
        >
          {withArrow ? <span className="nc-popover__arrow" aria-hidden="true" {...ncSlot("arrow")} /> : null}

          {title || description || withCloseButton ? (
            <div className="nc-popover__header" {...ncSlot("header")}>
              {title || description ? (
                <div className="nc-popover__title-group" {...ncSlot("title-group")}>
                  {title ? (
                    <div id={titleId} className="nc-popover__title" {...ncSlot("title")}>
                      {title}
                    </div>
                  ) : null}

                  {description ? (
                    <div id={descriptionId} className="nc-popover__description" {...ncSlot("description")}>
                      {description}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {withCloseButton ? (
                <button
                  {...closeButtonProps}
                  type="button"
                  className={cx("nc-popover__close", closeButtonProps?.className)}
                  aria-label={closeLabel}
                  disabled={disabled || closeButtonProps?.disabled}
                  onClick={(event) => {
                    closeButtonProps?.onClick?.(event);

                    if (!event.defaultPrevented) {
                      setOpenFromInternal(false);
                    }
                  }}
                  {...ncSlot("close")}
                >
                  {closeIcon}
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="nc-popover__body" {...ncSlot("body")}>
            {content}
          </div>

          {footer ? (
            <div className="nc-popover__footer" {...ncSlot("footer")}>
              {footer}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});