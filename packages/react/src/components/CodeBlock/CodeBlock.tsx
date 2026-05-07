import { forwardRef, useEffect, useMemo, useState } from "react";
import type { MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CodeBlockProps, CodeBlockStyle } from "./CodeBlock.types";

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

async function copyToClipboard(value: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard API is not available.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    const copied = document.execCommand("copy");

    if (!copied) {
      throw new Error("Copy command failed.");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

function normalizeStartLine(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
}

function toCssSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

const copyIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M6.5 2.5A2.5 2.5 0 0 0 4 5v8a.75.75 0 0 0 1.5 0V5a1 1 0 0 1 1-1h7a.75.75 0 0 0 0-1.5h-7Z" />
    <path d="M8 6.5A2.5 2.5 0 0 1 10.5 4h4A2.5 2.5 0 0 1 17 6.5v7A2.5 2.5 0 0 1 14.5 16h-4A2.5 2.5 0 0 1 8 13.5v-7Zm2.5-1A1 1 0 0 0 9.5 6.5v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-4Z" />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    code,
    title,
    description,
    language,
    filename,
    meta,
    footer,
    copyLabel = "Copy",
    copiedLabel = "Copied",
    copyText,
    onCopied,
    onCopyError,
    showCopy = true,
    showLineNumbers = false,
    startLine = 1,
    highlightedLines = [],
    maxHeight,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    fullWidth = true,
    withBorder = true,
    preProps,
    codeProps,
    buttonProps,
    id,
    style,
    ...rest
  } = props;

  const [copied, setCopied] = useState(false);
  const normalizedStartLine = normalizeStartLine(startLine);
  const rawCode = code ?? (typeof children === "string" ? children : "");
  const lines = useMemo(() => rawCode.replace(/\n$/, "").split("\n"), [rawCode]);
  const highlightSet = useMemo(() => new Set(highlightedLines), [highlightedLines]);
  const codeBlockStyle: CodeBlockStyle = { ...style };
  const cssMaxHeight = toCssSize(maxHeight);
  const hasHeader = Boolean(title || description || filename || language || meta || showCopy);
  const hasCodeString = rawCode.length > 0;
  const valueToCopy = copyText ?? rawCode;

  if (cssMaxHeight !== undefined) {
    codeBlockStyle["--nc-code-block-max-height"] = cssMaxHeight;
  }

  async function handleCopy(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    buttonProps?.onClick?.(event);

    if (event.defaultPrevented || disabled || !valueToCopy) return;

    try {
      await copyToClipboard(valueToCopy);
      setCopied(true);
      onCopied?.(valueToCopy);
    } catch (copyError) {
      setCopied(false);
      onCopyError?.(copyError);
    }
  }

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => {
      setCopied(false);
    }, 1600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copied]);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-code-block-root", className)}
      style={codeBlockStyle}
      data-border={withBorder || undefined}
      data-copied={copied || undefined}
      data-full-width={fullWidth || undefined}
      data-line-numbers={showLineNumbers || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: copied ? "copied" : hasCodeString ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-code-block__header" {...ncSlot("header")}>
          <div className="nc-code-block__header-main">
            {title ? (
              <div className="nc-code-block__title" {...ncSlot("title")}>
                {title}
              </div>
            ) : null}

            {description ? (
              <div className="nc-code-block__description" {...ncSlot("description")}>
                {description}
              </div>
            ) : null}

            {filename ? (
              <div className="nc-code-block__filename" {...ncSlot("filename")}>
                {filename}
              </div>
            ) : null}
          </div>

          <div className="nc-code-block__header-actions">
            {language ? (
              <span className="nc-code-block__language" {...ncSlot("language")}>
                {language}
              </span>
            ) : null}

            {meta ? (
              <span className="nc-code-block__meta" {...ncSlot("meta")}>
                {meta}
              </span>
            ) : null}

            {showCopy ? (
              <button
                {...buttonProps}
                type="button"
                className={cx("nc-code-block__copy", buttonProps?.className)}
                disabled={disabled || buttonProps?.disabled || !valueToCopy}
                aria-live="polite"
                onClick={handleCopy}
                {...ncSlot("copy")}
              >
                <span className="nc-code-block__copy-icon" aria-hidden="true" {...ncSlot("copy-icon")}>
                  {copied ? checkIcon : copyIcon}
                </span>
                <span>{copied ? copiedLabel : copyLabel}</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="nc-code-block__body" {...ncSlot("body")}>
        <pre {...preProps} className={cx("nc-code-block__pre", preProps?.className)} {...ncSlot("pre")}>
          <code {...codeProps} className={cx("nc-code-block__code", language ? `language-${language}` : undefined, codeProps?.className)} {...ncSlot("code")}>
            {showLineNumbers ? (
              lines.map((line, index) => {
                const lineNumber = normalizedStartLine + index;
                const highlighted = highlightSet.has(lineNumber) || highlightSet.has(index + 1);

                return (
                  <span key={lineNumber} className="nc-code-block__line" data-highlighted={highlighted || undefined} {...ncSlot("line")}>
                    <span className="nc-code-block__line-number" aria-hidden="true" {...ncSlot("line-number")}>
                      {lineNumber}
                    </span>
                    <span className="nc-code-block__line-content" {...ncSlot("line-content")}>
                      {line || " "}
                    </span>
                  </span>
                );
              })
            ) : (
              children ?? code
            )}
          </code>
        </pre>
      </div>

      {footer ? (
        <div className="nc-code-block__footer" {...ncSlot("footer")}>
          {footer}
        </div>
      ) : null}
    </div>
  );
});