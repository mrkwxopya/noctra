import { forwardRef, useEffect, useRef, useState } from "react";
import type { MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ToastProps } from "./Toast.types";

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

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  props,
  ref
): ReactElement | null {
  const {
    className,
    title,
    description,
    icon,
    action,
    visible,
    defaultVisible = true,
    onVisibleChange,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    position = "bottom-right",
    duration = null,
    withCloseButton = true,
    closeLabel = "Close toast",
    role = tone === "danger" ? "alert" : "status",
    style,
    ...rest
  } = props;

  const isControlled = visible !== undefined;
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const isVisible = isControlled ? visible : internalVisible;
  const timerRef = useRef<number | null>(null);

  function clearTimer(): void {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function setVisible(nextVisible: boolean): void {
    if (!isControlled) {
      setInternalVisible(nextVisible);
    }

    onVisibleChange?.(nextVisible);
  }

  function closeToast(): void {
    clearTimer();
    setVisible(false);
  }

  useEffect(() => {
    clearTimer();

    if (!isVisible || duration === null || duration <= 0) return undefined;

    timerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimer();
  }, [duration, isVisible]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-toast-root", className)}
      role={role}
      data-position={position}
      style={{
        ...style,
        "--nc-toast-duration": duration && duration > 0 ? `${duration}ms` : undefined
      } as React.CSSProperties}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        state: "open"
      })}
      {...rest}
    >
      {icon ? (
        <span className="nc-toast__icon" aria-hidden="true" {...ncSlot("icon")}>
          {icon}
        </span>
      ) : null}

      <div className="nc-toast__content" {...ncSlot("content")}>
        {title ? (
          <div className="nc-toast__title" {...ncSlot("title")}>
            {title}
          </div>
        ) : null}

        {description ? (
          <div className="nc-toast__description" {...ncSlot("description")}>
            {description}
          </div>
        ) : null}
      </div>

      {action ? (
        <button
          {...action.buttonProps}
          type={action.buttonProps?.type ?? "button"}
          className={cx("nc-toast__action", action.buttonProps?.className)}
          onClick={() => {
            action.onClick?.();
            closeToast();
          }}
          {...ncSlot("action")}
        >
          {action.label}
        </button>
      ) : null}

      {withCloseButton ? (
        <button
          type="button"
          className="nc-toast__close-button"
          aria-label={closeLabel}
          onClick={closeToast}
          {...ncSlot("close-button")}
        >
          {closeIcon}
        </button>
      ) : null}

      {duration && duration > 0 ? <span className="nc-toast__progress" aria-hidden="true" {...ncSlot("progress")} /> : null}
    </div>
  );
});