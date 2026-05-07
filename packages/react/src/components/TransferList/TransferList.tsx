import { forwardRef, useId, useMemo, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TransferListItem, TransferListProps, TransferListStyle } from "./TransferList.types";

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

function normalizeValues(value: string[] | undefined): string[] {
  if (!value) return [];
  return Array.from(new Set(value.filter(Boolean)));
}

function includesQuery(item: TransferListItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  const labelText = typeof item.label === "string" ? item.label : "";
  const descriptionText = typeof item.description === "string" ? item.description : "";
  const haystack = [item.value, labelText, descriptionText, ...(item.keywords ?? [])].join(" ").toLowerCase();

  return haystack.includes(normalizedQuery);
}

function getMovableValues(items: TransferListItem[]): string[] {
  return items.filter((item) => !item.disabled).map((item) => item.value);
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

const arrowRightIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M3.25 10a.75.75 0 0 1 .75-.75h9.19l-3.47-3.47a.75.75 0 1 1 1.06-1.06l4.75 4.75a.75.75 0 0 1 0 1.06l-4.75 4.75a.75.75 0 1 1-1.06-1.06l3.47-3.47H4a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

const arrowLeftIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75H6.81l3.47 3.47a.75.75 0 1 1-1.06 1.06l-4.75-4.75a.75.75 0 0 1 0-1.06l4.75-4.75a.75.75 0 1 1 1.06 1.06L6.81 9.25H16a.75.75 0 0 1 .75.75Z" clipRule="evenodd" />
  </svg>
);

const doubleRightIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2.97 4.72a.75.75 0 0 1 1.06 0l4.75 4.75a.75.75 0 0 1 0 1.06l-4.75 4.75a.75.75 0 0 1-1.06-1.06L7.19 10 2.97 5.78a.75.75 0 0 1 0-1.06Z" />
    <path d="M10.97 4.72a.75.75 0 0 1 1.06 0l4.75 4.75a.75.75 0 0 1 0 1.06l-4.75 4.75a.75.75 0 1 1-1.06-1.06L15.19 10l-4.22-4.22a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const doubleLeftIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M17.03 4.72a.75.75 0 0 0-1.06 0l-4.75 4.75a.75.75 0 0 0 0 1.06l4.75 4.75a.75.75 0 1 0 1.06-1.06L12.81 10l4.22-4.22a.75.75 0 0 0 0-1.06Z" />
    <path d="M9.03 4.72a.75.75 0 0 0-1.06 0L3.22 9.47a.75.75 0 0 0 0 1.06l4.75 4.75a.75.75 0 1 0 1.06-1.06L4.81 10l4.22-4.22a.75.75 0 0 0 0-1.06Z" />
  </svg>
);

