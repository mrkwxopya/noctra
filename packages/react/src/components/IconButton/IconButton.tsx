import { forwardRef } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { IconButtonProps } from "./IconButton.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  props,
  ref
): ReactElement {
  const {
    className,
    label,
    icon,
    variant = "ghost",
    size = "md",
    tone = "neutral",
    radius = "md",
    density = "default",
    loading = false,
    selected = false,
    disabled,
    type = "button",
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cx("nc-icon-button", className)}
      aria-label={label}
      aria-busy={loading || undefined}
      aria-pressed={selected || undefined}
      disabled={isDisabled}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        tone,
        radius,
        density,
        state: loading ? "loading" : selected ? "selected" : undefined,
        disabled: isDisabled,
        loading,
        selected
      })}
      {...rest}
    >
      {loading ? (
        <span className="nc-icon-button__loader" aria-hidden="true" {...ncSlot("loader")} />
      ) : (
        <span className="nc-icon-button__icon" aria-hidden="true" {...ncSlot("icon")}>
          {icon}
        </span>
      )}
    </button>
  );
});