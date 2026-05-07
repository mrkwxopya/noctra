import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { GridProps, GridStyle } from "./Grid.types";

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

function toGridTrack(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;

  if (typeof value === "number" && Number.isFinite(value)) {
    return `repeat(${Math.max(1, Math.floor(value))}, minmax(0, 1fr))`;
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return fallback;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    columns = 12,
    rows,
    autoColumns,
    autoRows,
    autoFlow = "row",
    gap,
    rowGap,
    columnGap,
    align = "stretch",
    justify = "stretch",
    width,
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

  const gridStyle: GridStyle = { ...style };
  const cssGap = toCssSize(gap);
  const cssRowGap = toCssSize(rowGap);
  const cssColumnGap = toCssSize(columnGap);
  const cssWidth = toCssSize(width);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);

  gridStyle["--nc-grid-template-columns"] = toGridTrack(columns, "repeat(12, minmax(0, 1fr))");
  gridStyle["--nc-grid-template-rows"] = toGridTrack(rows, "none");

  if (autoColumns) {
    gridStyle["--nc-grid-auto-columns"] = autoColumns;
  }

  if (autoRows) {
    gridStyle["--nc-grid-auto-rows"] = autoRows;
  }

  if (cssGap !== undefined) {
    gridStyle["--nc-grid-gap"] = cssGap;
  }

  if (cssRowGap !== undefined) {
    gridStyle["--nc-grid-row-gap"] = cssRowGap;
  }

  if (cssColumnGap !== undefined) {
    gridStyle["--nc-grid-column-gap"] = cssColumnGap;
  }

  if (cssWidth !== undefined) {
    gridStyle["--nc-grid-width"] = cssWidth;
  }

  if (cssMinHeight !== undefined) {
    gridStyle["--nc-grid-min-height"] = cssMinHeight;
  }

  if (cssMaxWidth !== undefined) {
    gridStyle["--nc-grid-max-width"] = cssMaxWidth;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-grid-root", className)}
      style={gridStyle}
      data-align={align}
      data-auto-flow={autoFlow}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-grow={grow || undefined}
      data-inline={inline || undefined}
      data-justify={justify}
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
      <div className="nc-grid__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});