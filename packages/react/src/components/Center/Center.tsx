import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CenterProps, CenterStyle } from "./Center.types";

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

function toCssSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(function Center(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    direction = "row",
    gap,
    width,
    height,
    minHeight,
    maxWidth,
    inline = false,
    grow = false,
    variant = "ghost",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const centerStyle: CenterStyle = { ...style };
  const cssGap = toCssSize(gap);
  const cssWidth = toCssSize(width);
  const cssHeight = toCssSize(height);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);

  if (cssGap !== undefined) {
    centerStyle["--nc-center-gap"] = cssGap;
  }

  if (cssWidth !== undefined) {
    centerStyle["--nc-center-width"] = cssWidth;
  }

  if (cssHeight !== undefined) {
    centerStyle["--nc-center-height"] = cssHeight;
  }

  if (cssMinHeight !== undefined) {
    centerStyle["--nc-center-min-height"] = cssMinHeight;
  }

  if (cssMaxWidth !== undefined) {
    centerStyle["--nc-center-max-width"] = cssMaxWidth;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-center-root", className)}
      style={centerStyle}
      data-border={withBorder || undefined}
      data-direction={direction}
      data-full-width={fullWidth || undefined}
      data-grow={grow || undefined}
      data-inline={inline || undefined}
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
      <div className="nc-center__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});