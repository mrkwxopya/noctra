import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTableOfContentsVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface TableOfContentsItem {
  id: string;
  label: ReactNode;
  href?: string;
  description?: ReactNode;
  badge?: ReactNode;
  children?: TableOfContentsItem[];
  disabled?: boolean;
  tone?: NcTone;
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "onClick">;
}

export interface TableOfContentsProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "onSelect" | "size"> {
  items: TableOfContentsItem[];
  heading?: ReactNode;
  description?: ReactNode;
  emptyMessage?: ReactNode;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string, item: TableOfContentsItem) => void;
  variant?: NcTableOfContentsVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  sticky?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showNestedGuides?: boolean;
  maxDepth?: number;
  linkTarget?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
}
