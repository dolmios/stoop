import { styled } from "../../styles";

export const InputStyled = styled(
  "input",
  {
    // States
    "&::placeholder": {
      color: "$border",
      opacity: 1,
    },
    "&:disabled": {
      backgroundColor: "$border",
      cursor: "not-allowed",
      opacity: 0.6,
    },
    "&:focus": {
      borderColor: "$brand",
    },
    // Reset
    appearance: "none",
    // Styling
    backgroundColor: "$fill",
    border: "1px solid $border",
    borderRadius: "$small",
    color: "$text",
    display: "block",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.4",
    minHeight: "40px",
    outline: "none",
    padding: "$small $medium",
    transition: "border-color 0.2s ease",
    width: "100%",
  },
  {
    variant: {
      default: {
        backgroundColor: "$fill",
        border: "1px solid $border",
      },
      error: {
        borderColor: "red",
      },
    },
  },
);
