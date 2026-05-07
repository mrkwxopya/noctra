import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { FlexProps, FlexStyle } from "./Flex.types";

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

function toFlexNumber(value: boolean | number | undefined, fallback: number): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value ? "1" : "0";
  if (!Number.isFinite(value)) return String(fallback);
  return String(Math.max(0, value));
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    direction = "row",
    align = "stretch",
    justify = "start",
    wrap = "nowrap",
    gap,
    rowGap,
    columnGap,
    basis,
    grow,
    shrink,
    order,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    inline = false,
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

  const flexStyle: FlexStyle = { ...style };
  const cssGap = toCssSize(gap);
  const cssRowGap = toCssSize(rowGap);
  const cssColumnGap = toCssSize(columnGap);
  const cssBasis = toCssSize(basis);
  const cssGrow = toFlexNumber(grow, 1);
  const cssShrink = toFlexNumber(shrink, 1);
  const cssWidth = toCssSize(width);
  const cssHeight = toCssSize(height);
  const cssMinWidth = toCssSize(minWidth);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);
  const cssMaxHeight = toCssSize(maxHeight);

  if (cssGap !== undefined) flexStyle["--nc-flex-gap"] = cssGap;
  if (cssRowGap !== undefined) flexStyle["--nc-flex-row-gap"] = cssRowGap;
  if (cssColumnGap !== undefined) flexStyle["--nc-flex-column-gap"] = cssColumnGap;
  if (cssBasis !== undefined) flexStyle["--nc-flex-basis"] = cssBasis;
  if (cssGrow !== undefined) flexStyle["--nc-flex-grow"] = cssGrow;
  if (cssShrink !== undefined) flexStyle["--nc-flex-shrink"] = cssShrink;
  if (order !== undefined) flexStyle["--nc-flex-order"] = String(order);
  if (cssWidth !== undefined) flexStyle["--nc-flex-width"] = cssWidth;
  if (cssHeight !== undefined) flexStyle["--nc-flex-height"] = cssHeight;
  if (cssMinWidth !== undefined) flexStyle["--nc-flex-min-width"] = cssMinWidth;
  if (cssMinHeight !== undefined) flexStyle["--nc-flex-min-height"] = cssMinHeight;
  if (cssMaxWidth !== undefined) flexStyle["--nc-flex-max-width"] = cssMaxWidth;
  if (cssMaxHeight !== undefined) flexStyle["--nc-flex-max-height"] = cssMaxHeight;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-flex-root", className)}
      style={flexStyle}
      data-align={align}
      data-border={withBorder || undefined}
      data-direction={direction}
      data-full-width={fullWidth || undefined}
      data-inline={inline || undefined}
      data-justify={justify}
      data-wrap={wrap}
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
      <div className="nc-flex__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});