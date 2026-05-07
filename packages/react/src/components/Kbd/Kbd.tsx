import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { KbdProps } from "./Kbd.types";

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

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    keys,
    separator = "+",
    variant = "surface",
    size = "md",
    radius = "sm",
    tone = "neutral",
    density = "default",
    disabled,
    fullWidth = false,
    withBorder = true,
    id,
    style,
    ...rest
  } = props;

  const hasKeys = Array.isArray(keys) && keys.length > 0;

  return (
    <kbd
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-kbd-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasKeys || children ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasKeys ? (
        keys.map((key, index) => (
          <span key={`${key}-${index}`} className="nc-kbd__group">
            {index > 0 ? (
              <span className="nc-kbd__separator" aria-hidden="true" {...ncSlot("separator")}>
                {separator}
              </span>
            ) : null}

            <span className="nc-kbd__key" {...ncSlot("key")}>
              {key}
            </span>
          </span>
        ))
      ) : (
        <span className="nc-kbd__key" {...ncSlot("key")}>
          {children}
        </span>
      )}
    </kbd>
  );
});