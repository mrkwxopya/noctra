import type { HTMLAttributes, ReactNode } from "react";
import type { NcAccentMode, NcDensity, NcRadiusMode, NcThemeMode } from "../shared/system.types";

export interface NoctraProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  theme?: NcThemeMode;
  density?: NcDensity;
  radiusMode?: NcRadiusMode;
  accent?: NcAccentMode;
}

export function NoctraProvider(props: NoctraProviderProps): ReactNode {
  const {
    children,
    theme = "dark",
    density = "default",
    radiusMode = "default",
    accent = "violet",
    ...rest
  } = props;

  return (
    <div
      data-noctra-provider=""
      data-theme={theme}
      data-density={density}
      data-radius-mode={radiusMode}
      data-accent={accent}
      {...rest}
    >
      {children}
    </div>
  );
}