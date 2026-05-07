import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcFooterVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcFooterLayout = "stacked" | "inline" | "columns";

export interface FooterLink {
  id: string;
  label: ReactNode;
  href?: string;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  external?: boolean;
  tone?: NcTone;
}

export interface FooterSection {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  links?: FooterLink[];
  content?: ReactNode;
  tone?: NcTone;
}

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "size" | "title"> {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  logo?: ReactNode;
  brand?: ReactNode;
  sections?: FooterSection[];
  links?: FooterLink[];
  actions?: ReactNode;
  copyright?: ReactNode;
  meta?: ReactNode;
  variant?: NcFooterVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  layout?: NcFooterLayout;
  disabled?: boolean;
  withBorder?: boolean;
  compact?: boolean;
}
