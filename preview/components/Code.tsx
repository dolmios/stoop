// Example Code component
import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Code = styled("code", {
  backgroundColor: "$hover",
  borderRadius: "$small",
  fontFamily: "$mono",
  fontSize: "$small",
  padding: "2px 6px",
});

export type CodeProps = ComponentProps<typeof Code>;
