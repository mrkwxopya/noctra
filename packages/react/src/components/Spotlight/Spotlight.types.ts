import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSpotlightVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcSpotlightPlacement = "center" | "top";

export interface SpotlightAction {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  shortcut?: ReactNode;
  section?: string;
  keywords?: string[];
  disabled?: boolean;
  tone?: NcTone;
  onSelect?: (action: SpotlightAction) => void;
}

export interface SpotlightProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "onSelect" | "placeholder" | "size" | "title"> {
  actions: SpotlightAction[];
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenedChange?: (opened: boolean) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchValueChange?: (value: string) => void;
  onActionSelect?: (action: SpotlightAction) => void;
  title?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  emptyMessage?: ReactNode;
  closeLabel?: string;
  variant?: NcSpotlightVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  placement?: NcSpotlightPlacement;
  disabled?: boolean;
  closeOnSelect?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  withOverlay?: boolean;
  withCloseButton?: boolean;
}
