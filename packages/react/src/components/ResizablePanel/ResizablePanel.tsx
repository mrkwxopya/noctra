import { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, PointerEvent as ReactPointerEvent, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type {
  NcResizablePanelOrientation,
  ResizableHandleProps,
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizablePanelStyle
} from "./ResizablePanel.types";

interface DragState {
  index: number;
  startPosition: number;
  containerSize: number;
  startSizes: number[];
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

function normalizeSizes(values: number[] | undefined, count: number): number[] {
  if (count <= 0) return [];

  const fallback = 100 / count;
  const raw = Array.from({ length: count }, (_, index) => {
    const value = values?.[index];
    return Number.isFinite(value) && value !== undefined ? Math.max(value, 0) : fallback;
  });

  const total = raw.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return raw.map(() => fallback);
  }

  return raw.map((value) => (value / total) * 100);
}

function getPointerPosition(event: PointerEvent | ReactPointerEvent, orientation: NcResizablePanelOrientation): number {
  return orientation === "horizontal" ? event.clientX : event.clientY;
}

function getContainerSize(node: HTMLDivElement | null, orientation: NcResizablePanelOrientation): number {
  if (!node) return 0;

  const rect = node.getBoundingClientRect();
  return orientation === "horizontal" ? rect.width : rect.height;
}

function toCssSize(value: number | undefined): string | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  return `${value}%`;
}

export const ResizableHandle = forwardRef<HTMLButtonElement, ResizableHandleProps>(function ResizableHandle(
  props,
  ref
): ReactElement {
  const {
    className,
    disabled,
    orientation = "horizontal",
    label = "Resize panel",
    active,
    ...rest
  } = props;

  return (
    <button
      ref={(node) => assignRef(ref, node)}
      type="button"
      className={cx("nc-resizable-panel__handle", className)}
      aria-label={label}
      aria-orientation={orientation}
      disabled={disabled}
      data-orientation={orientation}
      data-active={active || undefined}
      {...ncSlot("handle")}
      {...rest}
    >
      <span className="nc-resizable-panel__handle-hitbox" aria-hidden="true" {...ncSlot("handle-hitbox")} />
    </button>
  );
});

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(function ResizablePanel(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    defaultSize,
    size,
    minSize,
    maxSize,
    collapsed,
    collapsible = false,
    order,
    padded = false,
    scrollable = true,
    style,
    ...rest
  } = props;

  const panelStyle: ResizablePanelStyle = { ...style };
  const resolvedSize = collapsed ? 0 : size ?? defaultSize;
  const panelSize = toCssSize(resolvedSize);
  const panelMinSize = toCssSize(minSize);
  const panelMaxSize = toCssSize(maxSize);

  if (panelSize !== undefined) panelStyle["--nc-resizable-panel-size"] = panelSize;
  if (panelMinSize !== undefined) panelStyle["--nc-resizable-panel-min-size"] = panelMinSize;
  if (panelMaxSize !== undefined) panelStyle["--nc-resizable-panel-max-size"] = panelMaxSize;
  if (order !== undefined) panelStyle["--nc-resizable-panel-order"] = String(order);

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-resizable-panel", className)}
      style={panelStyle}
      data-collapsed={collapsed || undefined}
      data-collapsible={collapsible || undefined}
      data-padded={padded || undefined}
      data-scrollable={scrollable || undefined}
      {...ncSlot("panel")}
      {...rest}
    >
      {children}
    </div>
  );
});

