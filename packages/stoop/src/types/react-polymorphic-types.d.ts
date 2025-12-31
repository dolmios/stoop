/**
 * Type declaration for react-polymorphic-types to work around package.json exports issue.
 * Properly extends native element props while preserving custom variant props.
 */

declare module "react-polymorphic-types" {
  import type { ElementType, ComponentPropsWithRef, ComponentPropsWithoutRef } from "react";

  /**
   * Polymorphic props with ref support.
   * Extends native element props while preserving custom props (like variants).
   * Variant props take precedence over native props with the same name.
   */
  export type PolymorphicPropsWithRef<OwnProps, DefaultElement extends ElementType> = OwnProps &
    Omit<ComponentPropsWithRef<DefaultElement>, keyof OwnProps>;

  /**
   * Polymorphic props without ref support.
   * Extends native element props while preserving custom props (like variants).
   * Variant props take precedence over native props with the same name.
   */
  export type PolymorphicPropsWithoutRef<OwnProps, DefaultElement extends ElementType> = OwnProps &
    Omit<ComponentPropsWithoutRef<DefaultElement>, keyof OwnProps>;
}
