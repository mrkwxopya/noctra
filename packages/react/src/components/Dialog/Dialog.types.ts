import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDialogVariant = "surface" | "soft" | "filled" | "ghost";
export type NcDialogPlacement = "center" | "top" | "bottom";

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size"> {
  children: ReactNode;
  trigger?: ReactNode;
  heading?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  variant?: NcDialogVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  placement?: NcDialogPlacement;
  disabled?: boolean;
  withOverlay?: boolean;
  withCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  closeLabel?: string;
  triggerLabel?: string;
}
