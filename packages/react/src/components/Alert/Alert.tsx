import { forwardRef } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { AlertProps } from "./Alert.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function DefaultAlertIcon(): ReactElement {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4.25a.75.75 0 0 1 .75.75v3.25a.75.75 0 0 1-1.5 0V7A.75.75 0 0 1 10 6.25Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    </svg>
  );
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
): ReactElement {
  const {
    children,
    className,
    variant = "soft",
    tone = "info",
    radius = "lg",
    density = "default",
    title,
    icon,
    action,
    onClose,
    closeLabel = "Close alert",
    role,
    ...rest
  } = props;

  const resolvedRole = role ?? (tone === "danger" || tone === "warning" ? "alert" : "status");

  return (
    <div
      ref={ref}
      role={resolvedRole}
      className={cx("nc-alert", className)}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        tone,
        radius,
        density,
        interactive: Boolean(action || onClose)
      })}
      {...rest}
    >
      <span className="nc-alert__icon" {...ncSlot("icon")}>
        {icon ?? <DefaultAlertIcon />}
      </span>

      <div className="nc-alert__content" {...ncSlot("content")}>
        {title ? (
          <div className="nc-alert__title" {...ncSlot("title")}>
            {title}
          </div>
        ) : null}

        {children ? (
          <div className="nc-alert__description" {...ncSlot("description")}>
            {children}
          </div>
        ) : null}
      </div>

      {action ? (
        <div className="nc-alert__action" {...ncSlot("action")}>
          {action}
        </div>
      ) : null}

      {onClose ? (
        <button type="button" className="nc-alert__close" aria-label={closeLabel} onClick={onClose} {...ncSlot("close")}>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});