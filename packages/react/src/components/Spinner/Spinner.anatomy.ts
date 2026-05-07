export const spinnerAnatomy = ["root", "track", "indicator", "label"] as const;

export type SpinnerSlot = (typeof spinnerAnatomy)[number];