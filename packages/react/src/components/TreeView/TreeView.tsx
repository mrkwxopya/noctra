import { forwardRef, useId, useMemo, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TreeViewItem, TreeViewProps, TreeViewStyle, TreeViewValue } from "./TreeView.types";

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

function normalizeArray(value: string[] | undefined): string[] {
  return Array.from(new Set((value ?? []).filter(Boolean)));
}

function normalizeValue(value: TreeViewValue | undefined, mode: "single" | "multiple"): string[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return mode === "multiple" ? normalizeArray(value) : normalizeArray(value).slice(0, 1);
  return value ? [value] : [];
}

function serializeValue(value: string[], mode: "single" | "multiple"): TreeViewValue {
  if (mode === "multiple") return normalizeArray(value);
  return value[0] ?? null;
}

function getAllExpandableValues(items: TreeViewItem[]): string[] {
  return items.flatMap((item) => {
    const children = item.children ?? [];
    return children.length > 0 ? [item.value, ...getAllExpandableValues(children)] : [];
  });
}

function includesQuery(item: TreeViewItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  const labelText = typeof item.label === "string" ? item.label : "";
  const descriptionText = typeof item.description === "string" ? item.description : "";
  const haystack = [item.value, labelText, descriptionText, ...(item.keywords ?? [])].join(" ").toLowerCase();

  return haystack.includes(normalizedQuery);
}

