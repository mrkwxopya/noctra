import { forwardRef, useEffect, useMemo, useState } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { createPortal } from "react-dom";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { PortalContainer, PortalProps } from "./Portal.types";

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
  return typeof document !== "undefined" && Boolean(document.body);
}

function resolveContainer(container: PortalContainer | undefined): Element | DocumentFragment | null {
  if (typeof container === "function") {
    return container();
  }

  if (container !== undefined) {
    return container;
  }

  return canUseDocument() ? document.body : null;
}

export const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  props,
  ref
): ReactElement | null {
  const {
    className,
    children,
    container,
    disabled = false,
    forceMount = false,
    preserveWrapper = true,
    portalKey,
    variant = "ghost",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    fullWidth = false,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const target = useMemo(() => {
    if (!mounted && !forceMount) return null;
    return resolveContainer(container);
  }, [container, forceMount, mounted]);

  const content = (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-portal-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-disabled={disabled || undefined}
      data-full-width={fullWidth || undefined}
      data-preserve-wrapper={preserveWrapper || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: disabled ? "disabled" : target ? "mounted" : "idle"
      })}
      {...rest}
    >
      {children}
    </div>
  );

  if (disabled) {
    return content;
  }

  if (!mounted && !forceMount) {
    return null;
  }

  if (!target) {
    return preserveWrapper ? content : <>{children}</>;
  }

  return createPortal(preserveWrapper ? content : children, target, portalKey);
});