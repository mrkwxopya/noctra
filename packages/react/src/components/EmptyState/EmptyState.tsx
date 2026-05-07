import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { EmptyStateAction, EmptyStateProps } from "./EmptyState.types";

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

function renderAction(action: EmptyStateAction, slot: "action" | "secondary-action", className: string): ReactElement {
  if (action.href) {
    const rel = action.rel ?? (action.target === "_blank" ? "noreferrer" : undefined);

    return (
      <a
        {...action.anchorProps}
        className={cx(className, action.anchorProps?.className)}
        href={action.disabled ? undefined : action.href}
        target={action.target}
        rel={rel}
        aria-disabled={action.disabled || undefined}
        data-disabled={action.disabled || undefined}
        {...ncSlot(slot)}
      >
        {action.label}
      </a>
    );
  }

  return (
    <button
      {...action.buttonProps}
      type={action.buttonProps?.type ?? "button"}
      className={cx(className, action.buttonProps?.className)}
      disabled={action.disabled || action.buttonProps?.disabled}
      onClick={action.onClick}
      {...ncSlot(slot)}
    >
      {action.label}
    </button>
  );
}

const defaultIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5.25 4A2.25 2.25 0 0 0 3 6.25v11.5A2.25 2.25 0 0 0 5.25 20h13.5A2.25 2.25 0 0 0 21 17.75V6.25A2.25 2.25 0 0 0 18.75 4H5.25Zm0 1.5h13.5c.414 0 .75.336.75.75v8.19l-2.47-2.47a2.25 2.25 0 0 0-3.182 0l-1.098 1.098l-2.348-2.348a2.25 2.25 0 0 0-3.182 0L4.5 13.44V6.25c0-.414.336-.75.75-.75ZM8 8.25A1.25 1.25 0 1 1 10.5 8.25A1.25 1.25 0 0 1 8 8.25Z" />
  </svg>
);

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    title = "Nothing here yet",
    description,
    icon,
    media,
    action,
    secondaryAction,
    footer,
    align = "center",
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    compact = false,
    fullWidth = true,
    withBorder = true,
    id,
    style,
    ...rest
  } = props;

  const hasActions = Boolean(action || secondaryAction);
  const hasContent = Boolean(title || description || children);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-empty-state-root", className)}
      style={style}
      data-align={align}
      data-border={withBorder || undefined}
      data-compact={compact || undefined}
      data-full-width={fullWidth || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: "empty"
      })}
      {...rest}
    >
      {media ? (
        <div className="nc-empty-state__media" {...ncSlot("media")}>
          {media}
        </div>
      ) : (
        <div className="nc-empty-state__icon" aria-hidden="true" {...ncSlot("icon")}>
          {icon ?? defaultIcon}
        </div>
      )}

      {hasContent ? (
        <div className="nc-empty-state__content" {...ncSlot("content")}>
          {title ? (
            <div className="nc-empty-state__title" {...ncSlot("title")}>
              {title}
            </div>
          ) : null}

          {description ? (
            <div className="nc-empty-state__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}

          {children}
        </div>
      ) : null}

      {hasActions ? (
        <div className="nc-empty-state__actions" {...ncSlot("actions")}>
          {action ? renderAction(action, "action", "nc-empty-state__action") : null}
          {secondaryAction ? renderAction(secondaryAction, "secondary-action", "nc-empty-state__secondary-action") : null}
        </div>
      ) : null}

      {footer ? (
        <div className="nc-empty-state__footer" {...ncSlot("footer")}>
          {footer}
        </div>
      ) : null}
    </div>
  );
});