import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { GroupProps, GroupStyle } from "./Group.types";

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

export const Group = forwardRef<HTMLDivElement, GroupProps>(function Group(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    align = "center",
    justify = "start",
    wrap = "wrap",
    gap,
    rowGap,
    columnGap,
    grow = false,
    preventGrowOverflow = true,
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

  const groupStyle: GroupStyle = { ...style };
  const cssGap = toCssSize(gap);
  const cssRowGap = toCssSize(rowGap);
  const cssColumnGap = toCssSize(columnGap);

  if (cssGap !== undefined) {
    groupStyle["--nc-group-gap"] = cssGap;
  }

  if (cssRowGap !== undefined) {
    groupStyle["--nc-group-row-gap"] = cssRowGap;
  }

  if (cssColumnGap !== undefined) {
    groupStyle["--nc-group-column-gap"] = cssColumnGap;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-group-root", className)}
      style={groupStyle}
      data-align={align}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-grow={grow || undefined}
      data-inline={inline || undefined}
      data-justify={justify}
      data-prevent-grow-overflow={preventGrowOverflow || undefined}
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
      <div className="nc-group__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});