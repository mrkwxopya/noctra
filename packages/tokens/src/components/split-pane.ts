export const ncSplitPaneTokenNames = [
  "--nc-split-pane-bg",
  "--nc-split-pane-border",
  "--nc-split-pane-text",
  "--nc-split-pane-muted-text",
  "--nc-split-pane-handle",
  "--nc-split-pane-handle-hover",
  "--nc-split-pane-handle-active",
  "--nc-split-pane-focus-ring",
  "--nc-split-pane-radius",
  "--nc-split-pane-size",
  "--nc-split-pane-min-size",
  "--nc-split-pane-max-size",
  "--nc-split-pane-handle-size"
] as const;

export type NcSplitPaneTokenName = (typeof ncSplitPaneTokenNames)[number];