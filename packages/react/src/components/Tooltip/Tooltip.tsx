import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TooltipProps, TooltipStyle } from "./Tooltip.types";

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

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    triggerContent,
    content,
    label,
    description,
    opened,
    defaultOpened = false,
    onOpenChange,
    variant = "filled",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    placement = "top",
    align = "center",
    trigger = "hover",
    width = "auto",
    withArrow = true,
    withBorder = false,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    keepMounted = false,
    offset = 8,
    openDelay = 0,
    closeDelay = 80,
    multiline = false,
    triggerButtonProps,
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
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isControlled = opened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isOpen = isControlled ? opened : internalOpened;
  const shouldRenderTooltip = keepMounted || isOpen;
  const tooltipStyle: TooltipStyle = { ...style };

  tooltipStyle["--nc-tooltip-offset"] = `${offset}px`;

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

  function setOpen(nextOpened: boolean, delay = 0): void {
    if (disabled || trigger === "manual") return;

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

  function setOpenFromInternal(nextOpened: boolean): void {
    if (disabled) return;

    clearTimers();

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
    if (!isOpen || !closeOnOutsideClick || trigger !== "click") return;

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
  }, [closeOnOutsideClick, isOpen, trigger]);

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
      className={cx("nc-tooltip-root", className)}
      style={tooltipStyle}
      data-open={isOpen || undefined}
      data-placement={placement}
      data-align={align}
      data-width={width}
      data-arrow={withArrow || undefined}
      data-multiline={multiline || undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (trigger === "hover") setOpen(true, openDelay);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        if (trigger === "hover") setOpen(false, closeDelay);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (trigger === "focus") setOpen(true, openDelay);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (trigger === "focus" && !event.currentTarget.contains(event.relatedTarget)) setOpen(false, closeDelay);
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
        className={cx("nc-tooltip__trigger", triggerButtonProps?.className)}
        disabled={disabled || triggerButtonProps?.disabled}
        aria-describedby={isOpen ? `${rootId}-content` : undefined}
        onClick={(event) => {
          triggerButtonProps?.onClick?.(event);

          if (!event.defaultPrevented && trigger === "click") {
            setOpenFromInternal(!isOpen);
          }
        }}
        {...ncSlot("trigger")}
      >
        {triggerContent ?? children}
      </button>

      {shouldRenderTooltip ? (
        <div
          id={`${rootId}-content`}
          className="nc-tooltip__content"
          role="tooltip"
          hidden={!isOpen}
          data-border={withBorder || undefined}
          {...ncSlot("content")}
        >
          {withArrow ? <span className="nc-tooltip__arrow" aria-hidden="true" {...ncSlot("arrow")} /> : null}

          {label ? (
            <span className="nc-tooltip__label" {...ncSlot("label")}>
              {label}
            </span>
          ) : null}

          {description ? (
            <span className="nc-tooltip__description" {...ncSlot("description")}>
              {description}
            </span>
          ) : null}

          {!label && !description ? content : null}
        </div>
      ) : null}
    </div>
  );
});