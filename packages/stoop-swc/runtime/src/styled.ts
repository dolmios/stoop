import type { JSX } from "react";

export function styled<
  E extends keyof JSX.IntrinsicElements,
  BaseStyles extends Record<string, any> = {},
  Variants extends Record<string, Record<string, any>> = {},
>(element: E, baseStyles?: BaseStyles, variants?: Variants): any {
  throw new Error(
    "[stoop-swc] styled() must be compiled by the SWC plugin.\n\n" +
      "Setup: https://stoop.dev/setup\n\n" +
      "For dynamic styles, use variants:\n" +
      "  styled('button', { base }, { variant: { ... } })\n\n" +
      "Not: <Button css={{ dynamic }} />",
  );
}
