import type { KeyframesFunction } from "./types";

export const keyframes: KeyframesFunction = (() => {
  throw new Error("[stoop] keyframes() must be compiled by the SWC plugin.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;
