import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import type {
  KeyboardEvent,
  MutableRefObject,
  ReactElement,
  Ref
} from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type {
  NcTabsActivationMode,
  NcTabsOrientation,
  TabsListProps,
  TabsPanelProps,
  TabsProps,
  TabsTabProps
} from "./Tabs.types";

interface TabsContextValue {
  rootId: string;
  value: string | undefined;
  setValue: (value: string) => void;
  disabled: boolean;
  orientation: NcTabsOrientation;
  activationMode: NcTabsActivationMode;
  keepMounted: boolean;
  loop: boolean;
  registerTab: (value: string, node: HTMLButtonElement | null) => void;
  getTabs: () => Array<{ value: string; node: HTMLButtonElement }>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

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

function useTabsContext(componentName: string): TabsContextValue {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Tabs`);
  }

  return context;
}

function toJustify(value: TabsListProps["justify"]): string | undefined {
  if (value === "between") return "space-between";
  if (value === "around") return "space-around";
  if (value === "evenly") return "space-evenly";
  return value;
}

function getNextIndex(currentIndex: number, length: number, direction: 1 | -1, loop: boolean): number {
  if (length <= 0) return -1;

  const nextIndex = currentIndex + direction;

  if (nextIndex < 0) {
    return loop ? length - 1 : 0;
  }

  if (nextIndex >= length) {
    return loop ? 0 : length - 1;
  }

  return nextIndex;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue,
    onValueChange,
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled = false,
    orientation = "horizontal",
    placement = "top",
    activationMode = "automatic",
    keepMounted = false,
    loop = true,
    withBorder = true,
    fullWidth = true,
    ariaLabel,
    id,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  function setValue(nextValue: string): void {
    if (disabled) return;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  const context = useMemo<TabsContextValue>(() => {
    return {
      rootId,
      value: currentValue,
      setValue,
      disabled,
      orientation,
      activationMode,
      keepMounted,
      loop,
      registerTab: (tabValue, node) => {
        if (node) {
          tabRefs.current.set(tabValue, node);
          return;
        }

        tabRefs.current.delete(tabValue);
      },
      getTabs: () => {
        return Array.from(tabRefs.current.entries()).map(([tabValue, node]) => ({ value: tabValue, node }));
      }
    };
  }, [activationMode, currentValue, disabled, keepMounted, loop, orientation, rootId]);

  return (
    <TabsContext.Provider value={context}>
      <div
        ref={(node) => assignRef(ref, node)}
        id={rootId}
        className={cx("nc-tabs-root", className)}
        data-orientation={orientation}
        data-placement={placement}
        data-border={withBorder || undefined}
        data-full-width={fullWidth || undefined}
        aria-label={ariaLabel}
        {...ncSlot("root")}
        {...ncDataAttributes({
          variant,
          size,
          radius,
          tone,
          density,
          disabled,
          state: currentValue ? "selected" : "idle"
        })}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    justify = "start",
    grow = false,
    wrap = false,
    sticky = false,
    onKeyDown,
    ...rest
  } = props;

  const context = useTabsContext("TabsList");

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || context.disabled) return;

    const tabs = context.getTabs().filter((item) => !item.node.disabled);
    const activeIndex = Math.max(
      tabs.findIndex((item) => item.value === context.value),
      0
    );

    const isHorizontal = context.orientation === "horizontal";
    const previousKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

    if (event.key === previousKey || event.key === nextKey) {
      event.preventDefault();

      const direction = event.key === nextKey ? 1 : -1;
      const nextIndex = getNextIndex(activeIndex, tabs.length, direction, context.loop);
      const nextTab = tabs[nextIndex];

      if (nextTab) {
        nextTab.node.focus();

        if (context.activationMode === "automatic") {
          context.setValue(nextTab.value);
        }
      }

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();

      const firstTab = tabs[0];

      if (firstTab) {
        firstTab.node.focus();

        if (context.activationMode === "automatic") {
          context.setValue(firstTab.value);
        }
      }

      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      const lastTab = tabs[tabs.length - 1];

      if (lastTab) {
        lastTab.node.focus();

        if (context.activationMode === "automatic") {
          context.setValue(lastTab.value);
        }
      }
    }
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-tabs__list", className)}
      role="tablist"
      aria-orientation={context.orientation}
      data-justify={toJustify(justify)}
      data-grow={grow || undefined}
      data-wrap={wrap || undefined}
      data-sticky={sticky || undefined}
      onKeyDown={handleKeyDown}
      {...ncSlot("list")}
      {...rest}
    >
      {children}
    </div>
  );
});

export const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(function TabsTab(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    label,
    icon,
    rightSection,
    badge,
    description,
    disabled,
    tone,
    onClick,
    ...rest
  } = props;

  const context = useTabsContext("TabsTab");
  const selected = context.value === value;
  const isDisabled = context.disabled || Boolean(disabled);
  const tabId = `${context.rootId}-tab-${value}`;
  const panelId = `${context.rootId}-panel-${value}`;

  return (
    <button
      ref={(node) => {
        context.registerTab(value, node);
        assignRef(ref, node);
      }}
      id={tabId}
      type="button"
      role="tab"
      className={cx("nc-tabs__tab", className)}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected || context.value === undefined ? 0 : -1}
      disabled={isDisabled}
      data-active={selected || undefined}
      data-tone={tone}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !isDisabled) {
          context.setValue(value);
        }
      }}
      {...ncSlot("tab")}
      {...rest}
    >
      {icon ? (
        <span className="nc-tabs__tab-icon" aria-hidden="true" {...ncSlot("tab-icon")}>
          {icon}
        </span>
      ) : null}

      <span className="nc-tabs__tab-content" {...ncSlot("tab-content")}>
        <span className="nc-tabs__tab-label" {...ncSlot("tab-label")}>
          {label ?? children}
        </span>

        {description ? (
          <span className="nc-tabs__tab-description" {...ncSlot("tab-description")}>
            {description}
          </span>
        ) : null}
      </span>

      {badge ? (
        <span className="nc-tabs__tab-badge" {...ncSlot("tab-badge")}>
          {badge}
        </span>
      ) : null}

      {rightSection ? (
        <span className="nc-tabs__tab-right-section" {...ncSlot("tab-right-section")}>
          {rightSection}
        </span>
      ) : null}
    </button>
  );
});

export const TabsPanels = forwardRef<HTMLDivElement, Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & { children?: React.ReactNode }>(
  function TabsPanels(props, ref): ReactElement {
    const { className, children, ...rest } = props;

    return (
      <div
        ref={(node) => assignRef(ref, node)}
        className={cx("nc-tabs__panels", className)}
        {...ncSlot("panels")}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  props,
  ref
): ReactElement | null {
  const {
    className,
    children,
    value,
    forceMount = false,
    padded = true,
    ...rest
  } = props;

  const context = useTabsContext("TabsPanel");
  const selected = context.value === value;
  const shouldMount = forceMount || context.keepMounted || selected;

  if (!shouldMount) {
    return null;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={`${context.rootId}-panel-${value}`}
      className={cx("nc-tabs__panel", className)}
      role="tabpanel"
      aria-labelledby={`${context.rootId}-tab-${value}`}
      tabIndex={0}
      hidden={!selected}
      data-active={selected || undefined}
      data-padded={padded || undefined}
      {...ncSlot("panel")}
      {...rest}
    >
      {children}
    </div>
  );
});