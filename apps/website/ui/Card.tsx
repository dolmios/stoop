"use client";

import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Card = styled("div", {
  backgroundColor: "$background",
  border: "1px solid $border",
  borderRadius: "$small",
  padding: "$large",
});

export type CardProps = ComponentProps<typeof Card>;
