import { forwardRef } from "react";
import type { MutableRefObject, ReactElement, Ref } from "react";
import { ncSlot } from "../../shared";
import type { CardPartProps } from "./Card.types";

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

export const CardHeader = forwardRef<HTMLDivElement, CardPartProps>(function CardHeader(
  props,
  ref
): ReactElement {
  const { className, children, title: _title, description: _description, ...rest } = props;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-card__header", className)}
      {...ncSlot("header")}
      {...rest}
    >
      {children}
    </div>
  );
});

export const CardBody = forwardRef<HTMLDivElement, CardPartProps>(function CardBody(
  props,
  ref
): ReactElement {
  const { className, children, title: _title, description: _description, ...rest } = props;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-card__content", className)}
      {...ncSlot("content")}
      {...rest}
    >
      {children}
    </div>
  );
});

export const CardFooter = forwardRef<HTMLDivElement, CardPartProps>(function CardFooter(
  props,
  ref
): ReactElement {
  const { className, children, title: _title, description: _description, ...rest } = props;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-card__footer", className)}
      {...ncSlot("footer")}
      {...rest}
    >
      {children}
    </div>
  );
});

export const CardTitle = forwardRef<HTMLDivElement, CardPartProps>(function CardTitle(
  props,
  ref
): ReactElement {
  const { className, children, title, description: _description, ...rest } = props;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-card__title", className)}
      {...ncSlot("title")}
      {...rest}
    >
      {title ?? children}
    </div>
  );
});

export const CardDescription = forwardRef<HTMLDivElement, CardPartProps>(function CardDescription(
  props,
  ref
): ReactElement {
  const { className, children, title: _title, description, ...rest } = props;

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      className={cx("nc-card__description", className)}
      {...ncSlot("description")}
      {...rest}
    >
      {description ?? children}
    </div>
  );
});