import { styled } from "../../styles";

export const TabsStyled = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

export const TabListStyled = styled(
  "div",
  {
    borderBottom: `1px solid $border`,
    display: "flex",
    marginBottom: "$medium",
  },
  {
    variant: {
      default: {
        borderBottom: `1px solid $border`,
      },
      minimal: {
        borderBottom: `1px solid $border`,
      },
    },
  },
);

export const TabButtonStyled = styled(
  "button",
  {
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
    "&:focus": {
      outline: `1px solid $brand`,
      outlineOffset: "2px",
    },
    "&:hover": {
      backgroundColor: "$hover",
    },
    background: "none",
    border: "none",
    color: "$text",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",

    padding: `$small $medium`,

    position: "relative",

    transition: "all 0.2s ease",
  },
  {
    active: {
      false: {},
      true: {
        "&::after": {
          backgroundColor: "$brand",
          bottom: "-2px",
          content: '""',
          height: "2px",
          left: 0,
          position: "absolute",
          right: 0,
        },
        color: "$text",

        fontWeight: "600",
      },
    },
  },
);

export const TabPanelStyled = styled("div", {
  "&:focus": {
    outline: `1px solid $brand`,
    outlineOffset: "2px",
  },
  outline: "none",

  padding: `$medium 0`,
});
