import { forwardRef, useId, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent, MouseEvent, MutableRefObject, ReactElement, Ref } from "react";
import { ncDataAttributes, ncSlot } from "../../shared";
import type { DropzoneProps, DropzoneRejectedFile, NcDropzoneRejectReason } from "./Dropzone.types";

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
  const normalizedMaxFiles = maxFiles !== undefined && Number.isFinite(maxFiles) ? Math.max(1, Math.floor(maxFiles)) : undefined;
  const nextFiles = normalizedMaxFiles ? files.slice(0, normalizedMaxFiles) : files;
  return nextFiles.length > 0 ? nextFiles : null;
}

function filesFromList(fileList: FileList | null): File[] {
  if (!fileList || fileList.length === 0) return [];
  return Array.from(fileList);
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const amount = value / 1024 ** index;
  return `${amount >= 10 || index === 0 ? amount.toFixed(0) : amount.toFixed(1)} ${units[index]}`;
}

function splitAccept(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
}

function acceptsFile(file: File, accept: string | undefined): boolean {
  const rules = splitAccept(accept);

  if (rules.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith(".")) return fileName.endsWith(rule);
    if (rule.endsWith("/*")) return fileType.startsWith(rule.slice(0, -1));
    return fileType === rule;
  });
}

function getRejectReason(file: File, accept: string | undefined, minSize: number | undefined, maxSize: number | undefined): NcDropzoneRejectReason | null {
  if (!acceptsFile(file, accept)) return "file-type-not-accepted";
  if (minSize !== undefined && Number.isFinite(minSize) && file.size < minSize) return "file-too-small";
  if (maxSize !== undefined && Number.isFinite(maxSize) && file.size > maxSize) return "file-too-large";
  return null;
}

function partitionFiles(files: File[], accept: string | undefined, minSize: number | undefined, maxSize: number | undefined, multiple: boolean, maxFiles: number | undefined): { accepted: File[]; rejected: DropzoneRejectedFile[] } {
  const accepted: File[] = [];
  const rejected: DropzoneRejectedFile[] = [];
  const normalizedMaxFiles = maxFiles !== undefined && Number.isFinite(maxFiles) ? Math.max(1, Math.floor(maxFiles)) : undefined;
  const capacity = multiple ? normalizedMaxFiles : 1;

  files.forEach((file) => {
    const reason = getRejectReason(file, accept, minSize, maxSize);

    if (reason) {
      rejected.push({ file, reason });
      return;
    }

    if (capacity !== undefined && accepted.length >= capacity) {
      rejected.push({ file, reason: "too-many-files" });
      return;
    }

    accepted.push(file);
  });

  return { accepted, rejected };
}

const uploadIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3.75a.75.75 0 0 1 .53.22l4.25 4.25a.75.75 0 1 1-1.06 1.06l-2.97-2.97V15a.75.75 0 0 1-1.5 0V6.31L8.28 9.28a.75.75 0 0 1-1.06-1.06l4.25-4.25A.75.75 0 0 1 12 3.75Z" />
    <path d="M5.25 14.25A.75.75 0 0 1 6 15v2.25c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75V15a.75.75 0 0 1 1.5 0v2.25a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25V15a.75.75 0 0 1 .75-.75Z" />
  </svg>
);

const clearIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

