import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ContainerProps, ContainerStyle, NcContainerWidth } from "./Container.types";

const containerWidths: Record<NcContainerWidth, string> = {
  xs: "36rem",
  sm: "48rem",
  md: "64rem",
  lg: "80rem",
  xl: "96rem",
  full: "100%",
  fluid: "none"
};

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

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    containerWidth = "lg",
    width,
    maxWidth,
    minHeight,
    centered = true,
    bleed = false,
    padded = true,
    variant = "ghost",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const containerStyle: ContainerStyle = { ...style };
  const cssWidth = toCssSize(width);
  const cssMaxWidth = toCssSize(maxWidth) ?? containerWidths[containerWidth];
  const cssMinHeight = toCssSize(minHeight);

  if (cssWidth !== undefined) {
    containerStyle["--nc-container-width"] = cssWidth;
  }

  if (cssMaxWidth !== undefined) {
    containerStyle["--nc-container-max-width"] = cssMaxWidth;
  }

  if (cssMinHeight !== undefined) {
    containerStyle["--nc-container-min-height"] = cssMinHeight;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-container-root", className)}
      style={containerStyle}
      data-bleed={bleed || undefined}
      data-border={withBorder || undefined}
      data-centered={centered || undefined}
      data-container-width={containerWidth}
      data-full-width={fullWidth || undefined}
      data-padded={padded || undefined}
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
      <div className="nc-container__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});