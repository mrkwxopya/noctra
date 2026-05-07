import { forwardRef, useEffect, useRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ClickOutsideEventType, ClickOutsideProps } from "./ClickOutside.types";

const defaultEventTypes: ClickOutsideEventType[] = ["pointerdown"];

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

function getEventTarget(event: Event): Node | null {
  const target = event.target;

  return target instanceof Node ? target : null;
}

function isInsideNode(container: HTMLElement | null, target: Node | null): boolean {
  if (!container || !target) return false;

  if (container.contains(target)) return true;

  const composedPath = typeof Event.prototype.composedPath === "function" ? undefined : null;

  if (composedPath === null) return false;

  return false;
}

function isInComposedPath(event: Event, element: HTMLElement | null): boolean {
  if (!element || typeof event.composedPath !== "function") return false;

  return event.composedPath().includes(element);
}

function isOutsideEvent(
  event: Event,
  root: HTMLElement | null,
  excludeElements: Array<HTMLElement | null>
): boolean {
  const target = getEventTarget(event);

  if (!target) return false;
  if (isInsideNode(root, target) || isInComposedPath(event, root)) return false;

  return excludeElements.every((element) => !isInsideNode(element, target) && !isInComposedPath(event, element));
}

export const ClickOutside = forwardRef<HTMLDivElement, ClickOutsideProps>(function ClickOutside(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    active = true,
    capture = true,
    eventTypes = defaultEventTypes,
    excludeRefs = [],
    onClickOutside,
    onEscapeKeyDown,
    closeOnEscape = true,
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

  const rootRef = useRef<HTMLDivElement | null>(null);
  const enabled = active && !disabled;

  function setRootRef(node: HTMLDivElement | null): void {
    rootRef.current = node;
    assignRef(ref, node);
  }

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const uniqueEventTypes = Array.from(new Set(eventTypes));

    const handleOutsideEvent = (event: Event): void => {
      const excludeElements = excludeRefs.map((excludeRef) => excludeRef.current);

      if (isOutsideEvent(event, rootRef.current, excludeElements)) {
        onClickOutside?.(event);
      }
    };

    uniqueEventTypes.forEach((eventType) => {
      document.addEventListener(eventType, handleOutsideEvent, { capture });
    });

    return () => {
      uniqueEventTypes.forEach((eventType) => {
        document.removeEventListener(eventType, handleOutsideEvent, { capture });
      });
    };
  }, [active, capture, disabled, eventTypes, excludeRefs, onClickOutside, enabled]);

  useEffect(() => {
    if (!enabled || !closeOnEscape || typeof document === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;

      onEscapeKeyDown?.(event);
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [closeOnEscape, enabled, onEscapeKeyDown]);

  return (
    <div
      ref={setRootRef}
      id={id}
      className={cx("nc-click-outside-root", className)}
      style={style}
      data-active={enabled || undefined}
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
        state: enabled ? "active" : "inactive"
      })}
      {...rest}
    >
      <span className="nc-click-outside__content" {...ncSlot("content")}>
        {children}
      </span>
    </div>
  );
});