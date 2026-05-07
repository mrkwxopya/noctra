export const ncPrimitiveColorFamilies = ["slate", "violet", "blue", "cyan", "emerald", "amber", "red"] as const;
export const ncPrimitiveColorSteps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

export type NcPrimitiveColorFamily = (typeof ncPrimitiveColorFamilies)[number];
export type NcPrimitiveColorStep = (typeof ncPrimitiveColorSteps)[number];
export type NcPrimitiveColorToken = `--nc-color-${NcPrimitiveColorFamily}-${NcPrimitiveColorStep}`;