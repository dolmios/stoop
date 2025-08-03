import { styled } from "../../styles";

export const CardStyled = styled(
  "div",
  {
    borderRadius: "$small",
    color: "$text",
    display: "flex",
    flexDirection: "column",
    margin: 0,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  {
    clickable: {
      false: {},
      true: {
        "&:active": {
          transform: "translateY(0)",
        },
        "&:focus-visible": {
          outline: `1px solid $brand`,
          outlineOffset: "2px",
        },
        "&:hover": {
          transform: "translateY(-2px)",
        },
        cursor: "pointer",
        transition: "all 0.2s ease",
      },
    },
    padding: {
      default: {
        padding: "$medium",
      },
      minimal: {
        padding: "0",
      },
      small: {
        padding: "$small",
      },
    },
    variant: {
      bordered: {
        backgroundColor: "transparent",
        border: `1px solid $border`,
      },
      default: {
        backgroundColor: "$fill",
        border: `1px solid $border`,
      },
    },
  },
);

export const CardHeaderStyled = styled(
  "div",
  {
    borderBottom: `1px solid $border`,
    fontWeight: "600",
  },
  {
    padding: {
      default: {
        padding: `$medium $medium $small $medium`,
      },
      minimal: {
        padding: "0",
      },
      small: {
        padding: `$small $small $smaller $small`,
      },
    },
  },
);

export const CardFooterStyled = styled(
  "div",
  {
    borderTop: `1px solid $border`,
    marginTop: "auto",
  },
  {
    padding: {
      default: {
        padding: `$small $medium $medium $medium`,
      },
      minimal: {
        padding: "0",
      },
      small: {
        padding: `$smaller $small $small $small`,
      },
    },
  },
);

export const CardContentStyled = styled(
  "div",
  {
    flex: "1",
  },
  {
    hasFooter: {
      false: {},
      true: {
        paddingBottom: "0",
      },
    },
    hasHeader: {
      false: {},
      true: {
        paddingTop: "0",
      },
    },
    padding: {
      default: {
        padding: "$medium",
      },
      minimal: {
        padding: "0",
      },
      small: {
        padding: "$small",
      },
    },
  },
);
