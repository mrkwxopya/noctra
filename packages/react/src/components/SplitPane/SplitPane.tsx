import { Children, forwardRef, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MutableRefObject, PointerEvent as ReactPointerEvent, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { NcSplitPaneOrientation, SplitPaneProps, SplitPaneStyle } from "./SplitPane.types";

interface ResizeState {
  startPosition: number;
  startSize: number;
  containerSize: number;
}

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeSize(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return clamp(value, 0, 100);
}

function getPointerPosition(event: PointerEvent | ReactPointerEvent, orientation: NcSplitPaneOrientation): number {
  return orientation === "horizontal" ? event.clientX : event.clientY;
}

function getContainerSize(node: HTMLDivElement | null, orientation: NcSplitPaneOrientation): number {
  if (!node) return 0;

  const rect = node.getBoundingClientRect();
  return orientation === "horizontal" ? rect.width : rect.height;
}

export const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(function SplitPane(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    orientation = "horizontal",
    defaultSize = 50,
    sizeValue,
    minSize = 12,
    maxSize = 88,
    resizeMode = "live",
    onSizeChange,
    onSizeCommit,
    resizable = true,
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    collapseThreshold = 6,
    withBorder = true,
    fullWidth = true,
    fullHeight = false,
    handleLabel = "Resize panes",
    style,
    id,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const controlledSize = sizeValue !== undefined;
  const controlledCollapsed = collapsed !== undefined;
  const [internalSize, setInternalSize] = useState(() => normalizeSize(defaultSize, 50));
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [dragging, setDragging] = useState(false);
  const currentSize = normalizeSize(controlledSize ? sizeValue : internalSize, 50);
  const isCollapsed = controlledCollapsed ? collapsed : internalCollapsed;
  const childItems = Children.toArray(children);
  const primary = childItems[0] ?? null;
  const secondary = childItems.length > 1 ? childItems.slice(1) : null;
  const min = clamp(minSize, 0, 100);
  const max = clamp(maxSize, min, 100);

  const splitPaneStyle: SplitPaneStyle = { ...style };
  splitPaneStyle["--nc-split-pane-size"] = `${isCollapsed ? 0 : currentSize}%`;
  splitPaneStyle["--nc-split-pane-min-size"] = `${min}%`;
  splitPaneStyle["--nc-split-pane-max-size"] = `${max}%`;

  function commitSize(nextSize: number, finalCommit: boolean): void {
    const normalized = clamp(nextSize, min, max);

    if (!controlledSize) {
      setInternalSize(normalized);
    }

    if (resizeMode === "live" || finalCommit) {
      onSizeChange?.(normalized);
    }

    if (finalCommit) {
      onSizeCommit?.(normalized);
    }

    const nextCollapsed = normalized <= collapseThreshold;

    if (!controlledCollapsed) {
      setInternalCollapsed(nextCollapsed);
    }

    onCollapsedChange?.(nextCollapsed);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>): void {
    if (disabled || !resizable) return;

    const containerSize = getContainerSize(rootRef.current, orientation);
    if (containerSize <= 0) return;

    event.preventDefault();

    resizeStateRef.current = {
      startPosition: getPointerPosition(event, orientation),
      startSize: currentSize,
      containerSize
    };

    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLDivElement>);

    if (event.defaultPrevented || disabled || !resizable) return;

    const step = event.shiftKey ? 10 : 2;
    const directionMultiplier = orientation === "horizontal" ? 1 : -1;

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      commitSize(currentSize - step * directionMultiplier, true);
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      commitSize(currentSize + step * directionMultiplier, true);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      commitSize(min, true);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      commitSize(max, true);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      const nextCollapsed = !isCollapsed;

      if (!controlledCollapsed) {
        setInternalCollapsed(nextCollapsed);
      }

      onCollapsedChange?.(nextCollapsed);
    }
  }

  useEffect(() => {
    if (!dragging) return;

    function handlePointerMove(event: PointerEvent): void {
      const state = resizeStateRef.current;
      if (!state) return;

      const delta = getPointerPosition(event, orientation) - state.startPosition;
      const deltaPercent = (delta / state.containerSize) * 100;
      const nextSize = orientation === "horizontal" ? state.startSize + deltaPercent : state.startSize + deltaPercent;

      if (resizeMode === "live") {
        commitSize(nextSize, false);
      } else if (!controlledSize) {
        setInternalSize(clamp(nextSize, min, max));
      }
    }

    function handlePointerUp(): void {
      const state = resizeStateRef.current;

      if (state) {
        const finalSize = controlledSize ? currentSize : internalSize;
        commitSize(finalSize, true);
      }

      resizeStateRef.current = null;
      setDragging(false);
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [controlledSize, currentSize, dragging, internalSize, max, min, orientation, resizeMode]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      id={rootId}
      className={cx("nc-split-pane-root", className)}
      style={splitPaneStyle}
      data-orientation={orientation}
      data-resizable={resizable || undefined}
      data-dragging={dragging || undefined}
      data-collapsed={isCollapsed || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-full-height={fullHeight || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: childItems.length > 0 ? "filled" : "empty"
      })}
      {...rest}
    >
      <section className="nc-split-pane__pane nc-split-pane__primary" aria-labelledby={`${rootId}-primary`} {...ncSlot("primary")}>
        <span id={`${rootId}-primary`} hidden>
          Primary pane
        </span>
        {primary}
      </section>

      <button
        type="button"
        className="nc-split-pane__handle"
        aria-label={handleLabel}
        aria-orientation={orientation}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(currentSize)}
        disabled={disabled || !resizable}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        {...ncSlot("handle")}
      >
        <span className="nc-split-pane__handle-hitbox" aria-hidden="true" {...ncSlot("handle-hitbox")} />
      </button>

      <section className="nc-split-pane__pane nc-split-pane__secondary" aria-labelledby={`${rootId}-secondary`} {...ncSlot("secondary")}>
        <span id={`${rootId}-secondary`} hidden>
          Secondary pane
        </span>
        {secondary}
      </section>
    </div>
  );
});