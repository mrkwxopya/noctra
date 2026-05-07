import type { CSSProperties, HTMLAttributes, ReactNode, RefObject } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcClickOutsideVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type ClickOutsideEventType = "pointerdown" | "mousedown" | "touchstart" | "click" | "focusin";

export interface ClickOutsideProps extends Omit<HTMLAttributes<HTMLDivElement>, "capture" | "children" | "disabled" | "size" | "style"> {
  children?: ReactNode;
  active?: boolean;
  capture?: boolean;
  eventTypes?: ClickOutsideEventType[];
  excludeRefs?: Array<RefObject<HTMLElement | null>>;
  onClickOutside?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  closeOnEscape?: boolean;
  variant?: NcClickOutsideVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: ClickOutsideStyle;
}

export type ClickOutsideStyle = CSSProperties;
