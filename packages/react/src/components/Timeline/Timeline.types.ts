import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTimelineVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcTimelineAlign = "left" | "right" | "alternate";

export interface TimelineItem {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
  tone?: NcTone;
  active?: boolean;
  completed?: boolean;
  disabled?: boolean;
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "data" | "defaultValue" | "disabled" | "label" | "onChange" | "onSelect" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  data?: TimelineItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  onItemSelect?: (item: TimelineItem) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  emptyMessage?: ReactNode;
  variant?: NcTimelineVariant;
  align?: NcTimelineAlign;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  selectable?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: TimelineStyle;
}

export type TimelineStyle = CSSProperties;
