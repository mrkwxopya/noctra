import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MutableRefObject, ReactElement, ReactNode } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TreeSelectNode, TreeSelectProps } from "./TreeSelect.types";

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

function toIdArray(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length > 0) return [value];
  return [];
}

function findNode(nodes: TreeSelectNode[], id: string): TreeSelectNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;

    const found = node.children?.length ? findNode(node.children, id) : null;
    if (found) return found;
  }

  return null;
}

function flattenNodes(nodes: TreeSelectNode[], expandedSet: Set<string>, output: TreeSelectNode[] = []): TreeSelectNode[] {
  for (const node of nodes) {
    output.push(node);

    if (node.children?.length && expandedSet.has(node.id)) {
      flattenNodes(node.children, expandedSet, output);
    }
  }

  return output;
}

function collectExpandableIds(nodes: TreeSelectNode[], query: string, output: string[] = []): string[] {
  const normalized = query.trim().toLowerCase();

  for (const node of nodes) {
    const childMatched = node.children?.some((child) => nodeMatches(child, normalized) || hasMatchingDescendant(child, normalized)) ?? false;

    if (childMatched) {
      output.push(node.id);
    }

    if (node.children?.length) {
      collectExpandableIds(node.children, query, output);
    }
  }

  return output;
}

function hasMatchingDescendant(node: TreeSelectNode, query: string): boolean {
  return node.children?.some((child) => nodeMatches(child, query) || hasMatchingDescendant(child, query)) ?? false;
}

function nodeMatches(node: TreeSelectNode, query: string): boolean {
  if (!query) return true;

  const text = [
    node.id,
    typeof node.label === "string" ? node.label : "",
    typeof node.description === "string" ? node.description : "",
    ...(node.keywords ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return text.includes(query);
}

function filterTree(nodes: TreeSelectNode[], query: string): TreeSelectNode[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) return nodes;

  const result: TreeSelectNode[] = [];

  for (const node of nodes) {
    const filteredChildren = node.children?.length ? filterTree(node.children, query) : [];
    const matched = nodeMatches(node, normalized);

    if (!matched && filteredChildren.length === 0) {
      continue;
    }

    const nextNode: TreeSelectNode = { ...node };

    if (filteredChildren.length > 0) {
      nextNode.children = filteredChildren;
    } else if (matched && node.children?.length) {
      nextNode.children = node.children;
    } else {
      delete nextNode.children;
    }

    result.push(nextNode);
  }

  return result;
}

function getNodeLabel(node: TreeSelectNode | null): string {
  if (!node) return "";
  return typeof node.label === "string" ? node.label : node.id;
}

function formatSelectedValue(nodes: TreeSelectNode[], selectedIds: string[], placeholder: string, mode: "single" | "multiple"): ReactNode {
  if (selectedIds.length === 0) return <span className="nc-tree-select__placeholder" {...ncSlot("placeholder")}>{placeholder}</span>;

  if (mode === "multiple") {
    return selectedIds
      .map((id) => getNodeLabel(findNode(nodes, id)))
      .filter(Boolean)
      .join(", ");
  }

  return getNodeLabel(findNode(nodes, selectedIds[0] ?? ""));
}

function findNextEnabledIndex(nodes: TreeSelectNode[], startIndex: number, direction: 1 | -1): number {
  if (nodes.length === 0) return -1;

  let cursor = startIndex;

  for (let index = 0; index < nodes.length; index += 1) {
    cursor = (cursor + direction + nodes.length) % nodes.length;

    if (!nodes[cursor]?.disabled) {
      return cursor;
    }
  }

  return -1;
}

const chevronIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const downIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

const checkIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.313a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.08l6.54-6.596a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

const folderIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2.75 5.75A2.75 2.75 0 0 1 5.5 3h2.086c.73 0 1.43.29 1.945.805l.664.665c.235.234.553.366.884.366H14.5a2.75 2.75 0 0 1 2.75 2.75v6.664A2.75 2.75 0 0 1 14.5 17h-9A2.75 2.75 0 0 1 2.75 14.25v-8.5Z" />
  </svg>
);

const fileIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.5 2.75A2.5 2.5 0 0 0 3 5.25v9.5a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5V8.914a2.5 2.5 0 0 0-.732-1.768l-3.414-3.414A2.5 2.5 0 0 0 11.086 3H5.5Zm6.25 1.81V7.5c0 .414.336.75.75.75h2.94L11.75 4.56Z" clipRule="evenodd" />
  </svg>
);

