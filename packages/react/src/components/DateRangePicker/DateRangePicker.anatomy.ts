export const dateRangePickerAnatomy = [
  "root",
  "label",
  "description",
  "panel",
  "summary",
  "summary-item",
  "calendar",
  "header",
  "month",
  "previous",
  "next",
  "weekdays",
  "weekday",
  "grid",
  "cell",
  "day",
  "actions",
  "today",
  "clear",
  "footer",
  "message"
] as const;

export type DateRangePickerSlot = (typeof dateRangePickerAnatomy)[number];