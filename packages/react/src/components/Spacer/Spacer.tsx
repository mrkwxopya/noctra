import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SpacerProps, SpacerStyle } from "./Spacer.types";

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

function toFlexNumber(value: boolean | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value ? "1" : "0";
  if (!Number.isFinite(value)) return "0";
  return String(Math.max(0, value));
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(function Spacer(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    axis = "horizontal",
    space,
    inlineSize,
    blockSize,
    preset = "md",
    grow,
    shrink,
    decorative = true,
    variant = "ghost",
    size = "md",
    radius = "none",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = false,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const spacerStyle: SpacerStyle = { ...style };
  const cssSpace = toCssSize(space);
  const cssInlineSize = toCssSize(inlineSize);
  const cssBlockSize = toCssSize(blockSize);
  const cssGrow = toFlexNumber(grow);
  const cssShrink = toFlexNumber(shrink);

  if (cssSpace !== undefined) spacerStyle["--nc-spacer-space"] = cssSpace;
  if (cssInlineSize !== undefined) spacerStyle["--nc-spacer-inline-size"] = cssInlineSize;
  if (cssBlockSize !== undefined) spacerStyle["--nc-spacer-block-size"] = cssBlockSize;
  if (cssGrow !== undefined) spacerStyle["--nc-spacer-grow"] = cssGrow;
  if (cssShrink !== undefined) spacerStyle["--nc-spacer-shrink"] = cssShrink;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-spacer-root", className)}
      style={spacerStyle}
      aria-hidden={decorative && !children ? true : undefined}
      data-axis={axis}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-preset={preset}
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
      {children ? (
        <div className="nc-spacer__content" {...ncSlot("content")}>
          {children}
        </div>
      ) : null}
    </div>
  );
});