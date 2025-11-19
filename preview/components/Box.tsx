/**
 * Box component example.
 *
 * A simple container component demonstrating basic styled component usage.
 * Can be used as a base for building more complex components.
 *
 * @example
 * ```tsx
 * <Box css={{ padding: "$medium" }}>Content</Box>
 * ```
 */

import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Box = styled("div", {
  display: "block",
});

export type BoxProps = ComponentProps<typeof Box>;
