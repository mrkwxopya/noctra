export const ncThemeModes = ["dark", "light", "system"] as const;
export const ncColorSchemes = ["dark", "light"] as const;
export const ncDensityModes = ["compact", "default", "comfortable"] as const;
export const ncRadiusModes = ["sharp", "default", "rounded"] as const;
export const ncAccentModes = ["violet", "indigo", "blue", "cyan", "emerald"] as const;

export type NcThemeMode = (typeof ncThemeModes)[number];
export type NcColorScheme = (typeof ncColorSchemes)[number];
export type NcDensityMode = (typeof ncDensityModes)[number];
export type NcRadiusMode = (typeof ncRadiusModes)[number];
export type NcAccentMode = (typeof ncAccentModes)[number];