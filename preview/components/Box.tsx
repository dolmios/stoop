// Example Box component - generic container
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const Box = styled("div", {
  display: "block",
});

export type BoxProps = ComponentProps<typeof Box>;
