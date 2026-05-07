import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { LoaderProps } from "./Loader.types";

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

function getAccessibleLabel(label: LoaderProps["label"], ariaLabel: string | undefined): string {
  if (ariaLabel) return ariaLabel;
  if (typeof label === "string" && label.trim()) return label;
  return "Loading";
}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(function Loader(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    label,
    description,
    ariaLabel,
    type = "spinner",
    labelPosition = "right",
    variant = "ghost",
    size = "md",
    radius = "full",
    tone = "primary",
    density = "default",
    disabled,
    centered = false,
    fullWidth = false,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const hasContent = Boolean(label || description || children);
  const accessibleLabel = getAccessibleLabel(label, ariaLabel);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-loader-root", className)}
      style={style}
      role="status"
      aria-live="polite"
      aria-label={accessibleLabel}
      data-border={withBorder || undefined}
      data-centered={centered || undefined}
      data-full-width={fullWidth || undefined}
      data-label-position={labelPosition}
      data-type={type}
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
      <span className="nc-loader__indicator" aria-hidden="true" {...ncSlot("indicator")}>
        {type === "spinner" ? <span className="nc-loader__spinner" {...ncSlot("spinner")} /> : null}

        {type === "ring" ? <span className="nc-loader__ring" {...ncSlot("ring")} /> : null}

        {type === "dots" ? (
          <>
            <span className="nc-loader__dot" data-index="1" {...ncSlot("dot")} />
            <span className="nc-loader__dot" data-index="2" {...ncSlot("dot")} />
            <span className="nc-loader__dot" data-index="3" {...ncSlot("dot")} />
          </>
        ) : null}

        {type === "bars" ? (
          <>
            <span className="nc-loader__bar" data-index="1" {...ncSlot("bar")} />
            <span className="nc-loader__bar" data-index="2" {...ncSlot("bar")} />
            <span className="nc-loader__bar" data-index="3" {...ncSlot("bar")} />
          </>
        ) : null}

        {type === "pulse" ? (
          <>
            <span className="nc-loader__dot" data-index="1" {...ncSlot("dot")} />
            <span className="nc-loader__ring" {...ncSlot("ring")} />
          </>
        ) : null}
      </span>

      {hasContent && labelPosition !== "none" ? (
        <span className="nc-loader__content" {...ncSlot("content")}>
          {label ? (
            <span className="nc-loader__label" {...ncSlot("label")}>
              {label}
            </span>
          ) : null}

          {description ? (
            <span className="nc-loader__description" {...ncSlot("description")}>
              {description}
            </span>
          ) : null}

          {children}
        </span>
      ) : null}
    </div>
  );
});