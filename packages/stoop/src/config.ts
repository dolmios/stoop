export interface StoopTheme {
  colors?: Record<string, string>;
  space?: Record<string, string>;
  fontSizes?: Record<string, string>;
  fontWeights?: Record<string, string>;
  lineHeights?: Record<string, string>;
  letterSpacings?: Record<string, string>;
  sizes?: Record<string, string>;
  radii?: Record<string, string>;
  shadows?: Record<string, string>;
  zIndices?: Record<string, string>;
  transitions?: Record<string, string>;
  opacities?: Record<string, string>;
  fonts?: Record<string, string>;
}

export interface StoopConfig {
  theme: StoopTheme;
  themes?: Record<string, Partial<StoopTheme>>;
  media?: Record<string, string>;
  prefix?: string;
  output?: { dir?: string; filename?: string };
}

export function defineConfig(config: StoopConfig): StoopConfig {
  return config;
}
