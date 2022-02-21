// Example Stack component using Stoop
import type { ComponentProps } from "react";

import { styled } from "../theme";

export const Stack = styled(
  "div",
  {
    display: "flex",
    flexDirection: "column",
  },
  {
    align: {
      center: {
        alignItems: "center",
      },
      end: {
        alignItems: "flex-end",
      },
      start: {
        alignItems: "flex-start",
      },
      stretch: {
        alignItems: "stretch",
      },
    },
    direction: {
      column: {
        flexDirection: "column",
      },
      row: {
        flexDirection: "row",
      },
    },
    gap: {
      large: {
        gap: "$spacing.large",
      },
      medium: {
        gap: "$spacing.medium",
      },
      small: {
        gap: "$spacing.small",
      },
      xlarge: {
        gap: "$spacing.xlarge",
      },
    },
    justify: {
      between: {
        justifyContent: "space-between",
      },
      center: {
        justifyContent: "center",
      },
      end: {
        justifyContent: "flex-end",
      },
      start: {
        justifyContent: "flex-start",
      },
    },
    wrap: {
      false: {
        flexWrap: "nowrap",
      },
      true: {
        flexWrap: "wrap",
      },
    },
  },
);

export type StackProps = ComponentProps<typeof Stack>;
