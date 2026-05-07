import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTagsInputVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface TagsInputTag {
  value: string;
  label?: ReactNode;
  icon?: ReactNode;
  tone?: NcTone;
  disabled?: boolean;
}

export interface TagsInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "placeholder" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  removeLabel?: string;
  clearLabel?: string;
  duplicateMessage?: ReactNode;
  maxTagsMessage?: ReactNode;
  variant?: NcTagsInputVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  allowDuplicates?: boolean;
  trimValue?: boolean;
  separators?: string[];
  maxTags?: number;
  maxTagLength?: number;
  minTagLength?: number;
  validateTag?: (tag: string, tags: string[]) => boolean | string;
  formatTag?: (tag: string) => string;
  renderTag?: (tag: TagsInputTag) => ReactNode;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "value" | "defaultValue" | "onChange">;
  style?: TagsInputStyle;
}

export type TagsInputStyle = CSSProperties;
