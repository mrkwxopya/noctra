import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ScrollAreaProps, ScrollAreaStyle } from "./ScrollArea.types";

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

function toCssValue(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}px`;
  return value;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    variant = "ghost",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    scrollbar = "auto",
    overscroll = "contain",
    maxHeight,
    maxWidth,
    height,
    width,
    padded = false,
    withBorder = false,
    fullWidth = true,
    fullHeight = false,
    horizontal = true,
    vertical = true,
    scrollPadding,
    style,
    ...rest
  } = props;

  const scrollAreaStyle: ScrollAreaStyle = { ...style };
  const nextMaxHeight = toCssValue(maxHeight);
  const nextMaxWidth = toCssValue(maxWidth);
  const nextHeight = toCssValue(height);
  const nextWidth = toCssValue(width);
  const nextPadding = toCssValue(scrollPadding);

  if (nextMaxHeight !== undefined) scrollAreaStyle["--nc-scroll-area-max-height"] = nextMaxHeight;
  if (nextMaxWidth !== undefined) scrollAreaStyle["--nc-scroll-area-max-width"] = nextMaxWidth;
  if (nextHeight !== undefined) scrollAreaStyle["--nc-scroll-area-height"] = nextHeight;
  if (nextWidth !== undefined) scrollAreaStyle["--nc-scroll-area-width"] = nextWidth;
  if (nextPadding !== undefined) scrollAreaStyle["--nc-scroll-area-padding"] = nextPadding;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-scroll-area-root", className)}
      style={scrollAreaStyle}
      data-scrollbar={scrollbar}
      data-overscroll={overscroll}
      data-horizontal={horizontal || undefined}
      data-vertical={vertical || undefined}
      data-padded={padded || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-full-height={fullHeight || undefined}
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
      <div className="nc-scroll-area__viewport" {...ncSlot("viewport")}>
        <div className="nc-scroll-area__content" {...ncSlot("content")}>
          {children}
        </div>
      </div>
    </div>
  );
});