function filterTree(items: TreeViewItem[], query: string): TreeViewItem[] {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return items;

  const nextItems: TreeViewItem[] = [];

  items.forEach((item) => {
    const children = filterTree(item.children ?? [], normalizedQuery);
    const matches = includesQuery(item, normalizedQuery);

    if (!matches && children.length === 0) return;

    nextItems.push(children.length > 0 ? { ...item, children } : item);
  });

  return nextItems;
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

const chevronIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(function TreeView(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    data = [],
    value,
    defaultValue = null,
    onValueChange,
    expanded,
    defaultExpanded,
    onExpandedChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    emptyMessage = "No tree items found",
    searchPlaceholder = "Search tree...",
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    searchable = false,
    selectionMode = "single",
    expandOnSelect = true,
    defaultExpandAll = false,
    maxHeight = 320,
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
  const isValueControlled = value !== undefined;
  const isExpandedControlled = expanded !== undefined;
  const initialExpanded = defaultExpandAll ? getAllExpandableValues(data) : normalizeArray(defaultExpanded);
  const [internalValue, setInternalValue] = useState<string[]>(() => normalizeValue(defaultValue, selectionMode));
  const [internalExpanded, setInternalExpanded] = useState<string[]>(initialExpanded);
  const [searchValue, setSearchValue] = useState("");
  const selectedValues = normalizeValue(isValueControlled ? value : internalValue, selectionMode);
  const selectedValueSet = new Set(selectedValues);
  const expandedValues = normalizeArray(isExpandedControlled ? expanded : internalExpanded);
  const expandedValueSet = new Set(expandedValues);
  const visibleItems = useMemo(() => filterTree(data, searchValue), [data, searchValue]);
  const treeViewStyle: TreeViewStyle = { ...style };
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  treeViewStyle["--nc-tree-view-max-height"] = typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

  function setSelectedValues(nextValues: string[]): void {
    const normalizedValues = selectionMode === "multiple" ? normalizeArray(nextValues) : normalizeArray(nextValues).slice(0, 1);

    if (!isValueControlled) {
      setInternalValue(normalizedValues);
    }

    onValueChange?.(serializeValue(normalizedValues, selectionMode));
  }

  function setExpandedValues(nextValues: string[]): void {
    const normalizedValues = normalizeArray(nextValues);

    if (!isExpandedControlled) {
      setInternalExpanded(normalizedValues);
    }

    onExpandedChange?.(normalizedValues);
  }

  function toggleExpanded(item: TreeViewItem): void {
    if (disabled || item.disabled) return;
    setExpandedValues(toggleValue(expandedValues, item.value));
  }

  function selectItem(item: TreeViewItem): void {
    if (disabled || readOnly || item.disabled) return;

    if (selectionMode === "multiple") {
      setSelectedValues(toggleValue(selectedValues, item.value));
    } else {
      setSelectedValues([item.value]);
    }

    if (expandOnSelect && item.children && item.children.length > 0 && !expandedValueSet.has(item.value)) {
      setExpandedValues([...expandedValues, item.value]);
    }
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLButtonElement>, item: TreeViewItem): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectItem(item);
      return;
    }

    if (event.key === "ArrowRight" && item.children && item.children.length > 0) {
      event.preventDefault();

      if (!expandedValueSet.has(item.value)) {
        setExpandedValues([...expandedValues, item.value]);
      }

      return;
    }

    if (event.key === "ArrowLeft" && item.children && item.children.length > 0) {
      event.preventDefault();

      if (expandedValueSet.has(item.value)) {
        setExpandedValues(expandedValues.filter((valueItem) => valueItem !== item.value));
      }
    }
  }

  function renderItems(items: TreeViewItem[], level: number): ReactElement[] {
    return items.map((item) => {
      const childItems = item.children ?? [];
      const hasChildren = childItems.length > 0;
      const expandedState = expandedValueSet.has(item.value) || Boolean(searchValue.trim());
      const selected = selectedValueSet.has(item.value);

      return (
        <div key={item.value} className="nc-tree-view__branch" role="none" data-level={level} {...ncSlot("branch")}>
          <button
            type="button"
            className="nc-tree-view__item"
            role="treeitem"
            aria-selected={selected}
            aria-expanded={hasChildren ? expandedState : undefined}
            aria-level={level + 1}
            disabled={disabled || item.disabled}
            data-selected={selected || undefined}
            data-disabled={item.disabled || undefined}
            data-has-children={hasChildren || undefined}
            onClick={() => selectItem(item)}
            onKeyDown={(event) => handleItemKeyDown(event, item)}
            {...ncSlot("item")}
          >
            <span
              className="nc-tree-view__toggle"
              aria-hidden="true"
              data-hidden={!hasChildren || undefined}
              onClick={(event) => {
                event.stopPropagation();
                toggleExpanded(item);
              }}
              {...ncSlot("toggle")}
            >
              {chevronIcon}
            </span>

            {item.icon ? (
              <span className="nc-tree-view__item-icon" aria-hidden="true" {...ncSlot("item-icon")}>
                {item.icon}
              </span>
            ) : null}

            <span className="nc-tree-view__item-content" {...ncSlot("item-content")}>
              <span className="nc-tree-view__item-label" {...ncSlot("item-label")}>
                {item.label}
              </span>

              {item.description ? (
                <span className="nc-tree-view__item-description" {...ncSlot("item-description")}>
                  {item.description}
                </span>
              ) : null}
            </span>

            {item.badge ? (
              <span className="nc-tree-view__item-badge" {...ncSlot("item-badge")}>
                {item.badge}
              </span>
            ) : null}

            <span className="nc-tree-view__check" aria-hidden="true" {...ncSlot("check")}>
              {checkIcon}
            </span>
          </button>

          {hasChildren && expandedState ? (
            <div className="nc-tree-view__children" role="group" {...ncSlot("children")}>
              {renderItems(childItems, level + 1)}
            </div>
          ) : null}
        </div>
      );
    });
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    setSearchValue(event.currentTarget.value);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-tree-view-root", className)}
      style={treeViewStyle}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-selection-mode={selectionMode}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: selectedValues.length > 0 ? "selected" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-tree-view__header">
          {label ? (
            <div id={labelId} className="nc-tree-view__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-tree-view__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      {searchable ? (
        <input
          className="nc-tree-view__search"
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={searchPlaceholder}
          onChange={handleSearchChange}
          {...ncSlot("search")}
        />
      ) : null}

      <div
        className="nc-tree-view__tree"
        role="tree"
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        aria-multiselectable={selectionMode === "multiple" || undefined}
        aria-disabled={disabled || undefined}
        {...ncSlot("tree")}
      >
        {visibleItems.length > 0 ? renderItems(visibleItems, 0) : (
          <div className="nc-tree-view__empty" {...ncSlot("empty")}>
            {emptyMessage}
          </div>
        )}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-tree-view__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});