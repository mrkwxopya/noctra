import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NcSimpleGridMode, SimpleGridProps, SimpleGridStyle } from "./SimpleGrid.types";

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

function normalizeColumns(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 3;
  return Math.max(1, Math.min(24, Math.floor(value)));
}

function getTemplateColumns(columns: number | undefined, minChildWidth: number | string | undefined, mode: NcSimpleGridMode): string {
  const normalizedMinChildWidth = toCssSize(minChildWidth);

  if (normalizedMinChildWidth) {
    return `repeat(auto-${mode === "fill" ? "fill" : "fit"}, minmax(min(${normalizedMinChildWidth}, 100%), 1fr))`;
  }

  return `repeat(${normalizeColumns(columns)}, minmax(0, 1fr))`;
}

export const SimpleGrid = forwardRef<HTMLDivElement, SimpleGridProps>(function SimpleGrid(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    columns = 3,
    minChildWidth,
    mode = "fit",
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

  const simpleGridStyle: SimpleGridStyle = { ...style };
  const cssMinChildWidth = toCssSize(minChildWidth);
  const cssGap = toCssSize(gap);
  const cssRowGap = toCssSize(rowGap);
  const cssColumnGap = toCssSize(columnGap);
  const cssWidth = toCssSize(width);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);

  simpleGridStyle["--nc-simple-grid-template-columns"] = getTemplateColumns(columns, minChildWidth, mode);

  if (cssMinChildWidth !== undefined) {
    simpleGridStyle["--nc-simple-grid-min-child-width"] = cssMinChildWidth;
  }

  if (cssGap !== undefined) {
    simpleGridStyle["--nc-simple-grid-gap"] = cssGap;
  }

  if (cssRowGap !== undefined) {
    simpleGridStyle["--nc-simple-grid-row-gap"] = cssRowGap;
  }

  if (cssColumnGap !== undefined) {
    simpleGridStyle["--nc-simple-grid-column-gap"] = cssColumnGap;
  }

  if (cssWidth !== undefined) {
    simpleGridStyle["--nc-simple-grid-width"] = cssWidth;
  }

  if (cssMinHeight !== undefined) {
    simpleGridStyle["--nc-simple-grid-min-height"] = cssMinHeight;
  }

  if (cssMaxWidth !== undefined) {
    simpleGridStyle["--nc-simple-grid-max-width"] = cssMaxWidth;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-simple-grid-root", className)}
      style={simpleGridStyle}
      data-align={align}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-grow={grow || undefined}
      data-inline={inline || undefined}
      data-justify={justify}
      data-mode={mode}
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
      <div className="nc-simple-grid__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});