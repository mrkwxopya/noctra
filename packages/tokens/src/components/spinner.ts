export const ncSpinnerTokenNames = [
  "--nc-spinner-size",
  "--nc-spinner-track",
  "--nc-spinner-indicator",
  "--nc-spinner-label",
  "--nc-spinner-stroke",
  "--nc-spinner-speed"
] as const;

export type NcSpinnerTokenName = (typeof ncSpinnerTokenNames)[number];