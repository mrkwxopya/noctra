import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ProseProps } from "./Prose.types";

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

export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    lead,
    footer,
    align = "left",
    measure = "md",
    variant = "ghost",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-prose-root", className)}
      style={style}
      data-align={align}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-measure={measure}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: children ? "filled" : "empty"
      })}
      {...rest}
    >
      {lead ? (
        <div className="nc-prose__lead" {...ncSlot("lead")}>
          {lead}
        </div>
      ) : null}

      <div className="nc-prose__content" {...ncSlot("content")}>
        {children}
      </div>

      {footer ? (
        <div className="nc-prose__footer" {...ncSlot("footer")}>
          {footer}
        </div>
      ) : null}
    </div>
  );
});