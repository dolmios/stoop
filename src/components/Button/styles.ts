import { styled } from "../../styles";

export const ButtonStyled = styled(
  "button",
  {
    // Disabled state
    "&:disabled": {
      cursor: "not-allowed",
      opacity: "0.5",
    },
    alignItems: "center",
    // Reset
    appearance: "none",
    // Border styling (matches Badge)
    border: "1px solid transparent",
    borderRadius: "$small",
    // Layout
    display: "inline-flex",

    // Typography - font-family inherited from global styles
    fontWeight: "700",
    justifyContent: "center",
    minHeight: "40px",

    // Interaction
    outline: "none",

    // Default padding and sizing
    padding: "$small $medium",

    position: "relative",
    textDecoration: "none",

    whiteSpace: "nowrap",
  },
  {
    block: {
      false: {
        display: "inline-flex",
        width: "auto",
      },
      true: {
        display: "flex",
        width: "100%",
      },
    },
    loading: {
      false: {},
      true: {
        cursor: "wait",
        opacity: "0.7",
      },
    },
    size: {
      normal: {
        minHeight: "40px",
        padding: "$small $medium",
      },
      small: {
        fontSize: "0.875rem",
        minHeight: "32px",
        padding: "$smaller $small",
      },
    },
    variant: {
      minimal: {
        "&:active:not(:disabled)": {
          backgroundColor: "$border",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "$hover",
        },
        backgroundColor: "transparent",

        border: "1px solid transparent",

        color: "$text",
      },
      primary: {
        "&:active:not(:disabled)": {
          opacity: "0.8",
        },
        "&:hover:not(:disabled)": {
          opacity: "0.9",
        },
        backgroundColor: "$text",
        color: "$background",
      },
      secondary: {
        "&:active:not(:disabled)": {
          backgroundColor: "$border",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "$hover",
        },
        backgroundColor: "$fill",
        color: "$text",
      },
    },
  },
);