export const TreeSelect = forwardRef<HTMLDivElement, TreeSelectProps>(function TreeSelect(
  props,
  ref
): ReactElement {
  const {
    className,
    nodes,
    value,
    defaultValue = null,
    onValueChange,
    expandedIds,
    defaultExpandedIds = [],
    onExpandedIdsChange,
    label,
    description,
    error,
    placeholder = "Select item",
    searchPlaceholder = "Search tree",
    emptyMessage = "No items found",
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    placement = "bottom-start",
    disabled,
    readOnly,
    required,
    invalid,
    searchable = true,
    clearable = true,
    selectionMode = "single",
    allowParentSelect = true,
    expandOnNodeClick = true,
    closeOnSelect = true,
    openLabel = "Open tree select",
    clearLabel = "Clear selection",
    id,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const labelId = label ? `${rootId}-label` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const errorId = error ? `${rootId}-error` : undefined;
  const dropdownId = `${rootId}-dropdown`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const valueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | string[] | null>(defaultValue);
  const currentValue = valueControlled ? value : internalValue;
  const selectedIds = useMemo(() => toIdArray(currentValue), [currentValue]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const expandedControlled = expandedIds !== undefined;
  const [internalExpandedIds, setInternalExpandedIds] = useState(defaultExpandedIds);
  const currentExpandedIds = expandedControlled ? expandedIds : internalExpandedIds;

  const [opened, setOpened] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const isInvalid = invalid || Boolean(error);

  const queryExpandedIds = useMemo(() => collectExpandableIds(nodes, query), [nodes, query]);
  const expandedSet = useMemo(() => new Set([...currentExpandedIds, ...(query ? queryExpandedIds : [])]), [currentExpandedIds, query, queryExpandedIds]);
  const filteredNodes = useMemo(() => filterTree(nodes, query), [nodes, query]);
  const visibleNodes = useMemo(() => flattenNodes(filteredNodes, expandedSet), [expandedSet, filteredNodes]);
  const hasSelection = selectedIds.length > 0;

  function commitExpanded(nextIds: string[]): void {
    if (!expandedControlled) {
      setInternalExpandedIds(nextIds);
    }

    onExpandedIdsChange?.(nextIds);
  }

  function toggleExpanded(node: TreeSelectNode): void {
    if (disabled || readOnly || node.disabled || !node.children?.length) return;

    const next = new Set(currentExpandedIds);

    if (next.has(node.id)) {
      next.delete(node.id);
    } else {
      next.add(node.id);
    }

    commitExpanded(Array.from(next));
  }

  function commitValue(nextValue: string | string[] | null, node: TreeSelectNode | null): void {
    if (!valueControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue, node);
  }

  function selectNode(node: TreeSelectNode): void {
    if (disabled || readOnly || node.disabled) return;
    if (node.selectable === false) return;
    if (!allowParentSelect && node.children?.length) return;

    if (selectionMode === "multiple") {
      const next = new Set(selectedIds);

      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }

      commitValue(Array.from(next), node);
      return;
    }

    commitValue(node.id, node);

    if (closeOnSelect) {
      setOpened(false);
      setQuery("");
    }
  }

  function handleNodeClick(node: TreeSelectNode): void {
    if (expandOnNodeClick && node.children?.length) {
      toggleExpanded(node);
    }

    selectNode(node);
  }

  function clearValue(): void {
    commitValue(selectionMode === "multiple" ? [] : null, null);
    setQuery("");
  }

  function openDropdown(): void {
    if (disabled || readOnly) return;

    setOpened(true);
    window.requestAnimationFrame(() => searchRef.current?.focus());
  }

  function closeDropdown(): void {
    setOpened(false);
    setQuery("");
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    setQuery(event.currentTarget.value);
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    if (!opened && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      openDropdown();
      return;
    }

    if (!opened) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(visibleNodes, activeIndex, 1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-node-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(visibleNodes, activeIndex, -1);
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
        document.getElementById(`${rootId}-node-${nextIndex}`)?.scrollIntoView({ block: "nearest" });
      }
      return;
    }

    const activeNode = visibleNodes[activeIndex];

    if (!activeNode) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (activeNode.children?.length && !expandedSet.has(activeNode.id)) {
        toggleExpanded(activeNode);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (activeNode.children?.length && expandedSet.has(activeNode.id)) {
        toggleExpanded(activeNode);
      }
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleNodeClick(activeNode);
    }
  }

  function renderNodes(treeNodes: TreeSelectNode[], level: number): ReactElement {
    return (
      <ul className={level === 1 ? "nc-tree-select__tree" : "nc-tree-select__children"} role={level === 1 ? "tree" : "group"} {...ncSlot(level === 1 ? "tree" : "children")}>
        {treeNodes.map((node) => {
          const hasChildren = Boolean(node.children?.length);
          const expanded = expandedSet.has(node.id);
          const selected = selectedSet.has(node.id);
          const itemIndex = visibleNodes.indexOf(node);
          const active = itemIndex === activeIndex;
          const nodeTone = node.tone ?? tone;

          return (
            <li key={node.id} className="nc-tree-select__item" role="none" data-level={level} data-expanded={expanded || undefined} data-selected={selected || undefined} data-disabled={node.disabled || undefined} data-tone={nodeTone} {...ncSlot("item")}>
              <div
                id={`${rootId}-node-${itemIndex}`}
                className="nc-tree-select__row"
                role="treeitem"
                aria-level={level}
                aria-expanded={hasChildren ? expanded : undefined}
                aria-selected={selected}
                aria-disabled={node.disabled || undefined}
                data-active={active || undefined}
                data-selected={selected || undefined}
                onMouseEnter={() => setActiveIndex(Math.max(itemIndex, 0))}
                onClick={() => handleNodeClick(node)}
                {...ncSlot("row")}
              >
                <button
                  type="button"
                  className="nc-tree-select__toggle"
                  tabIndex={-1}
                  aria-label={expanded ? "Collapse" : "Expand"}
                  aria-hidden={!hasChildren}
                  disabled={!hasChildren || disabled || readOnly || node.disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleExpanded(node);
                  }}
                  {...ncSlot("toggle")}
                >
                  <span className="nc-tree-select__chevron" aria-hidden="true" {...ncSlot("chevron")}>
                    {chevronIcon}
                  </span>
                </button>

                <span className="nc-tree-select__icon" aria-hidden="true" {...ncSlot("icon")}>
                  {selected ? checkIcon : node.icon ?? (hasChildren ? folderIcon : fileIcon)}
                </span>

                <span className="nc-tree-select__content" {...ncSlot("content")}>
                  <span className="nc-tree-select__node-label" {...ncSlot("node-label")}>
                    {node.label}
                  </span>

                  {node.description ? (
                    <span className="nc-tree-select__node-description" {...ncSlot("node-description")}>
                      {node.description}
                    </span>
                  ) : null}
                </span>

                {node.badge ? (
                  <span className="nc-tree-select__badge" {...ncSlot("badge")}>
                    {node.badge}
                  </span>
                ) : null}
              </div>

              {hasChildren && expanded ? renderNodes(node.children ?? [], level + 1) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  useEffect(() => {
    if (!opened) return;

    function handleDocumentPointerDown(event: PointerEvent): void {
      if (!rootRef.current?.contains(event.target as Node | null)) {
        closeDropdown();
      }
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    return () => document.removeEventListener("pointerdown", handleDocumentPointerDown);
  }, [opened]);

  useEffect(() => {
    const firstEnabled = visibleNodes.findIndex((node) => !node.disabled);
    setActiveIndex(firstEnabled >= 0 ? firstEnabled : 0);
  }, [visibleNodes]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={rootId}
      className={cx("nc-tree-select-root", className)}
      data-placement={placement}
      data-readonly={readOnly || undefined}
      data-selection-mode={selectionMode}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        invalid: isInvalid,
        expanded: opened,
        state: hasSelection ? "filled" : "empty"
      })}
      {...rest}
    >
      {label ? (
        <label id={labelId} className="nc-tree-select__label" {...ncSlot("label")}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      ) : null}

      {description ? (
        <div id={descriptionId} className="nc-tree-select__description" {...ncSlot("description")}>
          {description}
        </div>
      ) : null}

      <div className="nc-tree-select__control" role="combobox" aria-expanded={opened} aria-controls={opened ? dropdownId : undefined} aria-labelledby={labelId} aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined} aria-invalid={isInvalid || undefined} tabIndex={disabled ? -1 : 0} onClick={openDropdown} {...ncSlot("control")}>
        <div className="nc-tree-select__value" {...ncSlot("value")}>
          {formatSelectedValue(nodes, selectedIds, placeholder, selectionMode)}
        </div>

        {clearable && hasSelection && !disabled && !readOnly ? (
          <button
            type="button"
            className="nc-tree-select__clear-button"
            aria-label={clearLabel}
            onClick={(event) => {
              event.stopPropagation();
              clearValue();
            }}
            {...ncSlot("clear-button")}
          >
            {clearIcon}
          </button>
        ) : null}

        <button
          type="button"
          className="nc-tree-select__toggle-button"
          aria-label={openLabel}
          aria-haspopup="tree"
          aria-expanded={opened}
          disabled={disabled || readOnly}
          onClick={(event) => {
            event.stopPropagation();
            if (opened) {
              closeDropdown();
            } else {
              openDropdown();
            }
          }}
          {...ncSlot("toggle-button")}
        >
          {downIcon}
        </button>
      </div>

      {opened ? (
        <div id={dropdownId} className="nc-tree-select__dropdown" {...ncSlot("dropdown")}>
          {searchable ? (
            <input
              ref={searchRef}
              className="nc-tree-select__search"
              value={query}
              placeholder={searchPlaceholder}
              disabled={disabled}
              onChange={handleSearchChange}
              {...ncSlot("search")}
            />
          ) : null}

          {filteredNodes.length > 0 ? renderNodes(filteredNodes, 1) : (
            <div className="nc-tree-select__empty" {...ncSlot("empty")}>
              {emptyMessage}
            </div>
          )}
        </div>
      ) : null}

      {error ? (
        <div id={errorId} className="nc-tree-select__error" role="alert" {...ncSlot("error")}>
          {error}
        </div>
      ) : null}
    </div>
  );
});