import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDropzoneVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcDropzoneRejectReason = "too-many-files" | "file-too-small" | "file-too-large" | "file-type-not-accepted";

export interface DropzoneRejectedFile {
  file: File;
  reason: NcDropzoneRejectReason;
}

export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, "accept" | "children" | "defaultValue" | "disabled" | "label" | "multiple" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: File[] | null;
  defaultValue?: File[] | null;
  onValueChange?: (files: File[] | null) => void;
  onReject?: (files: DropzoneRejectedFile[]) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  idleContent?: ReactNode;
  acceptContent?: ReactNode;
  rejectContent?: ReactNode;
  fileListLabel?: ReactNode;
  clearLabel?: string;
  browseLabel?: ReactNode;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  minSize?: number;
  maxSize?: number;
  variant?: NcDropzoneVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue">;
  style?: DropzoneStyle;
}

export type DropzoneStyle = CSSProperties;
