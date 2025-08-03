import { styled } from "../../styles";

export const TextareaStyled = styled(
  "textarea",
  {
    // Disabled state
    "&:disabled": {
      backgroundColor: "$fill",
      color: "$text",
      cursor: "not-allowed",
      opacity: 0.6,
    },
    // Focus states
    "&:focus": {
      borderColor: "$brand",
      outline: `1px solid $brand`,
      outlineOffset: "2px",
    },
    // Reset
    appearance: "none",
    background: "none",
    // Default styling
    backgroundColor: "$fill",
    border: `1px solid $border`,
    borderRadius: "$small",
    color: "$text",
    // Layout
    display: "block",
    // Typography
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: "1rem",
    lineHeight: "1.5",
    margin: 0,
    minHeight: "100px",
    outline: "none",
    padding: `$small $medium`,
    // Default resize behavior
    resize: "vertical",
    width: "100%",
  },
  {
    variant: {
      default: {
        backgroundColor: "$fill",
        border: `1px solid $border`,
      },
      minimal: {
        backgroundColor: "transparent",
        border: "1px solid transparent",
        borderBottom: `1px solid $border`,
      },
    },
  },
);
