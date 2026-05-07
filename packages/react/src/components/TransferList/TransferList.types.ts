import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTransferListVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface TransferListItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  keywords?: string[];
}

export interface TransferListLabels {
  source?: ReactNode;
  target?: ReactNode;
  moveSelectedToTarget?: string;
  moveSelectedToSource?: string;
  moveAllToTarget?: string;
  moveAllToSource?: string;
  searchSource?: string;
  searchTarget?: string;
  sourceEmpty?: ReactNode;
  targetEmpty?: ReactNode;
}

export interface TransferListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "data" | "defaultValue" | "disabled" | "label" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  data?: TransferListItem[];
  labels?: TransferListLabels;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  variant?: NcTransferListVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  searchable?: boolean;
  maxHeight?: number | string;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: TransferListStyle;
}

export type TransferListStyle = CSSProperties & {
  "--nc-transfer-list-max-height"?: string;
};
