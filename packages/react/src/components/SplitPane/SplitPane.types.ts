import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSplitPaneVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcSplitPaneOrientation = "horizontal" | "vertical";
export type NcSplitPaneResizeMode = "live" | "end";

export interface SplitPaneProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "onResize" | "size" | "style"> {
  children?: ReactNode;
  variant?: NcSplitPaneVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  orientation?: NcSplitPaneOrientation;
  defaultSize?: number;
  sizeValue?: number;
  minSize?: number;
  maxSize?: number;
  resizeMode?: NcSplitPaneResizeMode;
  onSizeChange?: (size: number) => void;
  onSizeCommit?: (size: number) => void;
  resizable?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapseThreshold?: number;
  withBorder?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  handleLabel?: string;
  style?: SplitPaneStyle;
}

export type SplitPaneStyle = CSSProperties & {
  "--nc-split-pane-size"?: string;
  "--nc-split-pane-min-size"?: string;
  "--nc-split-pane-max-size"?: string;
};
