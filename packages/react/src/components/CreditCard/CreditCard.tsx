import { forwardRef, useId, useState } from "react";
import type { ChangeEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { CreditCardProps, CreditCardValue, NcCreditCardBrand } from "./CreditCard.types";

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

function digitsOnly(value: string | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

function normalizeName(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trimStart().slice(0, 42);
}

function formatCardNumber(value: string | undefined): string {
  const digits = digitsOnly(value).slice(0, 19);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
}

function maskCardNumber(value: string | undefined): string {
  const digits = digitsOnly(value).slice(0, 19);

  if (!digits) return "•••• •••• •••• ••••";

  const lastFour = digits.slice(-4).padStart(4, "•");
  const groupCount = Math.max(4, Math.ceil(digits.length / 4));
  const groups = Array.from({ length: groupCount }, (_, index) => (index === groupCount - 1 ? lastFour : "••••"));

  return groups.join(" ");
}

function normalizeExpiry(value: string | undefined): string {
  const digits = digitsOnly(value).slice(0, 4);

  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function normalizeCvc(value: string | undefined): string {
  return digitsOnly(value).slice(0, 4);
}

function normalizeValue(value: CreditCardValue | undefined): CreditCardValue {
  return {
    number: formatCardNumber(value?.number),
    name: normalizeName(value?.name),
    expiry: normalizeExpiry(value?.expiry),
    cvc: normalizeCvc(value?.cvc)
  };
}

function detectBrand(value: string | undefined): NcCreditCardBrand {
  const digits = digitsOnly(value);

  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(6011|65|64[4-9])/.test(digits)) return "discover";

  return "unknown";
}

function getBrandLabel(brand: NcCreditCardBrand): string {
  if (brand === "visa") return "VISA";
  if (brand === "mastercard") return "MC";
  if (brand === "amex") return "AMEX";
  if (brand === "discover") return "DISC";
  return "CARD";
}

export const CreditCard = forwardRef<HTMLDivElement, CreditCardProps>(function CreditCard(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue,
    onValueChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    labels,
    placeholders,
    previewLabel = "Credit card",
    brand,
    variant = "surface",
    size = "md",
    radius = "lg",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    maskNumber = false,
    showPreview = true,
    fullWidth = true,
    withBorder = true,
    numberInputProps,
    nameInputProps,
    expiryInputProps,
    cvcInputProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const numberInputId = numberInputProps?.id ?? `${rootId}-number`;
  const nameInputId = nameInputProps?.id ?? `${rootId}-name`;
  const expiryInputId = expiryInputProps?.id ?? `${rootId}-expiry`;
  const cvcInputId = cvcInputProps?.id ?? `${rootId}-cvc`;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<CreditCardValue>(() => normalizeValue(defaultValue));
  const currentValue = normalizeValue(isControlled ? value : internalValue);
  const currentBrand = brand ?? detectBrand(currentValue.number);
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;
  const previewNumber = maskNumber ? maskCardNumber(currentValue.number) : currentValue.number || "0000 0000 0000 0000";
  const previewName = currentValue.name || "CARD HOLDER";
  const previewExpiry = currentValue.expiry || "MM/YY";

  function setCreditCardValue(nextPatch: Partial<CreditCardValue>): void {
    const nextValue = normalizeValue({ ...currentValue, ...nextPatch });

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>): void {
    numberInputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setCreditCardValue({ number: event.currentTarget.value });
    }
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>): void {
    nameInputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setCreditCardValue({ name: event.currentTarget.value.toUpperCase() });
    }
  }

  function handleExpiryChange(event: ChangeEvent<HTMLInputElement>): void {
    expiryInputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setCreditCardValue({ expiry: event.currentTarget.value });
    }
  }

  function handleCvcChange(event: ChangeEvent<HTMLInputElement>): void {
    cvcInputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setCreditCardValue({ cvc: event.currentTarget.value });
    }
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-credit-card-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-brand={currentBrand}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: currentValue.number ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-credit-card__header">
          {label ? (
            <div className="nc-credit-card__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-credit-card__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      {showPreview ? (
        <div className="nc-credit-card__preview" aria-hidden="true" {...ncSlot("preview")}>
          <div className="nc-credit-card__preview-label" {...ncSlot("preview-label")}>
            {previewLabel}
          </div>

          <div className="nc-credit-card__preview-brand" {...ncSlot("preview-brand")}>
            {getBrandLabel(currentBrand)}
          </div>

          <div className="nc-credit-card__preview-number" {...ncSlot("preview-number")}>
            {previewNumber}
          </div>

          <div className="nc-credit-card__preview-meta" {...ncSlot("preview-meta")}>
            <span className="nc-credit-card__preview-name" {...ncSlot("preview-name")}>
              {previewName}
            </span>

            <span className="nc-credit-card__preview-expiry" {...ncSlot("preview-expiry")}>
              {previewExpiry}
            </span>
          </div>
        </div>
      ) : null}

      <div className="nc-credit-card__fields" aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined} {...ncSlot("fields")}>
        <div className="nc-credit-card__field nc-credit-card__field--number" {...ncSlot("field")}>
          <label htmlFor={numberInputId} className="nc-credit-card__field-label" {...ncSlot("field-label")}>
            {labels?.number ?? "Card number"}
          </label>
          <input
            {...numberInputProps}
            id={numberInputId}
            className={cx("nc-credit-card__input", numberInputProps?.className)}
            type={numberInputProps?.type ?? "text"}
            inputMode="numeric"
            autoComplete={numberInputProps?.autoComplete ?? "cc-number"}
            value={currentValue.number}
            placeholder={placeholders?.number ?? numberInputProps?.placeholder ?? "0000 0000 0000 0000"}
            disabled={disabled || numberInputProps?.disabled}
            readOnly={readOnly || numberInputProps?.readOnly}
            required={required || numberInputProps?.required}
            aria-invalid={isInvalid || undefined}
            aria-required={required || undefined}
            onChange={handleNumberChange}
            {...ncSlot("input")}
          />
        </div>

        <div className="nc-credit-card__field nc-credit-card__field--name" {...ncSlot("field")}>
          <label htmlFor={nameInputId} className="nc-credit-card__field-label" {...ncSlot("field-label")}>
            {labels?.name ?? "Name on card"}
          </label>
          <input
            {...nameInputProps}
            id={nameInputId}
            className={cx("nc-credit-card__input", nameInputProps?.className)}
            type={nameInputProps?.type ?? "text"}
            autoComplete={nameInputProps?.autoComplete ?? "cc-name"}
            value={currentValue.name}
            placeholder={placeholders?.name ?? nameInputProps?.placeholder ?? "CARD HOLDER"}
            disabled={disabled || nameInputProps?.disabled}
            readOnly={readOnly || nameInputProps?.readOnly}
            required={required || nameInputProps?.required}
            aria-invalid={isInvalid || undefined}
            aria-required={required || undefined}
            onChange={handleNameChange}
            {...ncSlot("input")}
          />
        </div>

        <div className="nc-credit-card__field" {...ncSlot("field")}>
          <label htmlFor={expiryInputId} className="nc-credit-card__field-label" {...ncSlot("field-label")}>
            {labels?.expiry ?? "Expiry"}
          </label>
          <input
            {...expiryInputProps}
            id={expiryInputId}
            className={cx("nc-credit-card__input", expiryInputProps?.className)}
            type={expiryInputProps?.type ?? "text"}
            inputMode="numeric"
            autoComplete={expiryInputProps?.autoComplete ?? "cc-exp"}
            value={currentValue.expiry}
            placeholder={placeholders?.expiry ?? expiryInputProps?.placeholder ?? "MM/YY"}
            disabled={disabled || expiryInputProps?.disabled}
            readOnly={readOnly || expiryInputProps?.readOnly}
            required={required || expiryInputProps?.required}
            aria-invalid={isInvalid || undefined}
            aria-required={required || undefined}
            onChange={handleExpiryChange}
            {...ncSlot("input")}
          />
        </div>

        <div className="nc-credit-card__field" {...ncSlot("field")}>
          <label htmlFor={cvcInputId} className="nc-credit-card__field-label" {...ncSlot("field-label")}>
            {labels?.cvc ?? "CVC"}
          </label>
          <input
            {...cvcInputProps}
            id={cvcInputId}
            className={cx("nc-credit-card__input", cvcInputProps?.className)}
            type={cvcInputProps?.type ?? "text"}
            inputMode="numeric"
            autoComplete={cvcInputProps?.autoComplete ?? "cc-csc"}
            value={currentValue.cvc}
            placeholder={placeholders?.cvc ?? cvcInputProps?.placeholder ?? "123"}
            disabled={disabled || cvcInputProps?.disabled}
            readOnly={readOnly || cvcInputProps?.readOnly}
            required={required || cvcInputProps?.required}
            aria-invalid={isInvalid || undefined}
            aria-required={required || undefined}
            onChange={handleCvcChange}
            {...ncSlot("input")}
          />
        </div>
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-credit-card__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});