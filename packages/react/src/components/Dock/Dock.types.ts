import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDockVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcDockPosition = "top" | "right" | "bottom" | "left";
export type NcDockOrientation = "horizontal" | "vertical";

export interface DockItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  tone?: NcTone;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "onClick">;
  onSelect?: (item: DockItem) => void;
}

export interface DockProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "onSelect" | "size"> {
  children?: ReactNode;
  items?: DockItem[];
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string, item: DockItem) => void;
  variant?: NcDockVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  position?: NcDockPosition;
  orientation?: NcDockOrientation;
  floating?: boolean;
  withBorder?: boolean;
  withLabels?: boolean;
  withTooltips?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
}
