export const ncCalendarTokenNames = [
  "--nc-calendar-bg",
  "--nc-calendar-border",
  "--nc-calendar-header-text",
  "--nc-calendar-weekday-text",
  "--nc-calendar-day-bg",
  "--nc-calendar-day-bg-hover",
  "--nc-calendar-day-bg-selected",
  "--nc-calendar-day-text",
  "--nc-calendar-day-text-muted",
  "--nc-calendar-day-text-selected",
  "--nc-calendar-nav-bg",
  "--nc-calendar-nav-bg-hover",
  "--nc-calendar-focus-ring",
  "--nc-calendar-radius",
  "--nc-calendar-day-size",
  "--nc-calendar-gap",
  "--nc-calendar-padding"
] as const;

export type NcCalendarTokenName = (typeof ncCalendarTokenNames)[number];