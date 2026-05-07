import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NcPaperPadding, PaperProps, PaperStyle } from "./Paper.types";

const paperPaddingMap: Record<NcPaperPadding, string> = {
  none: "0",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.5rem"
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

function toPaperPadding(value: NcPaperPadding | number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}px`;

  return value in paperPaddingMap ? paperPaddingMap[value as NcPaperPadding] : value;
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(function Paper(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    header,
    footer,
    aside,
    padding,
    shadow = "sm",
    interactive = false,
    selected = false,
    muted = false,
    width,
    minHeight,
    maxWidth,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = false,
    withBorder = true,
    id,
    style,
    ...rest
  } = props;

  const paperStyle: PaperStyle = { ...style };
  const cssPadding = toPaperPadding(padding);
  const cssWidth = toCssSize(width);
  const cssMinHeight = toCssSize(minHeight);
  const cssMaxWidth = toCssSize(maxWidth);

  if (cssPadding !== undefined) {
    paperStyle["--nc-paper-padding"] = cssPadding;
  }

  if (cssWidth !== undefined) {
    paperStyle["--nc-paper-width"] = cssWidth;
  }

  if (cssMinHeight !== undefined) {
    paperStyle["--nc-paper-min-height"] = cssMinHeight;
  }

  if (cssMaxWidth !== undefined) {
    paperStyle["--nc-paper-max-width"] = cssMaxWidth;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-paper-root", className)}
      style={paperStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-has-aside={Boolean(aside) || undefined}
      data-interactive={interactive || undefined}
      data-muted={muted || undefined}
      data-selected={selected || undefined}
      data-shadow={shadow}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: selected ? "selected" : children ? "filled" : "empty"
      })}
      {...rest}
    >
      {header ? (
        <div className="nc-paper__header" {...ncSlot("header")}>
          {header}
        </div>
      ) : null}

      <div className="nc-paper__layout" {...ncSlot("layout")}>
        <div className="nc-paper__content" {...ncSlot("content")}>
          {children}
        </div>

        {aside ? (
          <div className="nc-paper__aside" {...ncSlot("aside")}>
            {aside}
          </div>
        ) : null}
      </div>

      {footer ? (
        <div className="nc-paper__footer" {...ncSlot("footer")}>
          {footer}
        </div>
      ) : null}
    </div>
  );
});