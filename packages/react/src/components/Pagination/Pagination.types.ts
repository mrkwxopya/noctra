import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcPaginationVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcPaginationShape = "square" | "rounded" | "pill";
export type NcPaginationControlType = "first" | "previous" | "page" | "next" | "last" | "dots";

export interface PaginationItem {
  type: NcPaginationControlType;
  page: number | null;
  label: ReactNode;
  active?: boolean;
  disabled?: boolean;
  tone?: NcTone;
  ariaLabel?: string;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "onChange" | "shape" | "size"> {
  page?: number;
  defaultPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  variant?: NcPaginationVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  siblings?: number;
  boundaries?: number;
  withEdges?: boolean;
  withControls?: boolean;
  previousLabel?: ReactNode;
  nextLabel?: ReactNode;
  firstLabel?: ReactNode;
  lastLabel?: ReactNode;
  dotsLabel?: ReactNode;
  shape?: NcPaginationShape;
  compact?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  ariaLabel?: string;
  getItemAriaLabel?: (item: PaginationItem) => string;
  renderItem?: (item: PaginationItem) => ReactNode;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "onClick">;
}
