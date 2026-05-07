import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { DividerProps, DividerStyle } from "./Divider.types";

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

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    label,
    orientation = "horizontal",
    labelPosition = "center",
    decorative = true,
    inset = false,
    thickness,
    length,
    variant = "surface",
    size = "md",
    radius = "none",
    tone = "neutral",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const dividerStyle: DividerStyle = { ...style };
  const cssThickness = toCssSize(thickness);
  const cssLength = toCssSize(length);
  const renderedLabel = label ?? children;

  if (cssThickness !== undefined) {
    dividerStyle["--nc-divider-thickness"] = cssThickness;
  }

  if (cssLength !== undefined) {
    dividerStyle["--nc-divider-length"] = cssLength;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-divider-root", className)}
      style={dividerStyle}
      role={decorative ? undefined : "separator"}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={decorative ? undefined : orientation}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-inset={inset || undefined}
      data-label-position={labelPosition}
      data-orientation={orientation}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: renderedLabel ? "labeled" : "plain"
      })}
      {...rest}
    >
      <span className="nc-divider__line" aria-hidden="true" {...ncSlot("line")} />

      {renderedLabel ? (
        <span className="nc-divider__label" {...ncSlot("label")}>
          {renderedLabel}
        </span>
      ) : null}

      {renderedLabel ? <span className="nc-divider__line" aria-hidden="true" {...ncSlot("line")} /> : null}
    </div>
  );
});