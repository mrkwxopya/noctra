export const calendarAnatomy = [
  "root",
  "header",
  "month-label",
  "nav-button",
  "grid",
  "weekday",
  "day",
  "today-button"
] as const;

export type CalendarSlot = (typeof calendarAnatomy)[number];