/**
 * Variant application logic.
 * Merges variant styles with base styles based on component props.
 * Optimized to avoid unnecessary object spreads when no variants are applied.
 */
import type { CSS, Variants, VariantProps } from "../types";
export declare function applyVariants(variants: Variants, props: VariantProps, baseStyles: CSS): CSS;
