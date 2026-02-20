import type { StyledFunction } from "./types";

export const styled: StyledFunction = (() => {
  throw new Error(
    "[stoop] styled() must be compiled by the SWC plugin. See: https://stoop.dev/docs/quick-start",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;
