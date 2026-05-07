import { forwardRef, useId, useMemo, useState } from "react";
import type { KeyboardEvent, MutableRefObject, ReactElement, ReactNode, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { StepperProps, StepperStep, NcStepperStepStatus } from "./Stepper.types";

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

function getStepStatus(step: StepperStep, selectedIndex: number, index: number): NcStepperStepStatus {
  if (step.disabled) return "disabled";
  if (step.status) return step.status;
  if (index < selectedIndex) return "completed";
  if (index === selectedIndex) return "active";
  return "idle";
}

const defaultIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <circle cx="10" cy="10" r="3.5" />
  </svg>
);

const completedIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.31a1 1 0 0 1-1.42 0L3.29 9.22a1 1 0 1 1 1.42-1.408l4.04 4.077l6.54-6.593a1 1 0 0 1 1.414-.006Z" clipRule="evenodd" />
  </svg>
);

const errorIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10 2.25a7.75 7.75 0 1 0 0 15.5a7.75 7.75 0 0 0 0-15.5Zm.75 4.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4ZM10 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" clipRule="evenodd" />
  </svg>
);

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    steps = [],
    value,
    defaultValue = null,
    onValueChange,
    onStepSelect,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    emptyMessage = "Configure step items to display the workflow.",
    variant = "surface",
    orientation = "horizontal",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    selectable = true,
    allowCompletedSelect = true,
    fullWidth = true,
    withBorder = false,
    buttonProps,
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
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const selectedIndex = useMemo(() => {
    const index = steps.findIndex((stepItem) => stepItem.value === currentValue);
    return index >= 0 ? index : 0;
  }, [currentValue, steps]);
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  function canSelectStep(stepItem: StepperStep, index: number): boolean {
    const status = getStepStatus(stepItem, selectedIndex, index);

    if (!selectable || disabled || readOnly || stepItem.disabled || status === "disabled") return false;
    if (!allowCompletedSelect && status === "completed") return false;

    return true;
  }

  function selectStep(stepItem: StepperStep, index: number): void {
    if (!canSelectStep(stepItem, index)) return;

    const nextValue = stepItem.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    onStepSelect?.(stepItem);
  }

  function handleStepKeyDown(event: KeyboardEvent<HTMLButtonElement>, stepItem: StepperStep, index: number): void {
    buttonProps?.onKeyDown?.(event);

    if (event.defaultPrevented) return;

    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    selectStep(stepItem, index);
  }

  function renderStepIcon(stepItem: StepperStep, status: NcStepperStepStatus, index: number): ReactNode {
    if (status === "completed") return stepItem.completedIcon ?? completedIcon;
    if (status === "error") return stepItem.errorIcon ?? errorIcon;
    if (stepItem.icon) return stepItem.icon;
    return index + 1;
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-stepper-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-orientation={orientation}
      data-selectable={selectable || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: currentValue ? "selected" : steps.length > 0 ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-stepper__header">
          {label ? (
            <div id={labelId} className="nc-stepper__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-stepper__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="nc-stepper__list"
        role="list"
        aria-labelledby={labelId}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        {...ncSlot("list")}
      >
        {steps.length > 0 ? (
          steps.map((stepItem, index) => {
            const status = getStepStatus(stepItem, selectedIndex, index);
            const selected = stepItem.value === currentValue || status === "active";
            const itemTone = stepItem.tone ?? tone;
            const disabledStep = disabled || stepItem.disabled || status === "disabled";
            const stepContent = (
              <>
                <span className="nc-stepper__indicator" {...ncSlot("indicator")}>
                  <span className="nc-stepper__icon" {...ncSlot("icon")}>
                    {renderStepIcon(stepItem, status, index)}
                  </span>
                </span>

                <span className="nc-stepper__content" {...ncSlot("content")}>
                  <span className="nc-stepper__title" {...ncSlot("title")}>
                    {stepItem.title}
                  </span>

                  {stepItem.description ? (
                    <span className="nc-stepper__step-description" {...ncSlot("step-description")}>
                      {stepItem.description}
                    </span>
                  ) : null}

                  {stepItem.badge ? (
                    <span className="nc-stepper__badge" {...ncSlot("badge")}>
                      {stepItem.badge}
                    </span>
                  ) : null}
                </span>

                {index < steps.length - 1 ? (
                  <span className="nc-stepper__connector" aria-hidden="true" {...ncSlot("connector")} />
                ) : null}
              </>
            );

            if (selectable) {
              return (
                <button
                  {...buttonProps}
                  key={stepItem.value}
                  type="button"
                  className={cx("nc-stepper__step", buttonProps?.className)}
                  role="listitem"
                  disabled={disabledStep || buttonProps?.disabled}
                  aria-current={selected ? "step" : undefined}
                  aria-pressed={selected}
                  data-index={index}
                  data-status={status}
                  data-selected={selected || undefined}
                  data-disabled={stepItem.disabled || undefined}
                  data-tone={itemTone}
                  onClick={(event) => {
                    buttonProps?.onClick?.(event);

                    if (!event.defaultPrevented) {
                      selectStep(stepItem, index);
                    }
                  }}
                  onKeyDown={(event) => handleStepKeyDown(event, stepItem, index)}
                  {...ncSlot("step")}
                >
                  {stepContent}
                </button>
              );
            }

            return (
              <div
                key={stepItem.value}
                className="nc-stepper__step"
                role="listitem"
                aria-current={selected ? "step" : undefined}
                data-index={index}
                data-status={status}
                data-selected={selected || undefined}
                data-disabled={stepItem.disabled || undefined}
                data-tone={itemTone}
                {...ncSlot("step")}
              >
                {stepContent}
              </div>
            );
          })
        ) : (
          <div className="nc-stepper__empty" {...ncSlot("empty")}>
            {emptyMessage}
          </div>
        )}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-stepper__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});
