import type { GlobalCSSFunction } from "./types";

export const globalCss: GlobalCSSFunction = (() => {
  throw new Error("[stoop] globalCss() must be compiled by the SWC plugin.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;
