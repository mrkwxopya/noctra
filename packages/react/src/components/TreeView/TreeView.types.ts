import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTreeViewVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type TreeViewSelectionMode = "single" | "multiple";

export interface TreeViewItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  children?: TreeViewItem[];
  keywords?: string[];
}

export type TreeViewValue = string | string[] | null;

export interface TreeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "data" | "defaultValue" | "disabled" | "label" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  data?: TreeViewItem[];
  value?: TreeViewValue;
  defaultValue?: TreeViewValue;
  onValueChange?: (value: TreeViewValue) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (value: string[]) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  emptyMessage?: ReactNode;
  searchPlaceholder?: string;
  variant?: NcTreeViewVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  searchable?: boolean;
  selectionMode?: TreeViewSelectionMode;
  expandOnSelect?: boolean;
  defaultExpandAll?: boolean;
  maxHeight?: number | string;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: TreeViewStyle;
}

export type TreeViewStyle = CSSProperties & {
  "--nc-tree-view-max-height"?: string;
};
