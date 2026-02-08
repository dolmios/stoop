"use client";

import type { ReactNode } from "react";

import { Stack } from "stoop-ui";

export function Wrapper({ children }: { children: ReactNode }): ReactNode {
  return (
    <Stack
      as="main"
      bottom="large"
      css={{
        boxSizing: "border-box",
        margin: "0 auto",
        maxWidth: "1100px",
        width: "100%",
      }}
      left="medium"
      right="medium"
      top="medium">
      {children}
    </Stack>
  );
}
