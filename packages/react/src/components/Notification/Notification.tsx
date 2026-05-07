import { forwardRef, useState } from "react";
import type { MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NotificationProps } from "./Notification.types";

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

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(function Notification(
  props,
  ref
): ReactElement | null {
  const {
    className,
    title,
    description,
    children,
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
    withCloseButton = false,
    closeLabel = "Close notification",
    role = tone === "danger" ? "alert" : "status",
    ...rest
  } = props;

  const isControlled = visible !== undefined;
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const isVisible = isControlled ? visible : internalVisible;
  const hasContent = Boolean(title || description || children);

  function setVisible(nextVisible: boolean): void {
    if (!isControlled) {
      setInternalVisible(nextVisible);
    }

    onVisibleChange?.(nextVisible);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-notification-root", className)}
      role={role}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        state: hasContent ? "filled" : "empty"
      })}
      {...rest}
    >
      {icon ? (
        <span className="nc-notification__icon" aria-hidden="true" {...ncSlot("icon")}>
          {icon}
        </span>
      ) : null}

      <div className="nc-notification__content" {...ncSlot("content")}>
        {title ? (
          <div className="nc-notification__title" {...ncSlot("title")}>
            {title}
          </div>
        ) : null}

        {description ? (
          <div className="nc-notification__description" {...ncSlot("description")}>
            {description}
          </div>
        ) : null}

        {children ? (
          <div className="nc-notification__body" {...ncSlot("body")}>
            {children}
          </div>
        ) : null}
      </div>

      {action ? (
        <button
          {...action.buttonProps}
          type={action.buttonProps?.type ?? "button"}
          className={cx("nc-notification__action", action.buttonProps?.className)}
          onClick={() => action.onClick?.()}
          {...ncSlot("action")}
        >
          {action.label}
        </button>
      ) : null}

      {withCloseButton ? (
        <button
          type="button"
          className="nc-notification__close-button"
          aria-label={closeLabel}
          onClick={() => setVisible(false)}
          {...ncSlot("close-button")}
        >
          {closeIcon}
        </button>
      ) : null}
    </div>
  );
});