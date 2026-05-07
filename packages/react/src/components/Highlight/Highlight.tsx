import { forwardRef, useMemo } from "react";
import type { MutableRefObject, ReactElement, ReactNode, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { HighlightProps } from "./Highlight.types";

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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeQueries(query: string | string[] | undefined): string[] {
  const items = Array.isArray(query) ? query : query ? [query] : [];

  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function buildHighlightPattern(query: string | string[] | undefined, caseSensitive: boolean, wholeWords: boolean): RegExp | null {
  const queries = normalizeQueries(query);

  if (queries.length === 0) return null;

  const source = queries
    .sort((a, b) => b.length - a.length)
    .map((item) => escapeRegExp(item))
    .join("|");

  const wrappedSource = wholeWords ? `\\b(${source})\\b` : `(${source})`;
  const flags = caseSensitive ? "g" : "gi";

  return new RegExp(wrappedSource, flags);
}

function highlightText(value: string, pattern: RegExp | null, maxMatches: number | undefined): ReactNode[] {
  if (!pattern) return [value];

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let matchCount = 0;
  const normalizedMaxMatches = maxMatches !== undefined && Number.isFinite(maxMatches) ? Math.max(1, Math.floor(maxMatches)) : undefined;

  value.replace(pattern, (match, _group, offset: number) => {
    if (normalizedMaxMatches !== undefined && matchCount >= normalizedMaxMatches) return match;

    if (offset > lastIndex) {
      parts.push(value.slice(lastIndex, offset));
    }

    parts.push(
      <mark key={`${offset}-${matchCount}`} className="nc-highlight__match" {...ncSlot("match")}>
        {match}
      </mark>
    );

    lastIndex = offset + match.length;
    matchCount += 1;

    return match;
  });

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [value];
}

export const Highlight = forwardRef<HTMLElement, HighlightProps>(function Highlight(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    text,
    query,
    caseSensitive = false,
    wholeWords = false,
    maxMatches,
    emptyFallback = null,
    variant = "soft",
    size = "md",
    radius = "sm",
    tone = "warning",
    density = "default",
    disabled,
    fullWidth = false,
    withBorder = false,
    id,
    style,
    ...rest
  } = props;

  const textValue = text ?? (typeof children === "string" ? children : "");
  const pattern = useMemo(() => buildHighlightPattern(query, caseSensitive, wholeWords), [query, caseSensitive, wholeWords]);
  const highlightedContent = useMemo(() => highlightText(textValue, pattern, maxMatches), [textValue, pattern, maxMatches]);
  const hasText = textValue.length > 0;

  return (
    <span
      ref={(node) => assignRef(ref, node)}
      id={id}
      className={cx("nc-highlight-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-has-query={Boolean(pattern) || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasText ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasText ? (
        <span className="nc-highlight__text" {...ncSlot("text")}>
          {highlightedContent}
        </span>
      ) : (
        <span className="nc-highlight__empty" {...ncSlot("empty")}>
          {emptyFallback}
        </span>
      )}
    </span>
  );
});