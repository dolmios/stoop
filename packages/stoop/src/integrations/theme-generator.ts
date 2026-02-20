import type { StoopConfig, StoopTheme } from "../config";

const SCALE_NAMES: Record<keyof StoopTheme, string> = {
  colors: "colors",
  fonts: "fonts",
  fontSizes: "font-sizes",
  fontWeights: "font-weights",
  letterSpacings: "letter-spacings",
  lineHeights: "line-heights",
  opacities: "opacities",
  radii: "radii",
  shadows: "shadows",
  sizes: "sizes",
  space: "space",
  transitions: "transitions",
  zIndices: "z-indices",
};

function generateScaleVars(theme: StoopTheme): string {
  let css = "";

  for (const [key, scaleName] of Object.entries(SCALE_NAMES)) {
    const scale = theme[key as keyof StoopTheme];

    if (!scale) continue;

    for (const [token, value] of Object.entries(scale)) {
      css += `  --${scaleName}-${token}: ${value};\n`;
    }
  }

  return css;
}

/**
 * Generate CSS custom properties from the theme config.
 * Produces :root { --scale-token: value; } and [data-theme="name"] { ... } overrides.
 */
export function generateThemeCSS(config: StoopConfig): string {
  let css = ":root {\n";

  css += generateScaleVars(config.theme);
  css += "}\n";

  if (config.themes) {
    for (const [name, theme] of Object.entries(config.themes)) {
      css += `\n[data-theme="${name}"] {\n`;
      css += generateScaleVars(theme as StoopTheme);
      css += "}\n";
    }
  }

  return css;
}
