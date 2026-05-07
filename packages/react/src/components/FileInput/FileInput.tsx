import { forwardRef, useId, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { FileInputProps } from "./FileInput.types";

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

function normalizeFiles(files: File[] | null | undefined, maxFiles: number | undefined): File[] | null {
  if (!files || files.length === 0) return null;
  const nextFiles = maxFiles !== undefined && Number.isFinite(maxFiles) ? files.slice(0, Math.max(1, Math.floor(maxFiles))) : files;
  return nextFiles.length > 0 ? nextFiles : null;
}

function filesFromList(fileList: FileList | null, maxFiles: number | undefined): File[] | null {
  if (!fileList || fileList.length === 0) return null;
  return normalizeFiles(Array.from(fileList), maxFiles);
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const amount = value / 1024 ** index;
  return `${amount >= 10 || index === 0 ? amount.toFixed(0) : amount.toFixed(1)} ${units[index]}`;
}

const fileIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.5 2.75A2.25 2.25 0 0 0 3.25 5v10A2.25 2.25 0 0 0 5.5 17.25h9A2.25 2.25 0 0 0 16.75 15V7.31c0-.6-.238-1.17-.659-1.591l-2.81-2.81a2.25 2.25 0 0 0-1.591-.659H5.5Zm6.25 1.56c.18.035.346.124.477.254l2.21 2.21c.13.13.219.297.253.477h-2.19a.75.75 0 0 1-.75-.75V4.31Z" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const FileInput = forwardRef<HTMLDivElement, FileInputProps>(function FileInput(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = null,
    onValueChange,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    placeholder = "No file selected",
    buttonLabel = "Choose file",
    clearLabel = "Clear files",
    leftSection,
    rightSection,
    accept,
    multiple = false,
    maxFiles,
    formatFileName,
    emptyValueLabel,
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
    fullWidth = true,
    withBorder = true,
    inputProps,
    id,
    style,
    ...rest
  } = props;

  const generatedId = useId();
  const rootId = id ?? generatedId;
  const inputId = inputProps?.id ?? `${rootId}-input`;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const messageId = error || successMessage || warningMessage || children ? `${rootId}-message` : undefined;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isControlled = value !== undefined;
  const [internalFiles, setInternalFiles] = useState<File[] | null>(() => normalizeFiles(defaultValue, maxFiles));
  const currentFiles = normalizeFiles(isControlled ? value : internalFiles, maxFiles);
  const hasFiles = Boolean(currentFiles && currentFiles.length > 0);
  const isInvalid = invalid ?? Boolean(error);
  const hasHeader = Boolean(label || description);
  const hasMessage = Boolean(error || successMessage || warningMessage || children);
  const message = error ?? successMessage ?? warningMessage ?? children;
  const messageTone = error ? "danger" : successMessage ? "success" : warningMessage ? "warning" : undefined;

  function setFiles(nextFiles: File[] | null): void {
    const normalizedFiles = normalizeFiles(nextFiles, maxFiles);

    if (!isControlled) {
      setInternalFiles(normalizedFiles);
    }

    onValueChange?.(normalizedFiles);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      setFiles(filesFromList(event.currentTarget.files, maxFiles));
    }
  }

  function clearFiles(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setFiles(null);
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-file-input-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-has-files={hasFiles || undefined}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: hasFiles ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-file-input__header">
          {label ? (
            <label htmlFor={inputId} className="nc-file-input__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-file-input__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="nc-file-input__control" {...ncSlot("control")}>
        {leftSection ? (
          <span className="nc-file-input__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {leftSection}
          </span>
        ) : (
          <span className="nc-file-input__left-section" aria-hidden="true" {...ncSlot("left-section")}>
            {fileIcon}
          </span>
        )}

        <input
          {...inputProps}
          ref={(node) => {
            inputRef.current = node;
          }}
          id={inputId}
          className={cx("nc-file-input__input", inputProps?.className)}
          type="file"
          accept={accept ?? inputProps?.accept}
          multiple={multiple || inputProps?.multiple}
          disabled={disabled || inputProps?.disabled}
          readOnly={readOnly || inputProps?.readOnly}
          required={required || inputProps?.required}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          onChange={handleInputChange}
          {...ncSlot("input")}
        />

        <label className="nc-file-input__button" htmlFor={disabled || readOnly ? undefined : inputId} {...ncSlot("button")}>
          {buttonLabel}
        </label>

        <div className="nc-file-input__value" {...ncSlot("value")}>
          {currentFiles && currentFiles.length > 0 ? (
            currentFiles.map((file) => (
              <span key={`${file.name}-${file.size}-${file.lastModified}`} className="nc-file-input__file" title={`${file.name} (${formatBytes(file.size)})`} {...ncSlot("file")}>
                {formatFileName ? formatFileName(file) : `${file.name} · ${formatBytes(file.size)}`}
              </span>
            ))
          ) : (
            <span className="nc-file-input__placeholder">{emptyValueLabel ?? placeholder}</span>
          )}
        </div>

        {clearable && hasFiles && !disabled && !readOnly ? (
          <button type="button" className="nc-file-input__clear" aria-label={clearLabel} onClick={clearFiles} {...ncSlot("clear")}>
            {clearIcon}
          </button>
        ) : null}

        {rightSection ? (
          <span className="nc-file-input__right-section" aria-hidden="true" {...ncSlot("right-section")}>
            {rightSection}
          </span>
        ) : null}
      </div>

      {hasMessage ? (
        <div id={messageId} className="nc-file-input__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});