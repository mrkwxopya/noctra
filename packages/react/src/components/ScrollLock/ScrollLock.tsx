import { forwardRef, useEffect } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NcScrollLockTarget, ScrollLockProps } from "./ScrollLock.types";

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

function canUseDocument(): boolean {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

function getLockElement(target: NcScrollLockTarget): HTMLElement | null {
  if (!canUseDocument()) return null;
  return target === "documentElement" ? document.documentElement : document.body;
}

function getScrollbarWidth(): number {
  if (!canUseDocument()) return 0;
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

export const ScrollLock = forwardRef<HTMLDivElement, ScrollLockProps>(function ScrollLock(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    active = true,
    target = "body",
    reserveScrollbarGap = true,
    preventTouchMove = true,
    allowTouchMove,
    variant = "ghost",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const enabled = active && !disabled;

  useEffect(() => {
    const element = getLockElement(target);

    if (!enabled || !element || !canUseDocument()) return;

    const previousOverflow = element.style.overflow;
    const previousPaddingRight = element.style.paddingRight;
    const previousTouchAction = element.style.touchAction;
    const scrollbarWidth = getScrollbarWidth();

    element.style.overflow = "hidden";

    if (reserveScrollbarGap && scrollbarWidth > 0) {
      const computedPaddingRight = Number.parseFloat(window.getComputedStyle(element).paddingRight) || 0;
      element.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    }

    if (preventTouchMove) {
      element.style.touchAction = "none";
    }

    const handleTouchMove = (event: TouchEvent): void => {
      if (!preventTouchMove) return;
      if (allowTouchMove?.(event.target)) return;

      event.preventDefault();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      element.style.overflow = previousOverflow;
      element.style.paddingRight = previousPaddingRight;
      element.style.touchAction = previousTouchAction;
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [allowTouchMove, enabled, preventTouchMove, reserveScrollbarGap, target]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-scroll-lock-root", className)}
      style={style}
      data-active={enabled || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-target={target}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: enabled ? "locked" : "unlocked"
      })}
      {...rest}
    >
      <span className="nc-scroll-lock__content" {...ncSlot("content")}>
        {children}
      </span>
    </div>
  );
});