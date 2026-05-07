import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTreeVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcTreeSelectionMode = "single" | "multiple";

export interface TreeNode {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  selectable?: boolean;
  tone?: NcTone;
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "onSelect" | "size"> {
  nodes: TreeNode[];
  heading?: ReactNode;
  description?: ReactNode;
  emptyMessage?: ReactNode;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedIdsChange?: (ids: string[], node: TreeNode) => void;
  variant?: NcTreeVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  selectionMode?: NcTreeSelectionMode;
  allowParentSelect?: boolean;
  expandOnNodeClick?: boolean;
  showGuides?: boolean;
}
