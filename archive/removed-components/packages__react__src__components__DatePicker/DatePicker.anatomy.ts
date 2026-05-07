export const datePickerAnatomy = [
  "root",
  "label",
  "description",
  "panel",
  "header",
  "month",
  "nav",
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

export type DatePickerSlot = (typeof datePickerAnatomy)[number];