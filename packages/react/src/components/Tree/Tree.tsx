import { forwardRef, useMemo, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TreeNode, TreeProps } from "./Tree.types";

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

function collectVisibleIds(nodes: TreeNode[], expandedSet: Set<string>, output: string[] = []): string[] {
  for (const node of nodes) {
    output.push(node.id);

    if (node.children?.length && expandedSet.has(node.id)) {
      collectVisibleIds(node.children, expandedSet, output);
    }
  }

  return output;
}

function findNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;

    const child = node.children?.length ? findNode(node.children, id) : undefined;
    if (child) return child;
  }

  return undefined;
}

const chevronIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 0 1-1.06-1.06L11.94 10 7.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
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

export const Tree = forwardRef<HTMLDivElement, TreeProps>(function Tree(
  props,
  ref
): ReactElement {
  const {
    className,
    nodes,
    heading,
    description,
    emptyMessage = "No tree items",
    expandedIds,
    defaultExpandedIds = [],
    onExpandedIdsChange,
    selectedIds,
    defaultSelectedIds = [],
    onSelectedIdsChange,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    selectionMode = "single",
    allowParentSelect = true,
    expandOnNodeClick = true,
    showGuides = true,
    onKeyDown,
    ...rest
  } = props;

  const expandedControlled = expandedIds !== undefined;
  const [internalExpandedIds, setInternalExpandedIds] = useState(defaultExpandedIds);
  const currentExpandedIds = expandedControlled ? expandedIds : internalExpandedIds;
  const expandedSet = useMemo(() => new Set(currentExpandedIds), [currentExpandedIds]);

  const selectedControlled = selectedIds !== undefined;
  const [internalSelectedIds, setInternalSelectedIds] = useState(defaultSelectedIds);
  const currentSelectedIds = selectedControlled ? selectedIds : internalSelectedIds;
  const selectedSet = useMemo(() => new Set(currentSelectedIds), [currentSelectedIds]);

  const visibleIds = useMemo(() => collectVisibleIds(nodes, expandedSet), [nodes, expandedSet]);
  const hasHeader = Boolean(heading || description);
  const hasNodes = nodes.length > 0;

  function commitExpanded(nextIds: string[]): void {
    if (!expandedControlled) {
      setInternalExpandedIds(nextIds);
    }

    onExpandedIdsChange?.(nextIds);
  }

  function toggleExpanded(node: TreeNode): void {
    if (disabled || node.disabled || !node.children?.length) return;

    const next = new Set(currentExpandedIds);

    if (next.has(node.id)) {
      next.delete(node.id);
    } else {
      next.add(node.id);
    }

    commitExpanded(Array.from(next));
  }

  function commitSelected(nextIds: string[], node: TreeNode): void {
    if (!selectedControlled) {
      setInternalSelectedIds(nextIds);
    }

    onSelectedIdsChange?.(nextIds, node);
  }

  function selectNode(node: TreeNode): void {
    if (disabled || node.disabled) return;
    if (node.selectable === false) return;
    if (!allowParentSelect && node.children?.length) return;

    if (selectionMode === "multiple") {
      const next = new Set(currentSelectedIds);

      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }

      commitSelected(Array.from(next), node);
      return;
    }

    commitSelected([node.id], node);
  }

  function handleNodeClick(node: TreeNode): void {
    if (expandOnNodeClick && node.children?.length) {
      toggleExpanded(node);
    }

    selectNode(node);
  }

  function focusNode(id: string): void {
    document.querySelector<HTMLElement>(`[data-tree-node-id="${CSS.escape(id)}"]`)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) return;

    const active = document.activeElement as HTMLElement | null;
    const activeId = active?.getAttribute("data-tree-node-id");

    if (!activeId) return;

    const currentIndex = visibleIds.indexOf(activeId);
    const node = findNode(nodes, activeId);

    if (!node) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusNode(visibleIds[Math.min(currentIndex + 1, visibleIds.length - 1)] ?? activeId);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusNode(visibleIds[Math.max(currentIndex - 1, 0)] ?? activeId);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();

      if (node.children?.length && !expandedSet.has(node.id)) {
        toggleExpanded(node);
      } else if (node.children?.length) {
        focusNode(node.children[0]?.id ?? node.id);
      }

      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      if (node.children?.length && expandedSet.has(node.id)) {
        toggleExpanded(node);
      }

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNodeClick(node);
    }
  }

  function renderNodes(treeNodes: TreeNode[], level: number): ReactElement {
    return (
      <ul className={level === 1 ? "nc-tree__list" : "nc-tree__children"} role={level === 1 ? "tree" : "group"} {...ncSlot(level === 1 ? "list" : "children")}>
        {treeNodes.map((node) => {
          const hasChildren = Boolean(node.children?.length);
          const expanded = expandedSet.has(node.id);
          const selected = selectedSet.has(node.id);
          const nodeTone = node.tone ?? tone;

          return (
            <li
              key={node.id}
              className="nc-tree__item"
              role="none"
              data-level={level}
              data-expanded={expanded || undefined}
              data-selected={selected || undefined}
              data-disabled={node.disabled || undefined}
              data-tone={nodeTone}
              {...ncSlot("item")}
            >
              <div
                className="nc-tree__row"
                role="treeitem"
                tabIndex={visibleIds[0] === node.id ? 0 : -1}
                aria-level={level}
                aria-expanded={hasChildren ? expanded : undefined}
                aria-selected={selected}
                aria-disabled={node.disabled || undefined}
                data-tree-node-id={node.id}
                data-selected={selected || undefined}
                onClick={() => handleNodeClick(node)}
                {...ncSlot("row")}
              >
                <button
                  type="button"
                  className="nc-tree__toggle"
                  tabIndex={-1}
                  aria-label={expanded ? "Collapse" : "Expand"}
                  aria-hidden={!hasChildren}
                  disabled={!hasChildren || disabled || node.disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleExpanded(node);
                  }}
                  {...ncSlot("toggle")}
                >
                  <span className="nc-tree__chevron" aria-hidden="true" {...ncSlot("chevron")}>
                    {chevronIcon}
                  </span>
                </button>

                <span className="nc-tree__icon" aria-hidden="true" {...ncSlot("icon")}>
                  {node.icon ?? (hasChildren ? folderIcon : fileIcon)}
                </span>

                <span className="nc-tree__content" {...ncSlot("content")}>
                  <span className="nc-tree__label" {...ncSlot("label")}>
                    {node.label}
                  </span>

                  {node.description ? (
                    <span className="nc-tree__node-description" {...ncSlot("node-description")}>
                      {node.description}
                    </span>
                  ) : null}
                </span>

                {node.badge ? (
                  <span className="nc-tree__badge" {...ncSlot("badge")}>
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

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-tree-root", className)}
      data-guides={showGuides || undefined}
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
        state: hasNodes ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-tree__header" {...ncSlot("header")}>
          {heading ? (
            <div className="nc-tree__heading" {...ncSlot("heading")}>
              {heading}
            </div>
          ) : null}

          {description ? (
            <div className="nc-tree__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      {hasNodes ? renderNodes(nodes, 1) : (
        <div className="nc-tree__empty" {...ncSlot("empty")}>
          {emptyMessage}
        </div>
      )}
    </div>
  );
});