export const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(function ResizablePanelGroup(
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
    defaultSizes,
    sizes,
    minSize = 8,
    maxSize = 92,
    resizeMode = "live",
    onSizesChange,
    onSizesCommit,
    resizable = true,
    withBorder = true,
    fullWidth = true,
    fullHeight = false,
    handleLabel = "Resize panels",
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const childItems = Children.toArray(children);
  const panelCount = childItems.length;
  const controlled = sizes !== undefined;
  const [internalSizes, setInternalSizes] = useState(() => normalizeSizes(defaultSizes, panelCount));
  const [activeHandle, setActiveHandle] = useState<number | null>(null);
  const currentSizes = useMemo(
    () => normalizeSizes(controlled ? sizes : internalSizes, panelCount),
    [controlled, internalSizes, panelCount, sizes]
  );
  const min = clamp(minSize, 0, 100);
  const max = clamp(maxSize, min, 100);

  function commitSizes(nextSizes: number[], finalCommit: boolean): void {
    const normalized = normalizeSizes(nextSizes, panelCount);

    if (!controlled) {
      setInternalSizes(normalized);
    }

    if (resizeMode === "live" || finalCommit) {
      onSizesChange?.(normalized);
    }

    if (finalCommit) {
      onSizesCommit?.(normalized);
    }
  }

  function resizePair(index: number, deltaPercent: number): number[] {
    const nextSizes = [...currentSizes];
    const left = nextSizes[index] ?? 0;
    const right = nextSizes[index + 1] ?? 0;
    const pairTotal = left + right;
    const nextLeft = clamp(left + deltaPercent, min, Math.min(max, pairTotal - min));
    const nextRight = pairTotal - nextLeft;

    nextSizes[index] = nextLeft;
    nextSizes[index + 1] = nextRight;

    return nextSizes;
  }

  function handlePointerDown(index: number, event: ReactPointerEvent<HTMLButtonElement>): void {
    if (disabled || !resizable || panelCount < 2) return;

    const containerSize = getContainerSize(rootRef.current, orientation);
    if (containerSize <= 0) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragStateRef.current = {
      index,
      startPosition: getPointerPosition(event, orientation),
      containerSize,
      startSizes: currentSizes
    };

    setActiveHandle(index);
  }

  useEffect(() => {
    if (activeHandle === null) return;

    function handlePointerMove(event: PointerEvent): void {
      const state = dragStateRef.current;
      if (!state) return;

      const delta = getPointerPosition(event, orientation) - state.startPosition;
      const deltaPercent = (delta / state.containerSize) * 100;
      const nextSizes = [...state.startSizes];
      const left = nextSizes[state.index] ?? 0;
      const right = nextSizes[state.index + 1] ?? 0;
      const pairTotal = left + right;
      const nextLeft = clamp(left + deltaPercent, min, Math.min(max, pairTotal - min));

      nextSizes[state.index] = nextLeft;
      nextSizes[state.index + 1] = pairTotal - nextLeft;

      if (resizeMode === "live") {
        commitSizes(nextSizes, false);
      } else if (!controlled) {
        setInternalSizes(normalizeSizes(nextSizes, panelCount));
      }
    }

    function handlePointerUp(): void {
      const state = dragStateRef.current;
      const nextSizes = state ? normalizeSizes(controlled ? currentSizes : internalSizes, panelCount) : currentSizes;

      commitSizes(nextSizes, true);
      dragStateRef.current = null;
      setActiveHandle(null);
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activeHandle, controlled, currentSizes, internalSizes, max, min, orientation, panelCount, resizeMode]);

  useEffect(() => {
    if (panelCount !== internalSizes.length && !controlled) {
      setInternalSizes(normalizeSizes(defaultSizes, panelCount));
    }
  }, [controlled, defaultSizes, internalSizes.length, panelCount]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        assignRef(ref, node);
      }}
      className={cx("nc-resizable-panel-group", className)}
      data-orientation={orientation}
      data-resizable={resizable || undefined}
      data-dragging={activeHandle !== null || undefined}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-full-height={fullHeight || undefined}
      {...ncSlot("group")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: panelCount > 0 ? "filled" : "empty"
      })}
      {...rest}
    >
      {childItems.map((child, index) => {
        const panelSize = currentSizes[index] ?? (panelCount > 0 ? 100 / panelCount : 100);
        const panel = isValidElement<ResizablePanelProps>(child)
          ? cloneElement(child, {
              size: panelSize,
              minSize: child.props.minSize ?? min,
              maxSize: child.props.maxSize ?? max
            })
          : (
              <ResizablePanel size={panelSize} minSize={min} maxSize={max}>
                {child}
              </ResizablePanel>
            );

        return (
          <div className="nc-resizable-panel__segment" key={`resizable-panel-segment-${index}`}>
            {panel}

            {index < childItems.length - 1 ? (
              <ResizableHandle
                orientation={orientation}
                label={handleLabel}
                disabled={disabled || !resizable}
                active={activeHandle === index}
                onPointerDown={(event) => handlePointerDown(index, event)}
                onKeyDown={(event) => {
                  if (disabled || !resizable) return;

                  const step = event.shiftKey ? 10 : 2;

                  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    event.preventDefault();
                    commitSizes(resizePair(index, -step), true);
                  }

                  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                    event.preventDefault();
                    commitSizes(resizePair(index, step), true);
                  }
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
});