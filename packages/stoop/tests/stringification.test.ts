/**
 * Comprehensive stringification tests.
 * Tests CSS property name conversion including vendor prefixes, edge cases, and real-world scenarios.
 */

import { describe, expect, it } from "bun:test";

import { cssObjectToString } from "../src/core/compiler";
import { sanitizeCSSPropertyName } from "../src/core/stringify";
import type { CSS } from "../src/types";

/**
 * All CSS properties from Stoop's CSS_PROPERTIES set
 */
const ALL_CSS_PROPERTIES = [
  "alignContent",
  "alignItems",
  "alignSelf",
  "animation",
  "animationDelay",
  "animationDirection",
  "animationDuration",
  "animationFillMode",
  "animationIterationCount",
  "animationName",
  "animationPlayState",
  "animationTimingFunction",
  "aspectRatio",
  "backdropFilter",
  "backfaceVisibility",
  "background",
  "backgroundAttachment",
  "backgroundBlendMode",
  "backgroundClip",
  "backgroundColor",
  "backgroundImage",
  "backgroundOrigin",
  "backgroundPosition",
  "backgroundRepeat",
  "backgroundSize",
  "border",
  "borderBottom",
  "borderBottomColor",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomStyle",
  "borderBottomWidth",
  "borderCollapse",
  "borderColor",
  "borderImage",
  "borderImageOutset",
  "borderImageRepeat",
  "borderImageSlice",
  "borderImageSource",
  "borderImageWidth",
  "borderLeft",
  "borderLeftColor",
  "borderLeftStyle",
  "borderLeftWidth",
  "borderRadius",
  "borderRight",
  "borderRightColor",
  "borderRightStyle",
  "borderRightWidth",
  "borderSpacing",
  "borderStyle",
  "borderTop",
  "borderTopColor",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderTopStyle",
  "borderTopWidth",
  "borderWidth",
  "bottom",
  "boxShadow",
  "boxSizing",
  "captionSide",
  "caretColor",
  "clear",
  "clip",
  "clipPath",
  "color",
  "columnCount",
  "columnFill",
  "columnGap",
  "columnRule",
  "columnRuleColor",
  "columnRuleStyle",
  "columnRuleWidth",
  "columnSpan",
  "columnWidth",
  "columns",
  "content",
  "counterIncrement",
  "counterReset",
  "cursor",
  "direction",
  "display",
  "emptyCells",
  "filter",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexFlow",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "float",
  "font",
  "fontFamily",
  "fontFeatureSettings",
  "fontKerning",
  "fontSize",
  "fontSizeAdjust",
  "fontStretch",
  "fontStyle",
  "fontSynthesis",
  "fontVariant",
  "fontVariantAlternates",
  "fontVariantCaps",
  "fontVariantEastAsian",
  "fontVariantLigatures",
  "fontVariantNumeric",
  "fontWeight",
  "grid",
  "gridArea",
  "gridAutoColumns",
  "gridAutoFlow",
  "gridAutoRows",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnGap",
  "gridColumnStart",
  "gridGap",
  "gridRow",
  "gridRowEnd",
  "gridRowGap",
  "gridRowStart",
  "gridTemplate",
  "gridTemplateAreas",
  "gridTemplateColumns",
  "gridTemplateRows",
  "height",
  "hyphens",
  "imageRendering",
  "isolation",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  "left",
  "letterSpacing",
  "lineHeight",
  "listStyle",
  "listStyleImage",
  "listStylePosition",
  "listStyleType",
  "margin",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginTop",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "mixBlendMode",
  "objectFit",
  "objectPosition",
  "opacity",
  "order",
  "outline",
  "outlineColor",
  "outlineOffset",
  "outlineStyle",
  "outlineWidth",
  "overflow",
  "overflowWrap",
  "overflowX",
  "overflowY",
  "padding",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "pageBreakAfter",
  "pageBreakBefore",
  "pageBreakInside",
  "perspective",
  "perspectiveOrigin",
  "pointerEvents",
  "position",
  "quotes",
  "resize",
  "right",
  "rowGap",
  "scrollBehavior",
  "tabSize",
  "tableLayout",
  "textAlign",
  "textAlignLast",
  "textDecoration",
  "textDecorationColor",
  "textDecorationLine",
  "textDecorationStyle",
  "textIndent",
  "textJustify",
  "textOverflow",
  "textShadow",
  "textTransform",
  "textUnderlineOffset",
  "textUnderlinePosition",
  "top",
  "transform",
  "transformOrigin",
  "transformStyle",
  "transition",
  "transitionDelay",
  "transitionDuration",
  "transitionProperty",
  "transitionTimingFunction",
  "unicodeBidi",
  "userSelect",
  "verticalAlign",
  "visibility",
  "whiteSpace",
  "width",
  "wordBreak",
  "wordSpacing",
  "wordWrap",
  "writingMode",
  "zIndex",
];

