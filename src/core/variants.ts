/**
 * Variant application logic.
 * Merges variant styles with base styles based on component props.
 * Optimized to avoid unnecessary object spreads when no variants are applied.
 */

import type { CSS, Variants, VariantProps } from "../types";

export function applyVariants(variants: Variants, props: VariantProps, baseStyles: CSS): CSS {
  let hasVariants = false;
  const appliedVariantStyles: CSS[] = [];

  for (const variantName in variants) {
    const propValue = props[variantName];

    if (propValue === undefined) {
      continue;
    }

    const variantOptions = variants[variantName] as Record<string | number, CSS>;
    const key = propValue === true ? "true" : propValue === false ? "false" : String(propValue);

    if (variantOptions[key]) {
      appliedVariantStyles.push(variantOptions[key]);
      hasVariants = true;
    }
  }

  return hasVariants ? Object.assign({}, baseStyles, ...appliedVariantStyles) : baseStyles;
}
