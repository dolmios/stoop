"use client";

import type { ComponentProps } from "react";

import { styled } from "../../stoop.theme";

export const Card = styled("div" as const, {
  backgroundColor: "$surface",
  border: "1px solid $borderStrong",
  borderBottomColor: "$borderEmphasis",
  borderRadius: "$default",
  borderTopColor: "$borderLight",
  boxShadow: "$subtle",
  padding: "$large",
});

export type CardProps = ComponentProps<typeof Card>;
