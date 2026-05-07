export const ncResizablePanelTokenNames = [
  "--nc-resizable-panel-bg",
  "--nc-resizable-panel-border",
  "--nc-resizable-panel-text",
  "--nc-resizable-panel-muted-text",
  "--nc-resizable-panel-handle",
  "--nc-resizable-panel-handle-hover",
  "--nc-resizable-panel-handle-active",
  "--nc-resizable-panel-focus-ring",
  "--nc-resizable-panel-radius",
  "--nc-resizable-panel-padding",
  "--nc-resizable-panel-handle-size",
  "--nc-resizable-panel-size",
  "--nc-resizable-panel-min-size",
  "--nc-resizable-panel-max-size",
  "--nc-resizable-panel-order"
] as const;

export type NcResizablePanelTokenName = (typeof ncResizablePanelTokenNames)[number];