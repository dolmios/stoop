import { describe, it, expect } from "vitest";
import { clsx } from "../src/classnames";

describe("clsx", () => {
  it("joins class names", () => {
    expect(clsx("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(clsx("a", false, "b", null, "c", undefined)).toBe("a b c");
  });

  it("handles empty input", () => {
    expect(clsx()).toBe("");
  });
});
