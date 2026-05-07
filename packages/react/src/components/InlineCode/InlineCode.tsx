import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { InlineCodeProps } from "./InlineCode.types";

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

export const InlineCode = forwardRef<HTMLElement, InlineCodeProps>(function InlineCode(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    prefix,
    suffix,
    language,
    title,
    variant = "surface",
    size = "md",
    radius = "sm",
    tone = "primary",
    density = "default",
    disabled,
    truncate = false,
    fullWidth = false,
    withBorder = true,
    id,
    style,
    ...rest
  } = props;

  const renderedValue = value ?? children;

  return (
    <code
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-inline-code-root", className)}
      style={style}
      title={title}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-truncate={truncate || undefined}
      data-language={language || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: renderedValue ? "filled" : "empty"
      })}
      {...rest}
    >
      {prefix ? (
        <span className="nc-inline-code__prefix" {...ncSlot("prefix")}>
          {prefix}
        </span>
      ) : null}

      <span className="nc-inline-code__value" {...ncSlot("value")}>
        {renderedValue}
      </span>

      {suffix ? (
        <span className="nc-inline-code__suffix" {...ncSlot("suffix")}>
          {suffix}
        </span>
      ) : null}

      {language ? (
        <span className="nc-inline-code__language" aria-hidden="true" {...ncSlot("language")}>
          {language}
        </span>
      ) : null}
    </code>
  );
});