export const TransferList = forwardRef<HTMLDivElement, TransferListProps>(function TransferList(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue,
    onValueChange,
    data = [],
    labels,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    searchable = true,
    maxHeight = 280,
    fullWidth = true,
    withBorder = true,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const labelId = label ? `${rootId}-label` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(() => normalizeValues(defaultValue));
  const [selectedSourceValues, setSelectedSourceValues] = useState<string[]>([]);
  const [selectedTargetValues, setSelectedTargetValues] = useState<string[]>([]);
  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const targetValues = normalizeValues(isControlled ? value : internalValue);
  const targetValueSet = new Set(targetValues);
  const sourceItems = useMemo(() => data.filter((item) => !targetValueSet.has(item.value)), [data, targetValueSet]);
  const targetItems = useMemo(() => data.filter((item) => targetValueSet.has(item.value)), [data, targetValueSet]);
  const visibleSourceItems = useMemo(() => sourceItems.filter((item) => includesQuery(item, sourceSearch)), [sourceItems, sourceSearch]);
  const visibleTargetItems = useMemo(() => targetItems.filter((item) => includesQuery(item, targetSearch)), [targetItems, targetSearch]);
  const transferListStyle: TransferListStyle = { ...style };
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  transferListStyle["--nc-transfer-list-max-height"] = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

  function setTargetValues(nextValues: string[]): void {
    const normalizedNextValues = normalizeValues(nextValues);

    if (!isControlled) {
      setInternalValue(normalizedNextValues);
    }

    onValueChange?.(normalizedNextValues);
  }

  function moveToTarget(valuesToMove: string[]): void {
    if (disabled || readOnly) return;

    const movableValues = new Set(getMovableValues(sourceItems));
    const nextValues = [...targetValues, ...valuesToMove.filter((item) => movableValues.has(item))];

    setTargetValues(nextValues);
    setSelectedSourceValues([]);
  }

  function moveToSource(valuesToMove: string[]): void {
    if (disabled || readOnly) return;

    const movableValues = new Set(getMovableValues(targetItems));
    const removeValueSet = new Set(valuesToMove.filter((item) => movableValues.has(item)));
    const nextValues = targetValues.filter((item) => !removeValueSet.has(item));

    setTargetValues(nextValues);
    setSelectedTargetValues([]);
  }

  function toggleSourceItem(item: TransferListItem): void {
    if (disabled || readOnly || item.disabled) return;
    setSelectedSourceValues((current) => toggleValue(current, item.value));
  }

  function toggleTargetItem(item: TransferListItem): void {
    if (disabled || readOnly || item.disabled) return;
    setSelectedTargetValues((current) => toggleValue(current, item.value));
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLButtonElement>, item: TransferListItem, side: "source" | "target"): void {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();

    if (side === "source") {
      toggleSourceItem(item);
      return;
    }

    toggleTargetItem(item);
  }

  function renderItem(item: TransferListItem, side: "source" | "target"): ReactElement {
    const selected = side === "source" ? selectedSourceValues.includes(item.value) : selectedTargetValues.includes(item.value);
    const onToggle = side === "source" ? toggleSourceItem : toggleTargetItem;

    return (
      <button
        key={`${side}-${item.value}`}
        type="button"
        className="nc-transfer-list__item"
        aria-pressed={selected}
        disabled={disabled || item.disabled}
        data-selected={selected || undefined}
        data-disabled={item.disabled || undefined}
        onClick={() => onToggle(item)}
        onKeyDown={(event) => handleItemKeyDown(event, item, side)}
        {...ncSlot("item")}
      >
        {item.icon ? (
          <span className="nc-transfer-list__item-icon" aria-hidden="true" {...ncSlot("item-icon")}>
            {item.icon}
          </span>
        ) : null}

        <span className="nc-transfer-list__item-content" {...ncSlot("item-content")}>
          <span className="nc-transfer-list__item-label" {...ncSlot("item-label")}>
            {item.label}
          </span>

          {item.description ? (
            <span className="nc-transfer-list__item-description" {...ncSlot("item-description")}>
              {item.description}
            </span>
          ) : null}
        </span>

        {item.badge ? (
          <span className="nc-transfer-list__item-badge" {...ncSlot("item-badge")}>
            {item.badge}
          </span>
        ) : null}
      </button>
    );
  }

  function renderPanel(side: "source" | "target"): ReactElement {
    const isSource = side === "source";
    const title = isSource ? labels?.source ?? "Available" : labels?.target ?? "Selected";
    const searchValue = isSource ? sourceSearch : targetSearch;
    const visibleItems = isSource ? visibleSourceItems : visibleTargetItems;
    const emptyMessage = isSource ? labels?.sourceEmpty ?? "No available items" : labels?.targetEmpty ?? "No selected items";
    const searchPlaceholder = isSource ? labels?.searchSource ?? "Search available..." : labels?.searchTarget ?? "Search selected...";

    return (
      <section className="nc-transfer-list__panel" aria-label={typeof title === "string" ? title : undefined} {...ncSlot("panel")}>
        <div className="nc-transfer-list__panel-header" {...ncSlot("panel-header")}>
          <span className="nc-transfer-list__panel-title" {...ncSlot("panel-title")}>
            {title}
          </span>
          <span className="nc-transfer-list__panel-count" {...ncSlot("panel-count")}>
            {visibleItems.length}
          </span>
        </div>

        {searchable ? (
          <input
            className="nc-transfer-list__search"
            type="search"
            value={searchValue}
            placeholder={searchPlaceholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-label={searchPlaceholder}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (isSource) {
                setSourceSearch(event.currentTarget.value);
                return;
              }

              setTargetSearch(event.currentTarget.value);
            }}
            {...ncSlot("search")}
          />
        ) : null}

        <div className="nc-transfer-list__list" role="list" {...ncSlot("list")}>
          {visibleItems.length > 0 ? visibleItems.map((item) => renderItem(item, side)) : (
            <div className="nc-transfer-list__empty" {...ncSlot("empty")}>
              {emptyMessage}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-transfer-list-root", className)}
      style={transferListStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: targetValues.length > 0 ? "selected" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-transfer-list__header">
          {label ? (
            <div id={labelId} className="nc-transfer-list__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-transfer-list__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-transfer-list__layout" aria-labelledby={labelId} aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined} {...ncSlot("layout")}>
        {renderPanel("source")}

        <div className="nc-transfer-list__actions" {...ncSlot("actions")}>
          <button type="button" className="nc-transfer-list__action" aria-label={labels?.moveAllToTarget ?? "Move all to selected"} disabled={disabled || readOnly || getMovableValues(sourceItems).length === 0} onClick={() => moveToTarget(getMovableValues(sourceItems))} {...ncSlot("action")}>
            {doubleRightIcon}
          </button>

          <button type="button" className="nc-transfer-list__action" aria-label={labels?.moveSelectedToTarget ?? "Move selected to selected"} disabled={disabled || readOnly || selectedSourceValues.length === 0} onClick={() => moveToTarget(selectedSourceValues)} {...ncSlot("action")}>
            {arrowRightIcon}
          </button>

          <button type="button" className="nc-transfer-list__action" aria-label={labels?.moveSelectedToSource ?? "Move selected to available"} disabled={disabled || readOnly || selectedTargetValues.length === 0} onClick={() => moveToSource(selectedTargetValues)} {...ncSlot("action")}>
            {arrowLeftIcon}
          </button>

          <button type="button" className="nc-transfer-list__action" aria-label={labels?.moveAllToSource ?? "Move all to available"} disabled={disabled || readOnly || getMovableValues(targetItems).length === 0} onClick={() => moveToSource(getMovableValues(targetItems))} {...ncSlot("action")}>
            {doubleLeftIcon}
          </button>
        </div>

        {renderPanel("target")}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-transfer-list__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});