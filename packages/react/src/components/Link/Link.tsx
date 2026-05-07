import { forwardRef } from "react";
import type { MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { LinkProps } from "./Link.types";

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

const defaultExternalIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M11.75 3.75a.75.75 0 0 1 .75-.75h3.25a.75.75 0 0 1 .75.75V7a.75.75 0 0 1-1.5 0V5.56l-5.22 5.22a.75.75 0 1 1-1.06-1.06L13.94 4.5H12.5a.75.75 0 0 1-.75-.75Z" />
    <path d="M4.75 4.5A2.25 2.25 0 0 0 2.5 6.75v8.5a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25v-4a.75.75 0 0 0-1.5 0v4a.75.75 0 0 1-.75.75h-8.5a.75.75 0 0 1-.75-.75v-8.5A.75.75 0 0 1 4.75 6h4a.75.75 0 0 0 0-1.5h-4Z" />
  </svg>
);

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    leftSection,
    rightSection,
    externalIcon,
    variant = "ghost",
    underline = "hover",
    size = "md",
    radius = "sm",
    tone = "primary",
    density = "default",
    disabled,
    active,
    external,
    truncate = false,
    fullWidth = false,
    withBorder = false,
    href,
    target,
    rel,
    onClick,
    id,
    style,
    ...rest
  } = props;

  const isExternal = external ?? target === "_blank";
  const resolvedRel = rel ?? (isExternal ? "noreferrer" : undefined);

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  return (
    <a
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-link-root", className)}
      style={style}
      href={disabled ? undefined : href}
      target={target}
      rel={resolvedRel}
      aria-disabled={disabled || undefined}
      data-active={active || undefined}
      data-border={withBorder || undefined}
      data-disabled={disabled || undefined}
      data-external={isExternal || undefined}
      data-full-width={fullWidth || undefined}
      data-truncate={truncate || undefined}
      data-underline={underline}
      onClick={handleClick}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: active ? "active" : href ? "linked" : "idle"
      })}
      {...rest}
    >
      {leftSection ? (
        <span className="nc-link__left-section" aria-hidden="true" {...ncSlot("left-section")}>
          {leftSection}
        </span>
      ) : null}

      <span className="nc-link__label" {...ncSlot("label")}>
        {children}
      </span>

      {rightSection ? (
        <span className="nc-link__right-section" aria-hidden="true" {...ncSlot("right-section")}>
          {rightSection}
        </span>
      ) : null}

      {isExternal ? (
        <span className="nc-link__external-icon" aria-hidden="true" {...ncSlot("external-icon")}>
          {externalIcon ?? defaultExternalIcon}
        </span>
      ) : null}
    </a>
  );
});