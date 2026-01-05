/**
 * Variant application logic.
 * Merges variant styles with base styles based on component props.
 * Optimized to avoid unnecessary object spreads when no variants are applied.
 */

import type { CSS, Variants, VariantProps } from "../types";

/**
 * Applies variant styles to base styles based on component props.
 *
 * @param variants - Variant configuration object
 * @param props - Component props containing variant values
 * @param baseStyles - Base styles to merge with variant styles
 * @returns Merged CSS object
 */
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

  if (!hasVariants) {
    return baseStyles;
  }

  // Merge all variant styles into a single object using spread for consistency
  const mergedVariants = { ...appliedVariantStyles[0] };

  for (let i = 1; i < appliedVariantStyles.length; i++) {
    Object.assign(mergedVariants, appliedVariantStyles[i]);
  }

  return { ...baseStyles, ...mergedVariants };
}
