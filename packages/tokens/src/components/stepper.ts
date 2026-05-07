export const ncStepperTokenNames = [
  "--nc-stepper-bg",
  "--nc-stepper-border",
  "--nc-stepper-text",
  "--nc-stepper-muted-text",
  "--nc-stepper-step-bg",
  "--nc-stepper-step-bg-hover",
  "--nc-stepper-step-bg-selected",
  "--nc-stepper-connector",
  "--nc-stepper-indicator-bg",
  "--nc-stepper-indicator-text",
  "--nc-stepper-focus-ring",
  "--nc-stepper-radius",
  "--nc-stepper-gap",
  "--nc-stepper-indicator-size"
] as const;

export type NcStepperTokenName = (typeof ncStepperTokenNames)[number];