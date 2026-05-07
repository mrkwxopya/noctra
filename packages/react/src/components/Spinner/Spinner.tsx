import { forwardRef } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { SpinnerProps } from "./Spinner.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  props,
  ref
): ReactElement {
  const {
    className,
    variant = "default",
    size = "md",
    tone = "primary",
    label,
    ...rest
  } = props;

  return (
    <span
      ref={ref}
      className={cx("nc-spinner", className)}
      role={label ? "status" : undefined}
      aria-label={typeof label === "string" ? label : undefined}
      aria-hidden={label ? undefined : true}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        tone
      })}
      {...rest}
    >
      <span className="nc-spinner__track" aria-hidden="true" {...ncSlot("track")} />
      <span className="nc-spinner__indicator" aria-hidden="true" {...ncSlot("indicator")} />
      {label ? (
        <span className="nc-spinner__label" {...ncSlot("label")}>
          {label}
        </span>
      ) : null}
    </span>
  );
});