import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcAnchorVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcAnchorOrientation = "vertical" | "horizontal";

export interface AnchorItem {
  id: string;
  label: ReactNode;
  href?: string;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  tone?: NcTone;
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "onClick">;
}

export interface AnchorProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "onSelect" | "size"> {
  items: AnchorItem[];
  heading?: ReactNode;
  description?: ReactNode;
  emptyMessage?: ReactNode;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string, item: AnchorItem) => void;
  variant?: NcAnchorVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  orientation?: NcAnchorOrientation;
  sticky?: boolean;
  compact?: boolean;
  withIndicator?: boolean;
  linkTarget?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
}
