import { forwardRef, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { AvatarProps } from "./Avatar.types";

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function getInitials(name: string | undefined): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${second}`.toUpperCase();
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  props,
  ref
): ReactElement {
  const {
    className,
    src,
    alt,
    name,
    fallback,
    icon,
    variant,
    size = "md",
    radius = "full",
    status,
    ...rest
  } = props;

  const [imageFailed, setImageFailed] = useState(false);
  const initials = useMemo(() => getInitials(name), [name]);
  const hasImage = Boolean(src && !imageFailed);
  const resolvedVariant = variant ?? (hasImage ? "image" : icon ? "icon" : "initials");

  return (
    <div
      ref={ref}
      className={cx("nc-avatar", className)}
      aria-label={alt ?? name}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant: resolvedVariant,
        size,
        radius,
        state: status
      })}
      {...rest}
    >
      {hasImage ? (
        <img
          className="nc-avatar__image"
          src={src}
          alt={alt ?? name ?? ""}
          onError={() => setImageFailed(true)}
          {...ncSlot("image")}
        />
      ) : (
        <span className="nc-avatar__fallback" aria-hidden={alt || name ? "true" : undefined} {...ncSlot("fallback")}>
          {fallback ?? icon ?? initials}
        </span>
      )}

      {status ? (
        <span className="nc-avatar__status" aria-label={status} {...ncSlot("status")} />
      ) : null}
    </div>
  );
});