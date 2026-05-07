import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SkeletonProps, SkeletonStyle } from "./Skeleton.types";

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

function normalizeLines(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 3;
  return Math.max(1, Math.min(12, Math.floor(value)));
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    loading = true,
    label = "Loading content",
    shape = "rect",
    animation = "shimmer",
    lines = 3,
    width,
    height,
    variant = "surface",
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

  const skeletonStyle: SkeletonStyle = { ...style };
  const normalizedLines = normalizeLines(lines);
  const cssWidth = toCssSize(width);
  const cssHeight = toCssSize(height);

  if (cssWidth !== undefined) {
    skeletonStyle["--nc-skeleton-width"] = cssWidth;
  }

  if (cssHeight !== undefined) {
    skeletonStyle["--nc-skeleton-height"] = cssHeight;
  }

  skeletonStyle["--nc-skeleton-lines"] = String(normalizedLines);

  if (!loading) {
    return (
      <div
        ref={(node) => assignRef(ref, node)}
        id={id}
        className={cx("nc-skeleton-root", className)}
        style={skeletonStyle}
        data-loading="false"
        data-full-width={fullWidth || undefined}
        {...ncSlot("root")}
        {...ncDataAttributes({
          variant,
          size,
          radius,
          tone,
          density,
          disabled,
          state: "loaded"
        })}
        {...rest}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-skeleton-root", className)}
      style={skeletonStyle}
      role="status"
      aria-label={label}
      aria-busy="true"
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-shape={shape}
      data-animation={animation}
      data-loading="true"
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: "loading"
      })}
      {...rest}
    >
      <span className="nc-skeleton__content" aria-hidden="true" {...ncSlot("content")}>
        {shape === "card" ? (
          <>
            <span className="nc-skeleton__media" {...ncSlot("media")} />
            <span className="nc-skeleton__body" {...ncSlot("body")}>
              {Array.from({ length: normalizedLines }, (_, index) => (
                <span key={index} className="nc-skeleton__line" data-index={index + 1} {...ncSlot("line")} />
              ))}
            </span>
          </>
        ) : null}

        {shape === "text" ? (
          Array.from({ length: normalizedLines }, (_, index) => (
            <span key={index} className="nc-skeleton__line" data-index={index + 1} {...ncSlot("line")} />
          ))
        ) : null}

        {shape !== "card" && shape !== "text" ? (
          <span className="nc-skeleton__line" data-index="1" {...ncSlot("line")} />
        ) : null}
      </span>
    </div>
  );
});