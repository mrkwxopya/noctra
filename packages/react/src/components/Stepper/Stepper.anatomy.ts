export const stepperAnatomy = [
  "root",
  "label",
  "description",
  "list",
  "step",
  "indicator",
  "icon",
  "connector",
  "content",
  "title",
  "step-description",
  "badge",
  "empty",
  "message"
] as const;

export type StepperSlot = (typeof stepperAnatomy)[number];