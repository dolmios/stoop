// Example ResponsiveBox demonstrating media queries
import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const ResponsiveBox = styled("div", {
  backgroundColor: "$hover",
  borderRadius: "$default",
  desktop: {
    fontSize: "$large",
    padding: "$xlarge",
  },
  mobile: {
    fontSize: "$small",
    padding: "$small",
  },
  padding: "$large",
});

export type ResponsiveBoxProps = ComponentProps<typeof ResponsiveBox>;
