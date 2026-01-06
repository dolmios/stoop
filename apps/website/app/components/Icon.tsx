"use client";

import type { ComponentProps, ReactElement } from "react";

import * as Icons from "../../lib/icons";

type IconName = keyof typeof Icons;

interface IconProps extends Omit<ComponentProps<"svg">, "children"> {
  name: IconName;
  size?: number | string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

/**
 * Icon component that wraps Phosphor icons for use in MDX and React components.
 * Uses centralized icon imports from lib/icons.ts to ensure consistency.
 *
 * @param props - Icon component props
 * @returns Icon element
 */
export function Icon({ name, size = 20, weight = "duotone", ...props }: IconProps): ReactElement {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    // Icon not found - return empty span to prevent errors
    // eslint-disable-next-line no-console
    console.warn(`Icon "${name}" not found in centralized icons`);

    return <span />;
  }

  return <IconComponent size={size} weight={weight} {...props} />;
}
