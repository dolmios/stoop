// Global styles demonstrating globalCss API
import { globalCss } from "../theme";

export const globalStyles = globalCss({
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  body: {
    backgroundColor: "$colors.background",
    color: "$colors.text",
    fontFamily: "$fonts.body",
    lineHeight: "$lineHeights.default",
  },
  code: {
    backgroundColor: "$colors.hover",
    borderRadius: "$borderRadius.small",
    fontFamily: "$fonts.mono",
    fontSize: "$fontSizes.small",
    padding: "2px 6px",
  },
});
