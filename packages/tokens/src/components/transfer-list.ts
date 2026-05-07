export const ncTransferListTokenNames = [
  "--nc-transfer-list-bg",
  "--nc-transfer-list-border",
  "--nc-transfer-list-text",
  "--nc-transfer-list-muted-text",
  "--nc-transfer-list-panel-bg",
  "--nc-transfer-list-panel-bg-hover",
  "--nc-transfer-list-item-bg-hover",
  "--nc-transfer-list-item-bg-selected",
  "--nc-transfer-list-action-bg",
  "--nc-transfer-list-action-text",
  "--nc-transfer-list-focus-ring",
  "--nc-transfer-list-radius",
  "--nc-transfer-list-gap",
  "--nc-transfer-list-max-height"
] as const;

export type NcTransferListTokenName = (typeof ncTransferListTokenNames)[number];