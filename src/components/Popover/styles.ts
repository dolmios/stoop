import { styled } from "../../styles";

export const PopoverTriggerStyled = styled("div", {
  cursor: "pointer",
  display: "inline-block",
  position: "relative",
  width: "fit-content",
});

export const PopoverStyled = styled(
  "div",
  {
    // Default styling
    backgroundColor: "$fill",
    border: `1px solid $border`,

    // Sharp edges (key design language requirement)
    borderRadius: "$small",

    // Scrollable content
    maxHeight: "70vh",
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

    zIndex: "$popover",
  },
  {
    variant: {
      default: {
        backgroundColor: "$fill",
        border: `1px solid $border`,
        padding: "$small",
      },
      minimal: {
        backgroundColor: "$fill",
        border: `1px solid $border`,
        padding: "0",
      },
    },
  },
);
