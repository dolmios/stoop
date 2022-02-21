// Example ResponsiveBox demonstrating media queries
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const ResponsiveBox = styled("div", {
  backgroundColor: "$colors.hover",
  borderRadius: "$borderRadius.default",
  desktop: {
    fontSize: "$fontSizes.large",
    padding: "$spacing.xlarge",
  },
  mobile: {
    fontSize: "$fontSizes.small",
    padding: "$spacing.small",
  },
  padding: "$spacing.large",
});

export type ResponsiveBoxProps = ComponentProps<typeof ResponsiveBox>;
