import { forwardRef, useEffect, useId, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { DialogProps } from "./Dialog.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null): void {
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

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    trigger,
    heading,
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
    placement = "center",
    disabled,
    withOverlay = true,
    withCloseButton = true,
    closeOnEscape = true,
    closeOnOverlayClick = true,
    closeLabel = "Close dialog",
    triggerLabel = "Open dialog",
    id,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const dialogId = id ?? generatedId;
  const triggerId = `${dialogId}-trigger`;
  const contentId = `${dialogId}-content`;
  const headingId = heading ? `${dialogId}-heading` : undefined;
  const descriptionId = description ? `${dialogId}-description` : undefined;
  const isControlled = opened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isOpen = isControlled ? opened : internalOpened;

  function setOpen(nextOpened: boolean): void {
    if (disabled) return;

    if (!isControlled) {
      setInternalOpened(nextOpened);
    }

    onOpenChange?.(nextOpened);
  }

  function closeDialog(): void {
    setOpen(false);
    document.getElementById(triggerId)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) return;

    if (event.key === "Escape" && closeOnEscape && isOpen) {
      event.preventDefault();
      closeDialog();
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleDocumentKeyDown(event: globalThis.KeyboardEvent): void {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        closeDialog();
      }
    }

    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => document.removeEventListener("keydown", handleDocumentKeyDown);
  }, [isOpen, closeOnEscape]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={dialogId}
      className={cx("nc-dialog-root", className)}
      data-placement={placement}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        expanded: isOpen,
        state: isOpen ? "open" : "closed"
      })}
      {...rest}
    >
      {trigger ? (
        <button
          id={triggerId}
          type="button"
          className="nc-dialog__trigger"
          aria-label={typeof trigger === "string" ? undefined : triggerLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? contentId : undefined}
          disabled={disabled}
          onClick={() => setOpen(true)}
          {...ncSlot("trigger")}
        >
          {trigger}
        </button>
      ) : null}

      {isOpen ? (
        <>
          {withOverlay ? (
            <button
              type="button"
              className="nc-dialog__overlay"
              aria-label={closeLabel}
              tabIndex={closeOnOverlayClick ? 0 : -1}
              onClick={() => {
                if (closeOnOverlayClick) {
                  closeDialog();
                }
              }}
              {...ncSlot("overlay")}
            />
          ) : null}

          <div
            id={contentId}
            className="nc-dialog__content"
            role="dialog"
            aria-modal={withOverlay || undefined}
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            {...ncSlot("content")}
          >
            {heading || description || withCloseButton ? (
              <div className="nc-dialog__header" {...ncSlot("header")}>
                <div className="nc-dialog__header-content">
                  {heading ? (
                    <div id={headingId} className="nc-dialog__heading" {...ncSlot("heading")}>
                      {heading}
                    </div>
                  ) : null}

                  {description ? (
                    <div id={descriptionId} className="nc-dialog__description" {...ncSlot("description")}>
                      {description}
                    </div>
                  ) : null}
                </div>

                {withCloseButton ? (
                  <button
                    type="button"
                    className="nc-dialog__close-button"
                    aria-label={closeLabel}
                    onClick={closeDialog}
                    {...ncSlot("close-button")}
                  >
                    {closeIcon}
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="nc-dialog__body" {...ncSlot("body")}>
              {children}
            </div>

            {footer ? (
              <div className="nc-dialog__footer" {...ncSlot("footer")}>
                {footer}
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
});