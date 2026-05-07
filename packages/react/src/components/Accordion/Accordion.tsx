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
  AccordionControlProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
  NcAccordionChevronPosition,
  NcAccordionValue
} from "./Accordion.types";

interface AccordionContextValue {
  rootId: string;
  values: string[];
  setItemValue: (value: string) => void;
  isItemOpen: (value: string) => boolean;
  disabled: boolean;
  multiple: boolean;
  collapsible: boolean;
  keepMounted: boolean;
  chevronPosition: NcAccordionChevronPosition;
  loop: boolean;
  registerControl: (value: string, node: HTMLButtonElement | null) => void;
  getControls: () => Array<{ value: string; node: HTMLButtonElement }>;
}

interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
  tone: AccordionItemProps["tone"];
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

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

function toValueArray(value: NcAccordionValue | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function fromValueArray(values: string[], multiple: boolean): NcAccordionValue {
  return multiple ? values : values[0] ?? "";
}

function useAccordionContext(componentName: string): AccordionContextValue {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Accordion`);
  }

  return context;
}

function useAccordionItemContext(componentName: string): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside AccordionItem`);
  }

  return context;
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

const defaultChevron = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
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
    multiple = false,
    collapsible = true,
    keepMounted = false,
    chevronPosition = "right",
    withBorder = true,
    fullWidth = true,
    loop = true,
    ariaLabel,
    id,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [internalValues, setInternalValues] = useState(() => toValueArray(defaultValue));
  const currentValues = isControlled ? toValueArray(value) : internalValues;
  const controlRefs = useRef(new Map<string, HTMLButtonElement>());

  function setItemValue(nextValue: string): void {
    if (disabled) return;

    const isOpen = currentValues.includes(nextValue);
    let nextValues: string[];

    if (multiple) {
      nextValues = isOpen ? currentValues.filter((item) => item !== nextValue) : [...currentValues, nextValue];
    } else if (isOpen) {
      nextValues = collapsible ? [] : [nextValue];
    } else {
      nextValues = [nextValue];
    }

    if (!isControlled) {
      setInternalValues(nextValues);
    }

    onValueChange?.(fromValueArray(nextValues, multiple));
  }

  const context = useMemo<AccordionContextValue>(() => {
    return {
      rootId,
      values: currentValues,
      setItemValue,
      isItemOpen: (itemValue) => currentValues.includes(itemValue),
      disabled,
      multiple,
      collapsible,
      keepMounted,
      chevronPosition,
      loop,
      registerControl: (itemValue, node) => {
        if (node) {
          controlRefs.current.set(itemValue, node);
          return;
        }

        controlRefs.current.delete(itemValue);
      },
      getControls: () => {
        return Array.from(controlRefs.current.entries()).map(([itemValue, node]) => ({ value: itemValue, node }));
      }
    };
  }, [chevronPosition, collapsible, currentValues, disabled, keepMounted, loop, multiple, rootId]);

  return (
    <AccordionContext.Provider value={context}>
      <div
        ref={(node) => assignRef(ref, node)}
        id={rootId}
        className={cx("nc-accordion-root", className)}
        data-chevron-position={chevronPosition}
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
          state: currentValues.length > 0 ? "expanded" : "collapsed"
        })}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    disabled = false,
    tone,
    ...rest
  } = props;

  const context = useAccordionContext("AccordionItem");
  const itemContext = useMemo<AccordionItemContextValue>(() => ({ value, disabled, tone }), [disabled, tone, value]);
  const open = context.isItemOpen(value);

  return (
    <AccordionItemContext.Provider value={itemContext}>
      <div
        ref={(node) => assignRef(ref, node)}
        className={cx("nc-accordion__item", className)}
        data-open={open || undefined}
        data-disabled={disabled || undefined}
        data-tone={tone}
        {...ncSlot("item")}
        {...rest}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});

export const AccordionControl = forwardRef<HTMLButtonElement, AccordionControlProps>(function AccordionControl(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    label,
    description,
    icon,
    rightSection,
    chevron = defaultChevron,
    disabled,
    onClick,
    onKeyDown,
    ...rest
  } = props;

  const context = useAccordionContext("AccordionControl");
  const item = useAccordionItemContext("AccordionControl");
  const open = context.isItemOpen(item.value);
  const isDisabled = context.disabled || item.disabled || Boolean(disabled);
  const controlId = `${context.rootId}-control-${item.value}`;
  const panelId = `${context.rootId}-panel-${item.value}`;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || context.disabled) return;

    const controls = context.getControls().filter((control) => !control.node.disabled);
    const activeIndex = Math.max(
      controls.findIndex((control) => control.value === item.value),
      0
    );

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = getNextIndex(activeIndex, controls.length, 1, context.loop);
      controls[nextIndex]?.node.focus();
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = getNextIndex(activeIndex, controls.length, -1, context.loop);
      controls[nextIndex]?.node.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      controls[0]?.node.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      controls[controls.length - 1]?.node.focus();
    }
  }

  return (
    <button
      ref={(node) => {
        context.registerControl(item.value, node);
        assignRef(ref, node);
      }}
      id={controlId}
      type="button"
      className={cx("nc-accordion__control", className)}
      aria-expanded={open}
      aria-controls={panelId}
      disabled={isDisabled}
      data-open={open || undefined}
      data-tone={item.tone}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented && !isDisabled) {
          context.setItemValue(item.value);
        }
      }}
      onKeyDown={handleKeyDown}
      {...ncSlot("control")}
      {...rest}
    >
      {context.chevronPosition === "left" ? (
        <span className="nc-accordion__chevron" aria-hidden="true" {...ncSlot("chevron")}>
          {chevron}
        </span>
      ) : null}

      {icon ? (
        <span className="nc-accordion__icon" aria-hidden="true" {...ncSlot("icon")}>
          {icon}
        </span>
      ) : null}

      <span className="nc-accordion__content" {...ncSlot("content")}>
        <span className="nc-accordion__label" {...ncSlot("label")}>
          {label ?? children}
        </span>

        {description ? (
          <span className="nc-accordion__description" {...ncSlot("description")}>
            {description}
          </span>
        ) : null}
      </span>

      {rightSection ? (
        <span className="nc-accordion__right-section" {...ncSlot("right-section")}>
          {rightSection}
        </span>
      ) : null}

      {context.chevronPosition === "right" ? (
        <span className="nc-accordion__chevron" aria-hidden="true" {...ncSlot("chevron")}>
          {chevron}
        </span>
      ) : null}
    </button>
  );
});

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(function AccordionPanel(
  props,
  ref
): ReactElement | null {
  const {
    className,
    children,
    forceMount = false,
    padded = true,
    ...rest
  } = props;

  const context = useAccordionContext("AccordionPanel");
  const item = useAccordionItemContext("AccordionPanel");
  const open = context.isItemOpen(item.value);
  const shouldMount = forceMount || context.keepMounted || open;

  if (!shouldMount) {
    return null;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={`${context.rootId}-panel-${item.value}`}
      className={cx("nc-accordion__panel", className)}
      role="region"
      aria-labelledby={`${context.rootId}-control-${item.value}`}
      hidden={!open}
      data-open={open || undefined}
      data-padded={padded || undefined}
      {...ncSlot("panel")}
      {...rest}
    >
      <div className="nc-accordion__panel-content" {...ncSlot("panel-content")}>
        {children}
      </div>
    </div>
  );
});