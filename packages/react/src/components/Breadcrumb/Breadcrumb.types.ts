import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcBreadcrumbVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcBreadcrumbSeparator = "chevron" | "slash" | "dot" | "arrow";
export type NcBreadcrumbCollapseMode = "middle" | "start" | "end";

export interface BreadcrumbItem {
  id: string;
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  current?: boolean;
  tone?: NcTone;
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "onClick">;
  onSelect?: (item: BreadcrumbItem) => void;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "onSelect" | "size"> {
  items: BreadcrumbItem[];
  separator?: NcBreadcrumbSeparator | ReactNode;
  activeId?: string | null;
  onItemSelect?: (id: string, item: BreadcrumbItem) => void;
  variant?: NcBreadcrumbVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  maxItems?: number;
  collapseMode?: NcBreadcrumbCollapseMode;
  collapseLabel?: ReactNode;
  withBorder?: boolean;
  withHomeIcon?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
}
