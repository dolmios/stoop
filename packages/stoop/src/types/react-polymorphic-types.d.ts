/**
 * Type declaration for react-polymorphic-types to work around package.json exports issue.
 */

declare module "react-polymorphic-types" {
  import type { ElementType, ComponentPropsWithRef, ComponentPropsWithoutRef } from "react";

  export type PolymorphicPropsWithRef<OwnProps, DefaultElement extends ElementType> = OwnProps &
    ComponentPropsWithRef<DefaultElement>;

  export type PolymorphicPropsWithoutRef<OwnProps, DefaultElement extends ElementType> = OwnProps &
    ComponentPropsWithoutRef<DefaultElement>;
}
