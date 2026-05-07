import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcResizablePanelVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcResizablePanelOrientation = "horizontal" | "vertical";
export type NcResizablePanelResizeMode = "live" | "end";

export interface ResizablePanelGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "onResize" | "size"> {
  children?: ReactNode;
  variant?: NcResizablePanelVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  orientation?: NcResizablePanelOrientation;
  defaultSizes?: number[];
  sizes?: number[];
  minSize?: number;
  maxSize?: number;
  resizeMode?: NcResizablePanelResizeMode;
  onSizesChange?: (sizes: number[]) => void;
  onSizesCommit?: (sizes: number[]) => void;
  resizable?: boolean;
  withBorder?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  handleLabel?: string;
}

export interface ResizablePanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "size" | "style"> {
  children?: ReactNode;
  defaultSize?: number;
  size?: number;
  minSize?: number;
  maxSize?: number;
  collapsed?: boolean;
  collapsible?: boolean;
  order?: number;
  padded?: boolean;
  scrollable?: boolean;
  style?: ResizablePanelStyle;
}

export interface ResizableHandleProps extends Omit<HTMLAttributes<HTMLButtonElement>, "children" | "disabled" | "label"> {
  disabled?: boolean;
  orientation?: NcResizablePanelOrientation;
  label?: string;
  active?: boolean;
}

export type ResizablePanelStyle = CSSProperties & {
  "--nc-resizable-panel-size"?: string;
  "--nc-resizable-panel-min-size"?: string;
  "--nc-resizable-panel-max-size"?: string;
  "--nc-resizable-panel-order"?: string;
};
