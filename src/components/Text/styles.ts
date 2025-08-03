import { styled } from "../../styles";

export const TextStyled = styled(
  "p",
  {
    margin: 0,
    padding: 0,
    // Color, font-family, and basic typography inherited from global styles
  },
  {
    muted: {
      false: {},
      true: {
        opacity: "0.7",
      },
    },
    size: {
      h1: {
        // Font family, size, weight, line-height inherited from global h1 styles
        paddingBottom: "$medium",
      },
      h2: {
        // Font family, size, weight, line-height inherited from global h2 styles
        paddingBottom: "$medium",
      },
      h3: {
        // Font family, size, weight, line-height inherited from global h3 styles
        paddingBottom: "$medium",
      },
      h4: {
        // Font family, size, weight, line-height inherited from global h4 styles
        paddingBottom: "$small",
      },
      h5: {
        // Font family, size, weight, line-height inherited from global h5 styles
        paddingBottom: "$small",
      },
      h6: {
        // Font family, size, weight, line-height inherited from global h6 styles
        paddingBottom: "$small",
      },
      label: {
        display: "block",
        fontSize: "clamp(0.8125rem, 0.75rem + 0.25vw, 0.875rem)",
        fontWeight: "600",
        lineHeight: "1.4",
        paddingBottom: "$smaller",
      },
      p: {
        // Font family, size, weight, line-height inherited from global p styles
        paddingBottom: "$small",
      },
      small: {
        // Font size inherited from global small styles
        paddingBottom: "$smaller",
      },
      span: {
        // All typography properties inherited
      },
      strong: {
        // Font family, weight inherited from global strong styles
      },
    },
  },
);
