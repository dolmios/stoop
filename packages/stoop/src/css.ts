import type { CSSFunction } from "./types";

export const css: CSSFunction = (() => {
  throw new Error("[stoop] css() must be compiled by the SWC plugin.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;
