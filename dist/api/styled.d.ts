/**
 * Styled component API.
 * Creates polymorphic styled components with variant support, theme awareness,
 * and CSS prop merging. Supports component targeting via selector references.
 */
import { forwardRef } from "react";
import type { CSS, StyledComponentProps, StyledComponentRef, StylableElement, Theme, UtilityFunction, Variants } from "../types";
export declare const STOOP_COMPONENT_SYMBOL: unique symbol;
export declare function createStyledComponentRef(className: string): StyledComponentRef;
type CSSWithVariants = {
    [K in keyof CSS]: CSS[K];
} & {
    variants: Variants;
    compoundVariants?: unknown[];
};
export declare function createStyledFunction(defaultTheme: Theme, prefix?: string, media?: Record<string, string>, utils?: Record<string, UtilityFunction>): {
    <DefaultElement extends StylableElement, BaseStyles extends CSSWithVariants>(defaultElement: DefaultElement, baseStyles: BaseStyles): ReturnType<typeof forwardRef<unknown, StyledComponentProps<DefaultElement, BaseStyles["variants"]>>> & {
        selector: StyledComponentRef;
    };
    <DefaultElement extends StylableElement, VariantsConfig extends Variants = {}>(defaultElement: DefaultElement, baseStyles?: CSS, variants?: VariantsConfig): ReturnType<typeof forwardRef<unknown, StyledComponentProps<DefaultElement, VariantsConfig>>> & {
        selector: StyledComponentRef;
    };
};
export {};
