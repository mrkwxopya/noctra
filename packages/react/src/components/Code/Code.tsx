import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, ReactNode } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CodeBlockProps, CodeProps } from "./Code.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null): void {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
}

function normalizeCode(code: string): string[] {
  return code.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

function renderNodeAsCode(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  return "";
}

export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    variant = "surface",
    size = "md",
    radius = "sm",
    tone = "primary",
    density = "default",
    ...rest
  } = props;

  return (
    <code
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-code-root", className)}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        state: children ? "filled" : "empty"
      })}
      {...rest}
    >
      {children}
    </code>
  );
});

export const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(function CodeBlock(
  props,
  ref
): ReactElement {
  const {
    className,
    code,
    children,
    language,
    label,
    description,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    withHeader = Boolean(label || description || language),
    withLineNumbers = false,
    wrap = false,
    highlightedLines = [],
    ...rest
  } = props;

  const rawCode = code ?? renderNodeAsCode(children);
  const lines = normalizeCode(rawCode);
  const highlighted = new Set(highlightedLines);
  const hasHeader = Boolean(withHeader && (label || description || language));

  return (
    <div
      className={cx("nc-code-block", className)}
      {...ncSlot("block")}
      data-wrap={wrap || undefined}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        state: rawCode ? "filled" : "empty"
      })}
    >
      {hasHeader ? (
        <div className="nc-code-block__header" {...ncSlot("header")}>
          <div className="nc-code-block__meta">
            {label ? (
              <div className="nc-code-block__label" {...ncSlot("label")}>
                {label}
              </div>
            ) : null}

            {description ? (
              <div className="nc-code-block__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}
          </div>

          {language ? <span className="nc-code-block__language">{language}</span> : null}
        </div>
      ) : null}

      <pre
        ref={(node) => assignRef(ref, node)}
        className="nc-code-block__body"
        {...ncSlot("body")}
        {...rest}
      >
        <code className="nc-code-block__code">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlighted.has(lineNumber);

            return (
              <span
                key={lineNumber}
                className="nc-code-block__line"
                data-highlighted={isHighlighted || undefined}
                {...ncSlot("line")}
              >
                {withLineNumbers ? (
                  <span className="nc-code-block__line-number" aria-hidden="true" {...ncSlot("line-number")}>
                    {lineNumber}
                  </span>
                ) : null}

                <span className="nc-code-block__line-content" {...ncSlot("line-content")}>
                  {line || "\n"}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
});