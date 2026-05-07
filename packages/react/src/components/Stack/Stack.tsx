import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { StackProps, StackStyle } from "./Stack.types";

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

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    direction = "column",
    align = "stretch",
    justify = "start",
    wrap = "nowrap",
    gap,
    rowGap,
    columnGap,
    reverse = false,
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

  const stackStyle: StackStyle = { ...style };
  const cssGap = toCssSize(gap);
  const cssRowGap = toCssSize(rowGap);
  const cssColumnGap = toCssSize(columnGap);

  if (cssGap !== undefined) {
    stackStyle["--nc-stack-gap"] = cssGap;
  }

  if (cssRowGap !== undefined) {
    stackStyle["--nc-stack-row-gap"] = cssRowGap;
  }

  if (cssColumnGap !== undefined) {
    stackStyle["--nc-stack-column-gap"] = cssColumnGap;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-stack-root", className)}
      style={stackStyle}
      data-align={align}
      data-border={withBorder || undefined}
      data-direction={direction}
      data-full-width={fullWidth || undefined}
      data-grow={grow || undefined}
      data-inline={inline || undefined}
      data-justify={justify}
      data-reverse={reverse || undefined}
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
      <div className="nc-stack__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});