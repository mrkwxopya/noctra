import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ModalProps } from "./Modal.types";

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

function getFocusableElements(node: HTMLElement | null): HTMLElement[] {
  if (!node) return [];

  return Array.from(
    node.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )
  ).filter((item) => !item.hasAttribute("disabled") && item.getAttribute("aria-hidden") !== "true");
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  props,
  ref
): ReactElement | null {
  const {
    className,
    children,
    opened,
    defaultOpened = false,
    onOpenChange,
    onClose,
    title,
    description,
    header,
    footer,
    actions,
    closeLabel = "Close modal",
    closeButtonProps,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    width = "md",
    placement = "center",
    withOverlay = true,
    withCloseButton = true,
    closeOnEscape = true,
    closeOnOverlayClick = true,
    lockScroll = true,
    trapFocus = true,
    fullScreen = false,
    withBorder = true,
    keepMounted = false,
    ariaLabel,
    id,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const isControlled = opened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isOpen = isControlled ? opened : internalOpened;
  const shouldRender = keepMounted || isOpen;
  const titleId = title || header ? `${rootId}-title` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;

  function setOpened(nextOpened: boolean): void {
    if (disabled) return;

    if (!isControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);

    if (!nextOpened) {
      onClose?.();
    }
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>): void {
    if (!closeOnOverlayClick || event.target !== event.currentTarget) return;
    setOpened(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented) return;

    if (closeOnEscape && event.key === "Escape") {
      event.preventDefault();
      setOpened(false);
      return;
    }

    if (trapFocus && event.key === "Tab") {
      const focusable = getFocusableElements(dialogRef.current);

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  useEffect(() => {
    if (!isOpen || !lockScroll) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, lockScroll]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      const focusable = getFocusableElements(dialogRef.current);
      (focusable[0] ?? dialogRef.current)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-modal-root", className)}
      data-open={isOpen || undefined}
      data-placement={placement}
      data-overlay={withOverlay || undefined}
      data-full-screen={fullScreen || undefined}
      hidden={!isOpen}
      onMouseDown={handleOverlayClick}
      onKeyDown={handleKeyDown}
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
      {withOverlay ? <div className="nc-modal__overlay" aria-hidden="true" {...ncSlot("overlay")} /> : null}

      <div
        ref={dialogRef}
        className="nc-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        data-width={width}
        data-border={withBorder || undefined}
        {...ncSlot("dialog")}
      >
        {header || title || description || withCloseButton ? (
          <div className="nc-modal__header" {...ncSlot("header")}>
            {header ? (
              header
            ) : title || description ? (
              <div className="nc-modal__title-group" {...ncSlot("title-group")}>
                {title ? (
                  <h2 id={titleId} className="nc-modal__title" {...ncSlot("title")}>
                    {title}
                  </h2>
                ) : null}

                {description ? (
                  <p id={descriptionId} className="nc-modal__description" {...ncSlot("description")}>
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}

            {withCloseButton ? (
              <button
                {...closeButtonProps}
                type="button"
                className={cx("nc-modal__close", closeButtonProps?.className)}
                aria-label={closeLabel}
                disabled={disabled || closeButtonProps?.disabled}
                onClick={(event) => {
                  closeButtonProps?.onClick?.(event);

                  if (!event.defaultPrevented) {
                    setOpened(false);
                  }
                }}
                {...ncSlot("close")}
              >
                {closeIcon}
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="nc-modal__body" {...ncSlot("body")}>
          {children}
        </div>

        {footer || actions ? (
          <div className="nc-modal__footer" {...ncSlot("footer")}>
            {footer}

            {actions ? (
              <div className="nc-modal__actions" {...ncSlot("actions")}>
                {actions}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
});