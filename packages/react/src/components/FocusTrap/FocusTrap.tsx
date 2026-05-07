import { forwardRef, useEffect, useRef } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { FocusTrapProps } from "./FocusTrap.types";

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

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

function isHTMLElement(node: Element | null): node is HTMLElement {
  return node instanceof HTMLElement;
}

function isFocusable(node: Element): node is HTMLElement {
  if (!(node instanceof HTMLElement)) return false;
  if (node.hasAttribute("disabled")) return false;
  if (node.getAttribute("aria-hidden") === "true") return false;

  const style = window.getComputedStyle(node);

  return style.display !== "none" && style.visibility !== "hidden";
}

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  return Array.from(container.querySelectorAll(focusableSelector)).filter(isFocusable);
}

function focusElement(element: HTMLElement | null, preventScroll: boolean): void {
  element?.focus({ preventScroll });
}

export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>(function FocusTrap(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    active = true,
    restoreFocus = true,
    initialFocus = "first",
    loop = true,
    preventScroll = true,
    variant = "ghost",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = false,
    tabIndex,
    id,
    style,
    onKeyDown,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const enabled = active && !disabled;

  function setRootRef(node: HTMLDivElement | null): void {
    rootRef.current = node;
    assignRef(ref, node);
  }

  function focusFirst(): void {
    const focusableElements = getFocusableElements(rootRef.current);
    focusElement(focusableElements[0] ?? rootRef.current ?? null, preventScroll);
  }

  function focusLast(): void {
    const focusableElements = getFocusableElements(rootRef.current);
    focusElement(focusableElements[focusableElements.length - 1] ?? rootRef.current ?? null, preventScroll);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || !enabled || !loop || event.key !== "Tab") return;

    const focusableElements = getFocusableElements(rootRef.current);

    if (focusableElements.length === 0) {
      event.preventDefault();
      focusElement(rootRef.current, preventScroll);
      return;
    }

    const firstElement = focusableElements[0] ?? null;
    const lastElement = focusableElements[focusableElements.length - 1] ?? null;
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      focusElement(lastElement, preventScroll);
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      focusElement(firstElement, preventScroll);
    }
  }

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    previouslyFocusedElementRef.current = isHTMLElement(document.activeElement) ? document.activeElement : null;

    if (initialFocus === "container") {
      focusElement(rootRef.current, preventScroll);
    }

    if (initialFocus === "first") {
      focusFirst();
    }

    return () => {
      if (restoreFocus) {
        focusElement(previouslyFocusedElementRef.current, preventScroll);
      }

      previouslyFocusedElementRef.current = null;
    };
  }, [enabled, initialFocus, preventScroll, restoreFocus]);

  return (
    <div
      ref={setRootRef}
      id={id}
      className={cx("nc-focus-trap-root", className)}
      style={style}
      tabIndex={tabIndex ?? -1}
      data-active={enabled || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-loop={loop || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: enabled ? "active" : "inactive"
      })}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {enabled ? (
        <span
          className="nc-focus-trap__sentinel"
          tabIndex={0}
          aria-hidden="true"
          onFocus={focusLast}
          {...ncSlot("sentinel-start")}
        />
      ) : null}

      <span className="nc-focus-trap__content" {...ncSlot("content")}>
        {children}
      </span>

      {enabled ? (
        <span
          className="nc-focus-trap__sentinel"
          tabIndex={0}
          aria-hidden="true"
          onFocus={focusFirst}
          {...ncSlot("sentinel-end")}
        />
      ) : null}
    </div>
  );
});