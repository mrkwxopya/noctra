import { forwardRef } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { ButtonProps } from "./Button.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref
): ReactElement {
  const {
    children,
    className,
    variant = "solid",
    size = "md",
    tone = "primary",
    radius = "md",
    density = "default",
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth,
    type = "button",
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cx("nc-button", fullWidth && "nc-button--full", className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        tone,
        radius,
        density,
        state: loading ? "loading" : undefined,
        disabled: isDisabled,
        loading
      })}
      {...rest}
    >
      {loading ? (
        <span className="nc-button__loader" aria-hidden="true" {...ncSlot("loader")} />
      ) : null}

      {leftIcon && !loading ? (
        <span className="nc-button__icon" aria-hidden="true" {...ncSlot("icon")}>
          {leftIcon}
        </span>
      ) : null}

      <span className="nc-button__label" {...ncSlot("label")}>
        {children}
      </span>

      {rightIcon && !loading ? (
        <span className="nc-button__icon" aria-hidden="true" {...ncSlot("icon")}>
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
});