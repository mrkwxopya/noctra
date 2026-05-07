import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { BoxProps, BoxStyle } from "./Box.types";

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

export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    display = "block",
    padding,
    margin,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    overflow = "visible",
    shadow = false,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = false,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const boxStyle: BoxStyle = { ...style };
  const cssPadding = toCssSize(padding);
  const cssMargin = toCssSize(margin);
  const cssWidth = toCssSize(width);
  const cssHeight = toCssSize(height);
  const cssMinWidth = toCssSize(minWidth);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);
  const cssMaxHeight = toCssSize(maxHeight);

  if (cssPadding !== undefined) boxStyle["--nc-box-padding"] = cssPadding;
  if (cssMargin !== undefined) boxStyle["--nc-box-margin"] = cssMargin;
  if (cssWidth !== undefined) boxStyle["--nc-box-width"] = cssWidth;
  if (cssHeight !== undefined) boxStyle["--nc-box-height"] = cssHeight;
  if (cssMinWidth !== undefined) boxStyle["--nc-box-min-width"] = cssMinWidth;
  if (cssMinHeight !== undefined) boxStyle["--nc-box-min-height"] = cssMinHeight;
  if (cssMaxWidth !== undefined) boxStyle["--nc-box-max-width"] = cssMaxWidth;
  if (cssMaxHeight !== undefined) boxStyle["--nc-box-max-height"] = cssMaxHeight;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-box-root", className)}
      style={boxStyle}
      data-border={withBorder || undefined}
      data-display={display}
      data-full-width={fullWidth || undefined}
      data-overflow={overflow}
      data-shadow={shadow || undefined}
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
      <div className="nc-box__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});