describe("Stringification", () => {
  describe("sanitizeCSSPropertyName", () => {
    describe("Standard CSS Properties", () => {
      it("should convert all standard CSS properties correctly", () => {
        for (const property of ALL_CSS_PROPERTIES) {
          const result = sanitizeCSSPropertyName(property);
          expect(result).toBeTruthy();
          expect(typeof result).toBe("string");
          expect(result.length).toBeGreaterThan(0);
          // Should not have double dashes at start
          expect(result.startsWith("--")).toBe(false);
        }
      });

      it("should convert camelCase to kebab-case", () => {
        expect(sanitizeCSSPropertyName("backgroundColor")).toBe("background-color");
        expect(sanitizeCSSPropertyName("marginTop")).toBe("margin-top");
        expect(sanitizeCSSPropertyName("borderTopLeftRadius")).toBe("border-top-left-radius");
        expect(sanitizeCSSPropertyName("gridColumnStart")).toBe("grid-column-start");
      });

      it("should preserve single-word properties", () => {
        expect(sanitizeCSSPropertyName("color")).toBe("color");
        expect(sanitizeCSSPropertyName("display")).toBe("display");
        expect(sanitizeCSSPropertyName("margin")).toBe("margin");
      });
    });

    describe("Vendor Prefixes", () => {
      it("should handle Mozilla vendor prefixes", () => {
        expect(sanitizeCSSPropertyName("MozAppearance")).toBe("-moz-appearance");
        expect(sanitizeCSSPropertyName("MozUserSelect")).toBe("-moz-user-select");
        expect(sanitizeCSSPropertyName("MozTransform")).toBe("-moz-transform");
        expect(sanitizeCSSPropertyName("MozX")).toBe("-moz-x");
        expect(sanitizeCSSPropertyName("MozBoxSizing")).toBe("-moz-box-sizing");
      });

      it("should handle Mozilla vendor prefixes (case variations)", () => {
        expect(sanitizeCSSPropertyName("mozAppearance")).toBe("-moz-appearance");
        expect(sanitizeCSSPropertyName("MOZAPPEARANCE")).toBe("-moz-appearance");
        expect(sanitizeCSSPropertyName("Moz")).toBe("-moz");
      });

      it("should handle WebKit vendor prefixes", () => {
        expect(sanitizeCSSPropertyName("WebkitAppearance")).toBe("-webkit-appearance");
        expect(sanitizeCSSPropertyName("WebkitTransform")).toBe("-webkit-transform");
        expect(sanitizeCSSPropertyName("WebkitBackfaceVisibility")).toBe("-webkit-backface-visibility");
        expect(sanitizeCSSPropertyName("WebkitFontSmoothing")).toBe("-webkit-font-smoothing");
      });

      it("should handle WebKit vendor prefixes (case variations)", () => {
        expect(sanitizeCSSPropertyName("webkitTransform")).toBe("-webkit-transform");
        expect(sanitizeCSSPropertyName("WEBKITTRANSFORM")).toBe("-webkit-transform");
        expect(sanitizeCSSPropertyName("Webkit")).toBe("-webkit");
      });

      it("should handle Microsoft vendor prefixes", () => {
        expect(sanitizeCSSPropertyName("msTransform")).toBe("-ms-transform");
        expect(sanitizeCSSPropertyName("msUserSelect")).toBe("-ms-user-select");
        expect(sanitizeCSSPropertyName("msHyphens")).toBe("-ms-hyphens");
      });

      it("should handle Microsoft vendor prefixes (case variations)", () => {
        expect(sanitizeCSSPropertyName("MsTransform")).toBe("-ms-transform");
        expect(sanitizeCSSPropertyName("MSTransform")).toBe("-ms-transform");
        expect(sanitizeCSSPropertyName("ms")).toBe("-ms");
      });

      it("should handle Opera vendor prefixes", () => {
        expect(sanitizeCSSPropertyName("OTransform")).toBe("-o-transform");
        expect(sanitizeCSSPropertyName("OTransition")).toBe("-o-transition");
        expect(sanitizeCSSPropertyName("OPerspective")).toBe("-o-perspective");
        expect(sanitizeCSSPropertyName("O")).toBe("-o");
      });

      it("should handle mixed vendor prefixes for same property", () => {
        const styles: CSS = {
          WebkitTransform: "translateX(10px)",
          MozTransform: "translateX(10px)",
          msTransform: "translateX(10px)",
          OTransform: "translateX(10px)",
          transform: "translateX(10px)",
        };
        const output = cssObjectToString(styles);
        expect(output).toContain("-webkit-transform");
        expect(output).toContain("-moz-transform");
        expect(output).toContain("-ms-transform");
        expect(output).toContain("-o-transform");
        expect(output).toContain("transform:");
      });
    });

    describe("Edge Cases", () => {
      it("should preserve already kebab-case properties", () => {
        expect(sanitizeCSSPropertyName("background-color")).toBe("background-color");
        expect(sanitizeCSSPropertyName("-moz-appearance")).toBe("-moz-appearance");
        expect(sanitizeCSSPropertyName("-webkit-transform")).toBe("-webkit-transform");
      });

      it("should handle empty string", () => {
        expect(sanitizeCSSPropertyName("")).toBe("");
      });

      it("should sanitize invalid characters", () => {
        expect(sanitizeCSSPropertyName("color@invalid")).toBe("colorinvalid");
        expect(sanitizeCSSPropertyName("color!important")).toBe("colorimportant");
        expect(sanitizeCSSPropertyName("color#hash")).toBe("colorhash");
      });

      it("should strip leading numbers", () => {
        expect(sanitizeCSSPropertyName("123invalid")).toBe("invalid");
      });

      it("should handle very long property names", () => {
        const long = "veryLongPropertyNameThatGoesOnAndOn";
        const result = sanitizeCSSPropertyName(long);
        expect(result).toBe("very-long-property-name-that-goes-on-and-on");
      });

      it("should handle properties that might be confused with vendor prefixes", () => {
        expect(sanitizeCSSPropertyName("margin")).toBe("margin");
        expect(sanitizeCSSPropertyName("mask")).toBe("mask");
        expect(sanitizeCSSPropertyName("maxWidth")).toBe("max-width");
      });
    });
  });

  describe("cssObjectToString", () => {
    it("should stringify basic CSS properties", () => {
      const styles: CSS = {
        color: "red",
        backgroundColor: "blue",
        padding: "10px",
      };
      const result = cssObjectToString(styles);
      expect(result).toContain("color: red");
      expect(result).toContain("background-color: blue");
      expect(result).toContain("padding: 10px");
    });

    it("should stringify vendor-prefixed properties correctly", () => {
      const styles: CSS = {
        MozAppearance: "none",
        WebkitTransform: "translateX(10px)",
        msTransform: "rotate(45deg)",
        OTransform: "scale(1.5)",
      };
      const result = cssObjectToString(styles);
      expect(result).toContain("-moz-appearance");
      expect(result).toContain("-webkit-transform");
      expect(result).toContain("-ms-transform");
      expect(result).toContain("-o-transform");
    });

    it("should handle real-world button styles", () => {
      const styles: CSS = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 16px",
        borderRadius: "4px",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s",
        ":hover": {
          backgroundColor: "#0051cc",
        },
        ":active": {
          transform: "scale(0.98)",
        },
      };
      const result = cssObjectToString(styles);
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain("background-color");
      expect(result).toContain(":hover");
      expect(result).toContain(":active");
    });

    it("should handle hardware acceleration vendor prefixes", () => {
      const styles: CSS = {
        WebkitBackfaceVisibility: "hidden",
        MozBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        WebkitTransform: "translateZ(0)",
        MozTransform: "translateZ(0)",
        transform: "translateZ(0)",
      };
      const result = cssObjectToString(styles);
      expect(result).toContain("-webkit-backface-visibility");
      expect(result).toContain("-moz-backface-visibility");
      expect(result).toContain("-webkit-transform");
      expect(result).toContain("-moz-transform");
    });

    it("should handle CSS functions", () => {
      const styles: CSS = {
        width: "calc(100% - 20px)",
        height: "min(100vh, 800px)",
        margin: "max(10px, 2em)",
        background: "linear-gradient(to right, red, blue)",
      };
      const result = cssObjectToString(styles);
      expect(result).toContain("calc(");
      expect(result).toContain("min(");
      expect(result).toContain("max(");
      expect(result).toContain("linear-gradient(");
    });

    it("should handle nested selectors", () => {
      const styles: CSS = {
        color: "red",
        "&:hover": {
          color: "blue",
        },
        "& > div": {
          color: "green",
        },
        "& + span": {
          marginLeft: "10px",
        },
      };
      const result = cssObjectToString(styles);
      expect(result).toContain(":hover");
      expect(result).toContain("> div");
      expect(result).toContain("+ span");
    });

    it("should handle media queries", () => {
      const styles: CSS = {
        color: "red",
        "@media (min-width: 768px)": {
          color: "blue",
        },
        "@media (max-width: 1024px)": {
          padding: "20px",
        },
      };
      const result = cssObjectToString(styles);
      expect(result).toContain("@media");
    });
  });
});
