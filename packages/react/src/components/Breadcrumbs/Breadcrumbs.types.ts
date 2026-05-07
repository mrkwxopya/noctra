import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcBreadcrumbsVariant = "plain" | "soft" | "surface" | "boxed";
export type NcBreadcrumbsSeparator = "slash" | "chevron" | "dot" | "custom";

export interface BreadcrumbsItem {
  value?: string;
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  current?: boolean;
  disabled?: boolean;
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "size"> {
  items: BreadcrumbsItem[];
  variant?: NcBreadcrumbsVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  separator?: NcBreadcrumbsSeparator;
  customSeparator?: ReactNode;
  maxItems?: number;
  ariaLabel?: string;
}
