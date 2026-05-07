import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTreeSelectVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcTreeSelectPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";
export type NcTreeSelectSelectionMode = "single" | "multiple";

export interface TreeSelectNode {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: TreeSelectNode[];
  disabled?: boolean;
  selectable?: boolean;
  keywords?: string[];
  tone?: NcTone;
}

export interface TreeSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "onSelect" | "placeholder" | "readOnly" | "required" | "size" | "value"> {
  nodes: TreeSelectNode[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[] | null, node: TreeSelectNode | null) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  variant?: NcTreeSelectVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  placement?: NcTreeSelectPlacement;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  selectionMode?: NcTreeSelectSelectionMode;
  allowParentSelect?: boolean;
  expandOnNodeClick?: boolean;
  closeOnSelect?: boolean;
  openLabel?: string;
  clearLabel?: string;
}
