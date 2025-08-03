import { styled } from "../../styles";

export const StackStyled = styled(
  "div",
  {
    display: "flex",
    // Font properties inherited from global styles
  },
  {
    align: {
      baseline: { alignItems: "baseline" },
      center: { alignItems: "center" },
      end: { alignItems: "flex-end" },
      start: { alignItems: "flex-start" },
      stretch: { alignItems: "stretch" },
    },
    alignContent: {
      around: { alignContent: "space-around" },
      between: { alignContent: "space-between" },
      center: { alignContent: "center" },
      end: { alignContent: "flex-end" },
      start: { alignContent: "flex-start" },
      stretch: { alignContent: "stretch" },
    },
    direction: {
      column: { flexDirection: "column" },
      "column-reverse": { flexDirection: "column-reverse" },
      row: {
        flexDirection: "row",
        // Add default padding for row direction unless minimal
      },
      "row-reverse": { flexDirection: "row-reverse" },
    },
    inline: {
      false: { display: "flex" },
      true: { display: "inline-flex" },
    },
    justify: {
      around: { justifyContent: "space-around" },
      between: { justifyContent: "space-between" },
      center: { justifyContent: "center" },
      end: { justifyContent: "flex-end" },
      evenly: { justifyContent: "space-evenly" },
      start: { justifyContent: "flex-start" },
    },
    minimal: {
      false: {},
      true: {
        padding: "0 !important",
      },
    },
    textAlign: {
      center: { textAlign: "center" },
      justify: { textAlign: "justify" },
      left: { textAlign: "left" },
      right: { textAlign: "right" },
    },
    wrap: {
      false: { flexWrap: "nowrap" },
      reverse: { flexWrap: "wrap-reverse" },
      true: { flexWrap: "wrap" },
    },
  },
);
