import { styled } from "../../styles";

export const BadgeStyled = styled(
  "span",
  {
    alignItems: "center",
    backgroundColor: "$background",
    border: "1px solid $border",
    borderRadius: "$default",
    color: "$text",
    display: "inline-flex",
    fontSize: "0.75rem",
    fontWeight: "700",
    justifyContent: "center",
    margin: 0,
    outline: "none",
    padding: "$smaller $small",
    position: "relative",
    textDecoration: "none",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  {
    clickable: {
      false: {},
      true: {
        "&:active": {
          opacity: "0.5",
        },
        "&:hover": {
          opacity: "0.7",
        },
        cursor: "pointer",
        transition: "opacity 0.2s ease",
      },
    },
  },
);