export const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone(
  props,
  ref
): ReactElement {
  const {
    className,
    children,
    value,
    defaultValue = null,
    onValueChange,
    onReject,
    label,
    description,
    error,
    successMessage,
    warningMessage,
    idleContent = "Drag files here or browse",
    acceptContent = "Drop files to upload",
    rejectContent = "Some files cannot be accepted",
    fileListLabel = "Selected files",
    clearLabel = "Clear files",
    browseLabel = "Browse",
    accept,
    multiple = false,
    maxFiles,
    minSize,
    maxSize,
    variant = "surface",
    size = "md",
    radius = "lg",
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
  const [dragState, setDragState] = useState<"idle" | "accept" | "reject">("idle");
  const currentFiles = normalizeFiles(isControlled ? value : internalFiles, maxFiles);
  const hasFiles = Boolean(currentFiles && currentFiles.length > 0);
  const isInvalid = invalid ?? (Boolean(error) || dragState === "reject");
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

  function processFiles(files: File[]): void {
    if (disabled || readOnly) return;

    const result = partitionFiles(files, accept, minSize, maxSize, multiple, maxFiles);

    if (result.rejected.length > 0) {
      onReject?.(result.rejected);
    }

    setFiles(result.accepted.length > 0 ? result.accepted : null);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    inputProps?.onChange?.(event);

    if (!event.defaultPrevented) {
      processFiles(filesFromList(event.currentTarget.files));
    }
  }

  function clearFiles(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setFiles(null);
  }

  function openPicker(): void {
    if (disabled || readOnly) return;
    inputRef.current?.click();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    rest.onKeyDown?.(event);

    if (event.defaultPrevented) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>): void {
    rest.onDragEnter?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    event.preventDefault();
    const files = filesFromList(event.dataTransfer.files);
    const hasRejectedFile = files.length > 0 && partitionFiles(files, accept, minSize, maxSize, multiple, maxFiles).rejected.length > 0;
    setDragState(hasRejectedFile ? "reject" : "accept");
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>): void {
    rest.onDragOver?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>): void {
    rest.onDragLeave?.(event);

    if (event.defaultPrevented) return;

    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setDragState("idle");
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    rest.onDrop?.(event);

    if (event.defaultPrevented || disabled || readOnly) return;

    event.preventDefault();
    setDragState("idle");
    processFiles(filesFromList(event.dataTransfer.files));
  }

  return (
    <div
      ref={(node) => assignRef(ref, node)}
      id={rootId}
      className={cx("nc-dropzone-root", className)}
      style={style}
      data-border={withBorder || undefined}
      data-full-width={fullWidth || undefined}
      data-invalid={isInvalid || undefined}
      data-required={required || undefined}
      data-read-only={readOnly || undefined}
      data-has-files={hasFiles || undefined}
      data-drag-state={dragState}
      {...ncSlot("root")}
      {...ncDataAttributes({
        variant,
        size,
        radius,
        tone,
        density,
        disabled,
        state: dragState !== "idle" ? dragState : hasFiles ? "filled" : "empty"
      })}
      {...rest}
    >
      {hasHeader ? (
        <div className="nc-dropzone__header">
          {label ? (
            <label htmlFor={inputId} className="nc-dropzone__label" {...ncSlot("label")}>
              {label}
            </label>
          ) : null}

          {description ? (
            <div id={descriptionId} className="nc-dropzone__description" {...ncSlot("description")}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="nc-dropzone__zone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-invalid={isInvalid || undefined}
        aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...ncSlot("zone")}
      >
        <input
          {...inputProps}
          ref={(node) => {
            inputRef.current = node;
          }}
          id={inputId}
          className={cx("nc-dropzone__input", inputProps?.className)}
          type="file"
          accept={accept ?? inputProps?.accept}
          multiple={multiple || inputProps?.multiple}
          disabled={disabled || inputProps?.disabled}
          required={required || inputProps?.required}
          aria-hidden="true"
          onChange={handleInputChange}
          {...ncSlot("input")}
        />

        <span className="nc-dropzone__icon" aria-hidden="true" {...ncSlot("icon")}>
          {uploadIcon}
        </span>

        <span className="nc-dropzone__content" {...ncSlot("content")}>
          {dragState === "accept" ? acceptContent : dragState === "reject" ? rejectContent : idleContent}
        </span>

        <span className="nc-dropzone__browse" {...ncSlot("browse")}>
          {browseLabel}
        </span>
      </div>

      {hasFiles ? (
        <div className="nc-dropzone__files" aria-label={typeof fileListLabel === "string" ? fileListLabel : undefined} {...ncSlot("files")}>
          {fileListLabel ? <span className="nc-dropzone__files-label">{fileListLabel}</span> : null}

          {currentFiles?.map((file) => (
            <span key={`${file.name}-${file.size}-${file.lastModified}`} className="nc-dropzone__file" title={`${file.name} (${formatBytes(file.size)})`} {...ncSlot("file")}>
              {file.name} · {formatBytes(file.size)}
            </span>
          ))}

          {clearable && !disabled && !readOnly ? (
            <button type="button" className="nc-dropzone__clear" aria-label={clearLabel} onClick={clearFiles} {...ncSlot("clear")}>
              {clearIcon}
            </button>
          ) : null}
        </div>
      ) : null}

      {hasMessage ? (
        <div id={messageId} className="nc-dropzone__message" data-tone={messageTone} {...ncSlot("message")}>
          {message}
        </div>
      ) : null}
    </div>
  );
});