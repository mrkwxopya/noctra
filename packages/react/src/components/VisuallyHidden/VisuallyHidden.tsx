import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { VisuallyHiddenProps } from "./VisuallyHidden.types";

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

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(function VisuallyHidden(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    focusable = false,
    revealOnFocus = focusable,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    id,
    style,
    ...rest
  } = props;

  return (
    <span
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-visually-hidden-root", className)}
      style={style}
      data-focusable={focusable || undefined}
      data-reveal-on-focus={revealOnFocus || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: revealOnFocus ? "focusable" : "hidden"
      })}
      {...rest}
    >
      {children}
    </span>
  );
});