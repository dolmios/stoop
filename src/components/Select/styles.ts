import { styled } from "../../styles";

export const SelectTriggerStyled = styled("div", {
  cursor: "pointer",
  display: "inline-block",
  position: "relative",
  width: "fit-content",
});

export const SelectDropdownStyled = styled("div", {
  // Default styling
  backgroundColor: "$fill",
  border: `1px solid $border`,

  // Sharp edges (key design language requirement)
  borderRadius: "$small",

  maxHeight: "300px",
  maxWidth: "400px",

  // Layout
  minWidth: "200px",

  // Animation
  opacity: 1,

  // Focus management
  outline: "none",
  overflowY: "auto",
  position: "fixed",
  transition: "opacity 0.2s ease",
  // Prevent flash at (0,0) before positioning
  visibility: "hidden",

  zIndex: "$dropdown",
});

export const SelectLabelStyled = styled("div", {
  backgroundColor: "$hover",
  borderBottom: `1px solid $border`,
  color: "$text",
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "0.875rem",
  fontWeight: "600",
  padding: `$small $medium`,
});

export const SelectFilterStyled = styled("div", {
  borderBottom: `1px solid $border`,
  padding: "$small",
});

export const SelectItemStyled = styled("button", {
  "&:hover": {
    backgroundColor: "$hover",
  },
  '&[data-focused="true"]': {
    backgroundColor: "$hover",
    outline: `1px solid $brand`,
    outlineOffset: "-2px",
  },
  '&[data-selected="true"]': {
    backgroundColor: "$brand",

    fontWeight: "600",
  },
  alignItems: "center",
  backgroundColor: "transparent",
  border: "none",
  color: "$text",
  cursor: "pointer",
  display: "flex",
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "1rem",
  padding: `$small $medium`,

  textAlign: "left",

  transition: "background-color 0.2s ease",

  width: "100%",
});

export const SelectEmptyStyled = styled("div", {
  color: "$text",
  fontSize: "0.875rem",
  fontStyle: "italic",
  padding: `$medium $medium`,
  textAlign: "center",
});

export const SelectLoadingStyled = styled("div", {
  color: "$text",
  fontSize: "0.875rem",
  padding: `$medium $medium`,
  textAlign: "center",
});
