import { forwardRef, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { TagsInputProps, TagsInputTag } from "./TagsInput.types";

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

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

function normalizeValue(value: string, trimValue: boolean, formatTag?: (tag: string) => string): string {
  const nextValue = trimValue ? value.trim() : value;
  return formatTag ? formatTag(nextValue) : nextValue;
}

function hasSeparator(value: string, separators: string[]): boolean {
  return separators.some((separator) => value.includes(separator));
}

function splitBySeparators(value: string, separators: string[]): string[] {
  if (separators.length === 0) return [value];

  const pattern = separators.map((separator) => separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return value.split(new RegExp(pattern, "g"));
}

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const TagsInput = forwardRef<HTMLDivElement, TagsInputProps>(function TagsInput(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = [],
    onValueChange,
    onTagAdd,
    onTagRemove,
    label,
    description,
    placeholder = "Add tag",
    removeLabel = "Remove tag",
    clearLabel = "Clear tags",
    duplicateMessage = "Tag already exists",
    maxTagsMessage = "Maximum tags reached",
    variant = "surface",
    size = "md",
    radius = "md",
    tone = "primary",
    density = "default",
    disabled,
    readOnly,
    required,
    invalid,
    clearable = true,
    allowDuplicates = false,
    trimValue = true,
    separators = ["Enter", ","],
    maxTags,
    maxTagLength,
    minTagLength = 1,
    validateTag,
    formatTag,
    renderTag,
    fullWidth = true,
    withBorder = true,
    inputProps,
    id,
    onClick,
    onKeyDown,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isControlled = value !== undefined;
  const [internalValues, setInternalValues] = useState(() => uniqueValues(defaultValue));
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState<React.ReactNode>(null);
  const values = useMemo(() => uniqueValues(isControlled ? value ?? [] : internalValues), [internalValues, isControlled, value]);
  const hasHeader = Boolean(label || description);
  const hasValues = values.length > 0;
  const canAddMore = maxTags === undefined || values.length < maxTags;

  function emitValues(nextValues: string[]): void {
    const normalizedValues = allowDuplicates ? nextValues : uniqueValues(nextValues);

    if (!isControlled) {
      setInternalValues(normalizedValues);
    }

    onValueChange?.(normalizedValues);
  }

  function isValidTag(tag: string): boolean {
    if (tag.length < minTagLength) return false;
    if (maxTagLength !== undefined && tag.length > maxTagLength) return false;

    if (!allowDuplicates && values.includes(tag)) {
      setMessage(duplicateMessage);
      return false;
    }

    if (!canAddMore) {
      setMessage(maxTagsMessage);
      return false;
    }

    const validation = validateTag?.(tag, values);

    if (typeof validation === "string") {
      setMessage(validation);
      return false;
    }

    if (validation === false) {
      return false;
    }

    return true;
  }

  function addRawTags(rawValue: string): void {
    if (disabled || readOnly) return;

    const candidateTags = splitBySeparators(rawValue, separators)
      .map((item) => normalizeValue(item, trimValue, formatTag))
      .filter(Boolean);

    if (candidateTags.length === 0) return;

    const acceptedTags: string[] = [];

    for (const candidate of candidateTags) {
      if (isValidTag(candidate)) {
        acceptedTags.push(candidate);
      }
    }

    if (acceptedTags.length === 0) return;

    setMessage(null);
    emitValues([...values, ...acceptedTags]);
    acceptedTags.forEach((tag) => onTagAdd?.(tag));
    setInputValue("");
  }

  function removeTag(tag: string): void {
    if (disabled || readOnly) return;

    emitValues(values.filter((item) => item !== tag));
    onTagRemove?.(tag);
    setMessage(null);
    inputRef.current?.focus();
  }

  function clearTags(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();

    if (disabled || readOnly) return;

    values.forEach((tag) => onTagRemove?.(tag));
    emitValues([]);
    setMessage(null);
    inputRef.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextValue = event.currentTarget.value;

    if (separators.includes(",") && hasSeparator(nextValue, [","])) {
      addRawTags(nextValue);
      return;
    }

    setInputValue(nextValue);
    setMessage(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    if (separators.includes(event.key) && inputValue.trim().length > 0) {
      event.preventDefault();
      addRawTags(inputValue);
      return;
    }

    if (event.key === "Backspace" && inputValue.length === 0 && values.length > 0) {
      event.preventDefault();
      const lastTag = values[values.length - 1];

      if (lastTag !== undefined) {
        removeTag(lastTag);
      }
    }
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-tags-input-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={invalid || undefined}
      data-required={required || undefined}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          inputRef.current?.focus();
        }
      }}
      onKeyDown={handleKeyDown}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasValues ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-tags-input__header">
          {label ? (
            <div className="nc-tags-input__label" {...ncSlot("label")}>
              {label}
            </div>
          ) : null}

          {description ? (
            <div className="nc-tags-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-tags-input__control" {...ncSlot("control")}>
        <div className="nc-tags-input__values" {...ncSlot("values")}>
          {values.map((tag) => {
            const tagData: TagsInputTag = { value: tag, label: tag, tone };

            return (
              <span key={tag} className="nc-tags-input__tag" data-tone={tone} {...ncSlot("tag")}>
                {renderTag ? (
                  renderTag(tagData)
                ) : (
                  <>
                    <span className="nc-tags-input__tag-label" {...ncSlot("tag-label")}>
                      {tag}
                    </span>

                    {!disabled && !readOnly ? (
                      <button
                        type="button"
                        className="nc-tags-input__tag-remove"
                        aria-label={`${removeLabel}: ${tag}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeTag(tag);
                        }}
                        {...ncSlot("tag-remove")}
                      >
                        {clearIcon}
                      </button>
                    ) : null}
                  </>
                )}
              </span>
            );
          })}

          <input
            {...inputProps}
            ref={(node) => {
              inputRef.current = node;
            }}
            className={cx("nc-tags-input__input", inputProps?.className)}
            value={inputValue}
            placeholder={values.length === 0 ? placeholder : undefined}
            disabled={disabled || inputProps?.disabled}
            readOnly={readOnly || inputProps?.readOnly}
            required={required || inputProps?.required}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            onChange={handleInputChange}
            {...ncSlot("input")}
          />
        </div>

        {clearable && hasValues && !disabled && !readOnly ? (
          <button type="button" className="nc-tags-input__clear" aria-label={clearLabel} onClick={clearTags} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}
      </div>

      {message || children ? (
        <div className="nc-tags-input__message" {...ncSlot("message")}>
          {message ?? children}
        </div>
      ) : null}
    </div>
  );
});