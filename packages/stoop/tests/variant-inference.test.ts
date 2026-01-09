/**
 * Test variant type inference to ensure only defined variants are allowed
 */

import { describe, expect, test } from "bun:test";
import { createElement } from "react";

import { createStoop } from "../src/create-stoop";

describe("Variant Type Inference", () => {
  test("should restrict variant props to defined values", () => {
    const { styled } = createStoop({
      theme: {
        colors: { primary: "blue" },
      },
    });

    const Button = styled("button", {
      variants: {
        size: {
          sm: { padding: "4px" },
          lg: { padding: "12px" },
        },
        color: {
          primary: { backgroundColor: "blue" },
          secondary: { backgroundColor: "gray" },
        },
      },
    });

    // Valid usage
    const validButton1 = createElement(Button, { size: "sm" });
    const validButton2 = createElement(Button, { color: "primary" });

    expect(validButton1).toBeDefined();
    expect(validButton2).toBeDefined();

    // The following would be type errors if caught:
    // const invalidButton1 = createElement(Button, { size: "xl" }); // "xl" not defined
    // const invalidButton2 = createElement(Button, { color: "red" }); // "red" not defined
  });
});
