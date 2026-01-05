import { describe, it, expect } from "vitest";
import { createSelector } from "../src/selector";

describe("createSelector", () => {
  it("creates selector reference", () => {
    const selector = createSelector("btn-abc123");
    expect(selector.__stoopClassName).toBe("btn-abc123");
    expect(selector.__isStoopStyled).toBe(true);
  });

  it("toString returns marker format", () => {
    const selector = createSelector("btn-abc123");
    expect(selector.toString()).toBe("__STOOP_COMPONENT_btn-abc123");
  });

  it("selector is readonly", () => {
    const selector = createSelector("test-class");
    expect(selector.__isStoopStyled).toBe(true);
    expect(selector.__stoopClassName).toBe("test-class");
  });
});
