import { styled } from "../../styles";

export const SectionStyled = styled("section", {
  "@media (max-width: 768px)": {
    paddingLeft: "$small",
    paddingRight: "$small",
  },
  paddingLeft: "$medium",
  paddingRight: "$medium",
  position: "relative",
  width: "100%",
});

export const ContainerStyled = styled(
  "div",
  {
    margin: "0 auto",
    position: "relative",
    width: "100%",
  },
  {
    container: {
      false: {
        width: "100%",
      },
      true: {
        maxWidth: "1200px", // Standard content width
        width: "96%",
      },
    },
    wide: {
      false: {},
      true: {
        maxWidth: "1600px", // Wider for app layouts
        width: "98%",
      },
    },
  },
);
