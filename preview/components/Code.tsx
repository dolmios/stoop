// Example Code component
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const Code = styled("code", {
  backgroundColor: "$colors.hover",
  borderRadius: "$borderRadius.small",
  fontFamily: "$fonts.mono",
  fontSize: "$fontSizes.small",
  padding: "2px 6px",
});

export type CodeProps = ComponentProps<typeof Code>;
