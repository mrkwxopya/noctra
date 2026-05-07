export const ncTimelineTokenNames = [
  "--nc-timeline-bg",
  "--nc-timeline-border",
  "--nc-timeline-text",
  "--nc-timeline-muted-text",
  "--nc-timeline-item-bg",
  "--nc-timeline-item-bg-hover",
  "--nc-timeline-item-bg-selected",
  "--nc-timeline-rail",
  "--nc-timeline-marker-bg",
  "--nc-timeline-marker-text",
  "--nc-timeline-focus-ring",
  "--nc-timeline-radius",
  "--nc-timeline-gap",
  "--nc-timeline-marker-size"
] as const;

export type NcTimelineTokenName = (typeof ncTimelineTokenNames)[number];