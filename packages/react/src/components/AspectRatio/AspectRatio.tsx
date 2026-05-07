import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { AspectRatioProps, AspectRatioStyle, NcAspectRatioPreset } from "./AspectRatio.types";

const presetRatios: Record<NcAspectRatioPreset, string> = {
  square: "1 / 1",
  video: "16 / 9",
  wide: "21 / 9",
  ultrawide: "32 / 9",
  portrait: "3 / 4",
  golden: "1.618 / 1"
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

function normalizeRatio(value: number | string | undefined, preset: NcAspectRatioPreset | undefined): string {
  if (preset) return presetRatios[preset];

  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return `${value} / 1`;
  }

  if (typeof value === "string" && value.trim()) {
    const normalizedValue = value.trim();

    if (normalizedValue.includes("/")) return normalizedValue;

    const parsed = Number.parseFloat(normalizedValue);

    if (Number.isFinite(parsed) && parsed > 0) {
      return `${parsed} / 1`;
    }
  }

  return presetRatios.video;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    ratio,
    preset,
    fit = "cover",
    width,
    minHeight,
    maxHeight,
    variant = "surface",
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

  const aspectRatioStyle: AspectRatioStyle = { ...style };
  const cssWidth = toCssSize(width);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxHeight = toCssSize(maxHeight);

  aspectRatioStyle["--nc-aspect-ratio"] = normalizeRatio(ratio, preset);

  if (cssWidth !== undefined) {
    aspectRatioStyle["--nc-aspect-ratio-width"] = cssWidth;
  }

  if (cssMinHeight !== undefined) {
    aspectRatioStyle["--nc-aspect-ratio-min-height"] = cssMinHeight;
  }

  if (cssMaxHeight !== undefined) {
    aspectRatioStyle["--nc-aspect-ratio-max-height"] = cssMaxHeight;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-aspect-ratio-root", className)}
      style={aspectRatioStyle}
      data-border={withBorder || undefined}
      data-fit={fit}
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
      <div className="nc-aspect-ratio__content" {...ncSlot("content")}>
        {children}
      </div>
    </div>
  );
});