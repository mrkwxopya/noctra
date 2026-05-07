import { forwardRef } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { BadgeProps } from "./Badge.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  props,
  ref
): ReactElement {
  const {
    children,
    className,
    variant = "soft",
    tone = "neutral",
    size = "sm",
    radius = "full",
    leftIcon,
    rightIcon,
    dot,
    ...rest
  } = props;

  const shouldShowDot = dot || variant === "dot";

  return (
    <span
      ref={ref}
      className={cx("nc-badge", className)}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        tone,
        radius
      })}
      {...rest}
    >
      {shouldShowDot ? <span className="nc-badge__dot" aria-hidden="true" {...ncSlot("dot")} /> : null}

      {leftIcon ? (
        <span className="nc-badge__icon" aria-hidden="true" {...ncSlot("icon")}>
          {leftIcon}
        </span>
      ) : null}

      <span className="nc-badge__label" {...ncSlot("label")}>
        {children}
      </span>

      {rightIcon ? (
        <span className="nc-badge__icon" aria-hidden="true" {...ncSlot("icon")}>
          {rightIcon}
        </span>
      ) : null}
    </span>
  );
});